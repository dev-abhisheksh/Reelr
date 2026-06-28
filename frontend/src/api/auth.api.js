import { API } from "./axiosInstance";

export const loginUser = (data) => API.post("/auth/login", data);

export const verifyUserIdentity = () => API.get("/auth/verify");

export const registerUser = (data) => API.post("/auth/register", data);

export const logout = () => API.get("/auth/logout");

export const refreshToken = () => API.post("/auth/refresh-token");

export const logoutFromAllDevices = ()=> API.get("/auth/logout-all")