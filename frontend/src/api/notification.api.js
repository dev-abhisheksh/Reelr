import { API } from "./axiosInstance";

export const fetchNotifications = ()=> API.get("/notification/");