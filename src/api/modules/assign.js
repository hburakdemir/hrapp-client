import api from "../core/axios";

export const assignAPI = {
   myAssign: () => api.get("/assignment/pipeline"), 
};