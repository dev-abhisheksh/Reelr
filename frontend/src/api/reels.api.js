import { API } from "./axiosInstance";

export const uploadReel = (formData) => API.post("/reel/upload", formData)
export const getAllReels = () => API.get("/reel/all")
export const incrementReelView = (reelId) => API.patch(`/reel/${reelId}/views`);
export const getReelById = (userId) => API.get(`/reel/all-reels/${userId}`);
export const deleteReel = async (id) => API.delete(`/reel/delete/${id}`)
export const updateReel = async (reelId, data) => {
    await API.patch(`/reel/update/${reelId}`, data);
};
