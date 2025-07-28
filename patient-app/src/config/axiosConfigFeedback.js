import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const FEEDBACK_BASE_URL = `${import.meta.env.VITE_BACKEND_FEEDBACK_URL}/feedback`;

const feedbackApi = axios.create({
  baseURL: FEEDBACK_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

feedbackApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

feedbackApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuthStore.getState();
    const status = error.response?.status;

    if (status === 401) {
      const isFeedbackEndpoint = error.config?.url?.includes('/feedback');
      
      if (!isFeedbackEndpoint) {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default feedbackApi;