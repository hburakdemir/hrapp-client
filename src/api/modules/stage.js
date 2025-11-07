import api from "../core/axios";

export const stageAPI = {
  getById: (stageId) => api.get(`/stages/${stageId}`),
  getAll: () => api.get(`/stages/`),
};
