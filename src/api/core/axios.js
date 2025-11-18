import axios from "axios";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
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
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");
      

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");
        const { accessToken } = res.data.data;

        localStorage.setItem("token", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        toast.error("Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;