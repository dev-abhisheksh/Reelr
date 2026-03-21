import { API } from "./axiosInstance";


export const userProfile = async () => {
    try {
        const res = await API.get("/user/me");
        const user = res.data?.user;
        const userId = user?._id;
        return { user, userId };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const myReels = async () => {
    try {
        const res = await API.get("/user/my-reels");
        return res.data;
    } catch (error) {
        console.error("Error fetching user reels", error);
        throw error;
    }
};

export const updateProfileData = async (fullName, bio) => {
    return API.post("/user/update-profile", { fullName, bio });
};

export const profileImagesUpload = async (file, type) => {
    const form = new FormData();
    form.append("image", file);
    form.append("type", type);

    return await API.post("/user/upload-image", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const Friends = async () => {
    return API.get("/user/friends")
}

export const SearchUsers = async (query) => {
    return API.get(`/user/search-users?query=${query}`)
}

export const getUserProfileById = async (userId) => {
    return API.get(`/user-profile/${userId}`)
}

export const addFriend = async (friendId) => {
    return API.post(`/user/friends-add/${friendId}`)
}

export const checkFriendStatus = async (userId) => {
    return API.get(`/user/check-friendship/${userId}`)
}

export const removeFriend = async (friendId) => {
    return API.delete(`/user/friends-remove/${friendId}`)
}