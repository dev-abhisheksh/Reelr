import { API } from "./axiosInstance";

export const addComment = (reelId, comment, parentComment = null) => 
    API.post(`/comment/add/${reelId}`, { comment, parentComment });

export const getComments = (reelId) => 
    API.get(`/comment/get/${reelId}`);