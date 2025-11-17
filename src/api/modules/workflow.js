import api from "../core/axios";

export const workflowAPI = {
  getAll: () => api.get("/workflows/get"),
  getById: (id) => api.get(`/workflows/get/${id}`),
  create: (data) => api.post("/workflows/add", data),
  update: (id, data) => api.put(`/workflows/update/${id}`, data),
  delete: (id) => api.delete(`/workflows/delete/${id}`),
  
  // workflow atama bu
  assignToCandidate: (data) => api.post("/workflows/assign", data),
  getAllAssignments: () => api.get('/workflows/getAssign'),
  
};