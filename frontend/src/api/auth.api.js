// src/api/auth.api.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/auth";

export const loginUser = (data) =>
  axios.post(`${BASE_URL}/login`, data, { withCredentials: true });

export const verifyUser = () =>
  axios.get(`${BASE_URL}/verify`, { withCredentials: true }); // ✅

export const registerUser = (data) => {
  return axios.post(`${BASE_URL}/register`, data, { withCredentials: true });
};
