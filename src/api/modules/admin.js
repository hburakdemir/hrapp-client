import api from "../core/axios";

export const adminAPI = {
  getUsers: (params) => api.get("/admin/users", { params }), 
  createUser: (userData) => api.post("/admin/users", userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
