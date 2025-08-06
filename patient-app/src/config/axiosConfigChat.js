import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const CHAT_BASE_URL = `${import.meta.env.VITE_BACKEND_CHAT_URL}/chat`;

const chatApi = axios.create({
  baseURL: CHAT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

chatApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle multipart/form-data for voice uploads
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

chatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuthStore.getState();
    const status = error.response?.status;

    if (status === 401) {
      const isChatEndpoint = error.config?.url?.includes('/chat');
      
      if (!isChatEndpoint) {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default chatApi;