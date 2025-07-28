import api from "../config/axiosConfigAuth";

const normalizeError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.detail ||
    error.message ||
    fallbackMessage;
  throw new Error(message);
};

export const patientService = {
  getDoctors: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}/doctors`);
      if (response.data.status !== "success") {
        throw new Error("Failed to fetch doctors");
      }
      return response.data.data;
    } catch (error) {
      normalizeError(error, "Failed to fetch doctors");
    }
  },

  getProfile: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      if (response.data.status !== "success") {
        throw new Error("Failed to fetch profile");
      }
      return response.data.data;
    } catch (error) {
      normalizeError(error, "Failed to fetch profile");
    }
  },

  updateProfile: async (updateData) => {
    try {
      const response = await api.put("/patients/me/update", updateData);
      if (response.data.status !== "success") {
        throw new Error("Failed to update profile");
      }
      return response.data.data;
    } catch (error) {
      normalizeError(error, "Failed to update profile");
    }
  },
};
