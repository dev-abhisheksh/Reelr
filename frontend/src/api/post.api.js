import { API } from "./axiosInstance";


export const fetchFeedPosts = () => API.get("/post/feed")