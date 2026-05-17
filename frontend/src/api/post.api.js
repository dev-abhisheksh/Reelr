import { API } from "./axiosInstance";

export const fetchFeedPosts = () => API.get("/post/feed");
export const createPost = (formData) => API.post("/post/create", formData);
