import api from "../core/axios";

export const workflowAPI = {
  getAll: () => api.get("/workflows"),
  getById: (id) => api.get(`/workflows/${id}`),
  create: (data) => api.post("/workflows/add", data),
  update: (id, data) => api.put(`/workflows/update/${id}`, data),
  delete: (id) => api.delete(`/workflows/delete/${id}`),
  
  // workflow atama bu
  assignToCandidate: (data) => api.post("/workflows/assign", data),
  getAllAssignments: () => api.get('/workflows/getAssign'),
  
};