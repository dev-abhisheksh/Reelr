import { API } from "./axiosInstance";

export const getStatus = ()=> API.get("/status/status")