import axios from "axios";

const getToken = () => localStorage.getItem("accessToken")

const API = axios.create({
    baseURL: "https://reelr.onrender.com/api/reel"  /*"https://reelr.onrender.com/auth"*/
})

API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const uploadReel = (formData) => API.post("/upload", formData)
export const getAllReels = () => API.get("/all")
export const incrementReelView = (reelId) => API.patch(`/${reelId}/views`);
export const getReelById = (userId) => API.get(`/all-reels/${userId}`);
export const updateReel = async (reelId, data) => {
    await API.patch(`/update/${reelId}`, data);
};