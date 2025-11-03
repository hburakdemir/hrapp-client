import api from "../core/axios";

export const userAPI = {
  updateCandidateProfile: (data) => api.put("/candidate/update", data ), 
 
};
