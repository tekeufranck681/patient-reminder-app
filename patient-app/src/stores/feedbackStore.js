import { create } from "zustand";
import { feedbackService } from "../services/feedbackService";

export const useFeedbackStore = create((set, get) => ({
  feedback: null,
  feedbacks: [],
  loading: false,
  error: null,
  isSubmitting: false,
  isFetching: false,
  isResending: false,

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

  fetchMyFeedbacks: async () => {
    set({ isFetching: true, error: null });
    try {
      const feedbacks = await feedbackService.getMyFeedbacks();
      set({ 
        feedbacks, 
        isFetching: false,
        error: null 
      });
      return feedbacks;
    } catch (error) {
      set({ isFetching: false, error: error.message });
      throw error;
    }
  },

  resendFeedback: async (feedbackId) => {
    set({ isResending: true, error: null });
    try {
      const feedback = await feedbackService.resendFeedback(feedbackId);
      
      // Add the new feedback to the beginning of the list
      const { feedbacks } = get();
      set({ 
        feedback,
        feedbacks: [feedback, ...feedbacks],
        isResending: false,
        error: null 
      });
      return feedback;
    } catch (error) {
      set({ isResending: false, error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearFeedback: () => set({ feedback: null, error: null }),

  clearFeedbacks: () => set({ feedbacks: [], error: null }),
}));
