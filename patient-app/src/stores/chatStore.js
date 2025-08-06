import { create } from "zustand";
import { chatService } from "../services/chatService";

export const useChatStore = create((set, get) => ({
  // State
  messages: [],
  chatHistory: {},
  currentChat: null,
  loading: false,
  error: null,
  isSending: false,
  isFetching: false,
  isDeleting: false,
  isRecording: false,
  audioBlob: null,

  // Actions
  sendMessage: async (queryData) => {
    set({ isSending: true, error: null });
    try {
      const response = await chatService.sendMessage(queryData);
      
      // Add message to current messages
      const newMessage = {
        id: Date.now().toString(),
        text: queryData.text,
        response: response.answer,
        type: 'text',
        timestamp: new Date().toISOString(),
        source_language: queryData.source_language,
        target_language: queryData.target_language
      };

      set(state => ({
        messages: [...state.messages, newMessage],
        isSending: false,
        error: null
      }));

      return response;
    } catch (error) {
      set({ isSending: false, error: error.message });
      throw error;
    }
  },

  sendVoiceMessage: async (audioFile, targetLanguage = "en") => {
    set({ isSending: true, error: null });
    try {
      const response = await chatService.sendVoiceMessage(audioFile, targetLanguage);
      
      // Add voice message to current messages
      const newMessage = {
        id: Date.now().toString(),
        text: response.original_text,
        response: response.answer,
        type: 'voice',
        timestamp: new Date().toISOString(),
        detected_language: response.detected_language,
        translated_text: response.translated_text,
        file_size: response.file_size
      };

      set(state => ({
        messages: [...state.messages, newMessage],
        isSending: false,
        error: null,
        audioBlob: null
      }));

      return response;
    } catch (error) {
      set({ isSending: false, error: error.message });
      throw error;
    }
  },

  fetchChatHistory: async () => {
    set({ isFetching: true, error: null });
    try {
      const history = await chatService.getChatHistory();
      set({
        chatHistory: history,
        isFetching: false,
        error: null
      });
      return history;
    } catch (error) {
      set({ isFetching: false, error: error.message });
      throw error;
    }
  },

  fetchChatByDate: async (dateStr) => {
    set({ isFetching: true, error: null });
    try {
      const messages = await chatService.getChatByDate(dateStr);
      set({
        messages: messages,
        isFetching: false,
        error: null
      });
      return messages;
    } catch (error) {
      set({ isFetching: false, error: error.message });
      throw error;
    }
  },

  fetchChatById: async (chatId) => {
    set({ loading: true, error: null });
    try {
      const chat = await chatService.getChatById(chatId);
      set({
        currentChat: chat,
        loading: false,
        error: null
      });
      return chat;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  deleteChatHistory: async (dateStr = null) => {
    set({ isDeleting: true, error: null });
    try {
      const result = await chatService.deleteChatHistory(dateStr);
      
      // Update local state
      if (dateStr) {
        set(state => {
          const newHistory = { ...state.chatHistory };
          delete newHistory[dateStr];
          return {
            chatHistory: newHistory,
            isDeleting: false,
            error: null
          };
        });
      } else {
        set({
          chatHistory: {},
          messages: [],
          isDeleting: false,
          error: null
        });
      }

      return result;
    } catch (error) {
      set({ isDeleting: false, error: error.message });
      throw error;
    }
  },

  deleteChatById: async (chatId) => {
    set({ isDeleting: true, error: null });
    try {
      const result = await chatService.deleteChatById(chatId);
      
      // Remove from current messages if present
      set(state => ({
        messages: state.messages.filter(msg => msg.id !== chatId),
        isDeleting: false,
        error: null
      }));

      return result;
    } catch (error) {
      set({ isDeleting: false, error: error.message });
      throw error;
    }
  },

  testAudioUpload: async (audioFile) => {
    set({ loading: true, error: null });
    try {
      const result = await chatService.testAudioUpload(audioFile);
      set({ loading: false, error: null });
      return result;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Audio recording helpers
  setAudioBlob: (blob) => {
    set({ audioBlob: blob });
  },

  setRecording: (isRecording) => {
    set({ isRecording });
  },

  // Clear messages
  clearMessages: () => {
    set({ messages: [] });
  },

  // Clear current chat
  clearCurrentChat: () => {
    set({ currentChat: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Add message locally (for optimistic updates)
  addMessage: (message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  // Update message locally
  updateMessage: (messageId, updates) => {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    }));
  },

  // Remove message locally
  removeMessage: (messageId) => {
    set(state => ({
      messages: state.messages.filter(msg => msg.id !== messageId)
    }));
  }
}));