import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

export const API = axios.create({
    baseURL: "http://localhost:8000",
});
// https://reelr.onrender.com
// ✅ Attach Bearer token to all requests automatically
API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

