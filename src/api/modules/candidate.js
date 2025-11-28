import api from "../core/axios";

export const candidateAPI = {
  profile: () => api.get("/candidate/myProfile"), 

};
