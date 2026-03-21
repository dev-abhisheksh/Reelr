import { API } from "./axiosInstance";


export const toggleLike = (reelId) => API.post(`/like/toggle-like/${reelId}`)