import { API } from "./axiosInstance";

export const addComment = (reelId, comment) => API.post(`/comment/add/${reelId}`, { comment })