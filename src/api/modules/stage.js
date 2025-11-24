import api from "../core/axios";

export const stageAPI = {
  getById: (stageId) => api.get(`/stages/${stageId}`),
  getAll: () => api.get(`/stages/`),
  update: (stageId, data) => api.put(`stages/${stageId}`,data),
};
