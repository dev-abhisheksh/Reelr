import { API } from "./axiosInstance";

export const followUser = (followUserId) => API.post(`/follow/${followUserId}`)

export const followStatus = (userId) => API.get(`/follow/is-following/${userId}`)

export const unfollowUser = (userId) => API.patch(`/follow/unfollow/${userId}`)

export const followRequests = () => API.get("/follow/requests")

export const acceptFollowRequest = (followRequestId) => API.patch(`/follow/accept/${followRequestId}`)