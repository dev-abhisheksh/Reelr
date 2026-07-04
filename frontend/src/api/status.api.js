import { API } from "./axiosInstance";

export const getStatus = async () => {
  const res = await API.get("/status/status");
  return res.data;
};

export const addStatus = async (formData) => {
  const res = await API.post("/status/add-status", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const viewStatus = async (statusId) => {
  const res = await API.post(`/status/view/${statusId}`);
  return res.data;
};