import api from "../core/axios";

export const taskAPI = {
  createTask: (stageId, data) => api.post(`/stages/${stageId}/tasks`, data),
  getTasksByStage: (stageId) => api.get(`/stages/${stageId}/tasks`),
  getTaskById: (taskId) => api.get(`/tasks/${taskId}`),
  updateTask: (taskId, data) => api.put(`/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
  
};