// src/stores/authStore.js
import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthLoading: false, 
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, access_token } = await authService.login(credentials);
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      return { user, access_token };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Silent error handling
    } finally {
      set({ user: null, isAuthenticated: false, error: null, isAuthLoading: false });
    }
  },

  checkAuth: async () => {
    if (get().isAuthenticated && get().user) {
      return true;
    }

    set({ isAuthLoading: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, isAuthenticated: false, isAuthLoading: false });
        return false;
      }

      const { user } = await authService.validateToken();
      
      set({ user, isAuthenticated: true, isAuthLoading: false });
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, isAuthLoading: false });
      return false;
    }
  },

  initializeAuth: async () => {
    set({ isAuthLoading: true });
    const token = localStorage.getItem("token");
    if (token) {
      await get().checkAuth();
    } else {
      set({ isAuthLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
