import { API } from "./axiosInstance";

export const SearchAPI = (searchQuery) => API.get(`/search?query=${searchQuery}`)