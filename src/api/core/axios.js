import axios from "axios";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");
    
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !isAuthEndpoint
    ) {
      const message =
        error.response?.data?.message ||
        "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.";
      toast.error(message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;