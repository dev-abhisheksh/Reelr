import axios from "axios";

const BASE_URL = "http://localhost:8000/auth";

export const loginUser = (data) =>
  axios.post(`${BASE_URL}/login`, data, { withCredentials: true });
