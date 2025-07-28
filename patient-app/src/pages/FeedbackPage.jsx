import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useToast } from '../contexts/ToastContext';
import { useFeedbackStore } from '../stores/feedbackStore';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  X, 
  Star,
  Send
} from 'lucide-react';
import SEO from '../components/SEO';

const FeedbackPage = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { submitFeedback, isSubmitting, error, clearError } = useFeedbackStore();
  
  const [formData, setFormData] = useState({
    text: '',
    star_rating: 0,
    emoji: '',
    voice_message: null
  });
  
  const [errors, setErrors] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Available emojis for feedback
  const emojis = [
  '😀',  // position 0 - very happy
  '😄',  // position 1 - very happy (was showing �)
  '😊',  // position 2 - very happy
  '🙂',  // position 3 - satisfied (was showing �)
  '😌',  // position 4 - satisfied
  '😐',  // position 5 - neutral
  '😑',  // position 6 - neutral
  '😕',  // position 7 - dissatisfied (was showing �)
  '😟',  // position 8 - dissatisfied
  '😢',  // position 9 - unhappy
  '😠',  // position 10 - unhappy
  '😡'   // position 11 - unhappy
];
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Convert blob to file for form submission
        const file = new File([blob], 'voice_message.webm', { type: 'audio/webm' });
        setFormData(prev => ({ ...prev, voice_message: file }));
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      addToast('Microphone access denied', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(intervalRef.current);
    }
  };

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setAudioBlob(null);
    setRecordingTime(0);
    setFormData(prev => ({ ...prev, voice_message: null }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.text && !audioBlob && !formData.star_rating && !formData.emoji) {
      newErrors.general = t('feedbackRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    clearError();
    
    try {
      // Prepare data for submission - only send non-empty fields
      const submissionData = {};
      
      if (formData.text) submissionData.text = formData.text;
      if (formData.star_rating) submissionData.star_rating = formData.star_rating;
      if (formData.emoji) submissionData.emoji = formData.emoji;
      if (formData.voice_message) submissionData.voice_message = formData.voice_message;
      
      await submitFeedback(submissionData);
      addToast(t('feedbackSubmitted'), 'success');
      
      // Reset form
      setFormData({
        text: '',
        star_rating: 0,
        emoji: '',
        voice_message: null
      });
      setAudioBlob(null);
      setRecordingTime(0);
      setErrors({});
    } catch (error) {
      addToast(error.message || t('feedbackError'), 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors.general) {
      setErrors({});
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Patient Feedback - EcoHealth",
    "description": "Share your healthcare experience and provide feedback to help improve our services",
    "mainEntity": {
      "@type": "Review",
      "itemReviewed": {
        "@type": "MedicalOrganization",
        "name": "EcoHealth"
      }
    }
  };

  return (
    <>
      <SEO 
        title={t('feedback')}
        description="Share your healthcare experience with EcoHealth. Provide feedback through text, ratings, emojis, or voice messages to help us improve our services."
        keywords="patient feedback, healthcare review, service rating, voice feedback, patient experience"
        structuredData={structuredData}
      />
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('feedbackTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('feedbackDescription')}
          </p>
        </div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Written Feedback */}
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('writtenFeedback')}
              </label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                placeholder="Share your thoughts and experiences..."
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.text.length}/500 {t('characterCount')}
                </span>
              </div>
            </div>

            {/* Voice Recording */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('voiceRecording')}
              </label>
              
              <div className="space-y-4">
                {/* Recording Controls */}
                <div className="flex items-center space-x-4">
                  {!isRecording && !audioBlob && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <Mic className="h-4 w-4" />
                      <span>{t('startRecording')}</span>
                    </button>
                  )}
                  
                  {isRecording && (
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <MicOff className="h-4 w-4" />
                        <span>{t('stopRecording')}</span>
                      </button>
                      
                      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">
                          {t('recordingTime')}: {formatTime(recordingTime)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {audioBlob && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={playRecording}
                        disabled={isPlaying}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span>{t('playRecording')}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={cancelRecording}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <X className="h-4 w-4" />
                        <span>{t('cancelRecording')}</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <audio ref={audioRef} style={{ display: 'none' }} />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('rating')}
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, star_rating: star }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= formData.star_rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      } transition-colors`}
                    />
                  </motion.button>
                ))}
                {formData.star_rating > 0 && (
                  <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                    {formData.star_rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Emoji Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('howDoYouFeel')}
              </label>
              <div className="flex items-center space-x-3 flex-wrap">
                {emojis.map((emoji) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-3xl p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formData.emoji === emoji
                        ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {(errors.general || error) && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.general || error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? t('submitting') : t('submitFeedback')}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default FeedbackPage;
