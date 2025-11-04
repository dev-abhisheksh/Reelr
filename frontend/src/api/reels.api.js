import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/reel",
    withCredentials: true,
})

export const uploadReel = (formData)=>API.post("/upload",formData)
export const getAllReels = ()=> API.get("/all")
export const incrementReelView = (reelId) => API.patch(`/${reelId}/views`);
