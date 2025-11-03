import api from "../core/axios";

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  refresh: () => api.post("/auth/refresh"), 
  logout: () => api.post("/auth/logout"), 
  getProfileStauts: () => api.get("/user/profile-status")
};