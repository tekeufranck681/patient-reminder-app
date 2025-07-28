import { create } from "zustand";
import { patientService } from "../services/patientService";

export const usePatientStore = create((set, get) => ({
  doctors: [],
  profile: null,
  loading: false,
  error: null,
  isUpdating: false,

  fetchDoctors: async () => {
    set({ loading: true, error: null });
    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const doctors = await patientService.getDoctors(user.id);
      set({ 
        doctors, 
        loading: false,
        error: null 
      });
      return doctors;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const profile = await patientService.getProfile(user.id);
      set({ 
        profile, 
        loading: false,
        error: null 
      });
      return profile;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  updateProfile: async (updateData) => {
    set({ isUpdating: true, error: null });
    try {
      const updatedPatient = await patientService.updateProfile(updateData);
      
      // Update the user in auth store with the new data
      const { useAuthStore } = await import('./authStore');
      const { setUser } = useAuthStore.getState();
      setUser(updatedPatient);
      
      // Update profile in store as well
      set({ 
        profile: updatedPatient,
        isUpdating: false,
        error: null 
      });
      
      return updatedPatient;
    } catch (error) {
      set({ isUpdating: false, error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearAll: () => set({ 
    doctors: [], 
    profile: null, 
    loading: false, 
    error: null, 
    isUpdating: false
  }),
}));
