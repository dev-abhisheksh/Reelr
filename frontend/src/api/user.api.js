import axios from "axios";

// Get token from localStorage (you’ll store it after login)
const getToken = () => localStorage.getItem("accessToken");

const API = axios.create({
    baseURL: "https://reelr.onrender.com/user",
});

// Interceptor to attach token automatically
API.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const userProfile = async () => {
    try {
        const res = await API.get("/me");
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
        const res = await API.get("/my-reels");
        return res.data;
    } catch (error) {
        console.error("Error fetching user reels", error);
        throw error;
    }
};

export const updateProfileData = async (fullName, bio) => {
    return API.post("/update-profile", { fullName, bio });
};

export const profileImagesUpload = async (file, type) => {
    const form = new FormData();
    form.append("image", file);
    form.append("type", type);

    return await API.post("/upload-image", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const Friends = async () => {
    return API.get("/friends")
}

export const SearchUsers = async (query) => {
    return API.get(`/search-users?query=${query}`)
}

export const getUserProfileById = async (userId) => {
    return API.get(`/user-profile/${userId}`)
}

export const addFriend = async (friendId) => {
    return API.post(`/friends-add/${friendId}`)
}

export const checkFriendStatus = async (userId) => {
    return API.get(`/check-friendship/${userId}`)
}

export const removeFriend = async (friendId) => {
    return API.delete(`friend-remove/${friendId}`)
}