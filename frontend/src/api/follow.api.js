import { API } from "./axiosInstance";

export const followUser = (followUserId) => API.post(`/follow/${followUserId}`)

export const followStatus = (userId)=> API.get(`/follow/is-following/${userId}`)