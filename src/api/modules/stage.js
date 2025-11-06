import api from "../core/axios";

export const stageAPI = {
  getById: (stageId) => api.get(`/stages/${stageId}`),
  getTasksByStage: (stageId) => api.get(`/stages/${stageId}/tasks`),
};
