import { API } from "./axiosInstance";

export const getStatus = async () => {
  const res = await API.get("/status/status");
  return res.data;
};