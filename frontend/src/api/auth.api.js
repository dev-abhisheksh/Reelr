// src/api/auth.api.js
import axios from "axios";

const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
  baseURL: "https://reelr.onrender.com/auth",
});

// ✅ Attach Bearer token to all requests automatically
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data) => API.post("/login", data);

export const verifyUser = () => API.get("/verify");

export const registerUser = (data) => API.post("/register", data);

export const logout = () => API.get("/logout");

