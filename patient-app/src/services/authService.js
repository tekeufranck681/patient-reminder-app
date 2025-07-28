// src/services/authService.js
import api from "../config/axiosConfigAuth";

const normalizeError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.detail ||
    error.message ||
    fallbackMessage;
  throw new Error(message);
};

export const authService = {
  login: async ({ email, password }) => {
    try {
      const response = await api.post("/patients/login", { email, password });
      const { access_token, token_type, patient } = response.data.data;
      
      localStorage.setItem("token", access_token);
      return { user: patient, access_token, token_type };
    } catch (error) {
      normalizeError(error, "Login failed");
    }
  },

  validateToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      
      const response = await api.post("/verify-token");
      if (response.data.status !== "success") {
        throw new Error("Token invalid or expired");
      }
      const user = response.data.data;
      return { user };
    } catch (error) {
      localStorage.removeItem("token");
      normalizeError(error, "Token validation failed");
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("token");
      return { message: "Logged out successfully" };
    } catch (error) {
      normalizeError(error, "Logout failed");
    }
  },
};
