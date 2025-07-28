import feedbackApi from "../config/axiosConfigFeedback";

const normalizeError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.detail ||
    error.message ||
    fallbackMessage;
  throw new Error(message);
};

export const feedbackService = {
  createFeedback: async (feedbackData) => {
    try {
      const formData = new FormData();
      
      if (feedbackData.emoji) {
        formData.append("emoji", feedbackData.emoji);
      }
      
      if (feedbackData.star_rating) {
        formData.append("star_rating", feedbackData.star_rating);
      }
      
      if (feedbackData.text) {
        formData.append("text", feedbackData.text);
      }
      
      if (feedbackData.voice_message) {
        formData.append("voice_message", feedbackData.voice_message);
      }

      const response = await feedbackApi.post("/", formData);
      return response.data;
    } catch (error) {
      normalizeError(error, "Failed to submit feedback");
    }
  },
};
