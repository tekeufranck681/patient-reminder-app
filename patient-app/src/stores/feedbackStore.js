import { create } from "zustand";
import { feedbackService } from "../services/feedbackService";

export const useFeedbackStore = create((set, get) => ({
  feedback: null,
  loading: false,
  error: null,
  isSubmitting: false,

  submitFeedback: async (feedbackData) => {
    set({ isSubmitting: true, error: null });
    try {
      const feedback = await feedbackService.createFeedback(feedbackData);
      set({ 
        feedback, 
        isSubmitting: false,
        error: null 
      });
      return feedback;
    } catch (error) {
      set({ isSubmitting: false, error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearFeedback: () => set({ feedback: null, error: null }),
}));