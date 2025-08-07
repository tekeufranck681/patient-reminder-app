import chatApi from "../config/axiosConfigChat";

const normalizeError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.message ||
    fallbackMessage;
  throw new Error(message);
};

export const chatService = {
  // Send text chat message
  sendMessage: async (queryData) => {
    try {
      const response = await chatApi.post("chat/", {
        text: queryData.text,
        source_language: queryData.source_language || "en",
        target_language: queryData.target_language || "en"
      });
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to send message");
    }
  },

  // Send voice message
  sendVoiceMessage: async (audioFile, targetLanguage = "en") => {
    try {
      const formData = new FormData();
      formData.append("audio_file", audioFile);
      formData.append("target_language", targetLanguage);

      const response = await chatApi.post("chat/voice", formData);
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to send voice message");
    }
  },

  // Get chat history grouped by date
  getChatHistory: async () => {
    try {
      const response = await chatApi.get("chat/history");
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to fetch chat history");
    }
  },

  // Get chat messages for a specific date
  getChatByDate: async (dateStr) => {
    try {
      const response = await chatApi.get(`chat/history/${dateStr}`);
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to fetch chat messages for date");
    }
  },

  // Get specific chat by ID
  getChatById: async (chatId) => {
    try {
      const response = await chatApi.get(`chat/history/chat/${chatId}`);
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to fetch chat message");
    }
  },

  // Delete chat history (all or by date)
  deleteChatHistory: async (dateStr = null) => {
    try {
      const params = dateStr ? { date_str: dateStr } : {};
      const response = await chatApi.delete("chat/history", { params });
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to delete chat history");
    }
  },

  // Delete specific chat by ID
  deleteChatById: async (chatId) => {
    try {
      const response = await chatApi.delete(`chat/history/${chatId}`);
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to delete chat message");
    }
  },

  // Test audio upload
  testAudioUpload: async (audioFile) => {
    try {
      const formData = new FormData();
      formData.append("audio_file", audioFile);

      const response = await chatApi.post("chat/voice/test", formData);
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to test audio upload");
    }
  }
};