import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useToast } from '../../contexts/ToastContext';

const ChatBotWidget = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const {
    messages,
    isSending,
    sendMessage,
    sendVoiceMessage,
    clearMessages,
    error,
    clearError
  } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      addToast(error, 'error');
      clearError();
    }
  }, [error, addToast, clearError]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const messageText = message.trim();
    setMessage('');

    try {
      await sendMessage({
        text: messageText,
        source_language: 'en',
        target_language: 'en'
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
        
        try {
          await sendVoiceMessage(audioFile, 'en');
        } catch (error) {
          console.error('Failed to send voice message:', error);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      addToast('Microphone access denied', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
      >
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
            >
              Any concerns about your medication or services? Use the chatbot!
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 60 : 500
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              height: { duration: 0.3, ease: "easeInOut" }
            }}
            className="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <h3 className="font-medium">EcoHealth Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-blue-700"
                  title={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-blue-700"
                  title="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Content - Only show when not minimized */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-4">
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          👋 Hi! I'm your EcoHealth assistant. I can help you with questions about medications, services, appointments, and more. How can I assist you today?
                        </p>
                      </div>
                    )}

                    {/* Chat Messages */}
                    {messages.map((msg, index) => (
                      <div key={index} className="space-y-2">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                            <p className="text-sm">{msg.text}</p>
                            <span className="text-xs opacity-75 mt-1 block">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Bot Response */}
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-xs">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {msg.response}
                            </p>
                            {msg.type === 'voice' && (
                              <div className="flex items-center space-x-1 mt-2">
                                <Volume2 className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  Voice message ({msg.detected_language})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {isSending && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isSending}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      
                      <button
                        type="button"
                        onClick={toggleRecording}
                        disabled={isSending}
                        className={`p-2 rounded-lg transition-colors ${
                          isRecording 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>

                      <button
                        type="submit"
                        disabled={!message.trim() || isSending}
                        className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>

                    {messages.length > 0 && (
                      <button
                        onClick={clearMessages}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2 transition-colors"
                      >
                        Clear conversation
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBotWidget;
