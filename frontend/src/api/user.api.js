import axios from "axios";

const API = axios.create({
    baseURL: "https://reelr.onrender.com/user",
    withCredentials: true,
});

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
        const res = await API.get("/my-reels", { withCredentials: true })
        const reelsData = res.data;
        return reelsData;
    } catch (error) {
        console.error("Error fetching user reels", error)
        throw error;
    }
}

export const updateProfileData = async (fullName, bio) => {
    return API.post("/update-profile", { fullName, bio });
};


export const profileImagesUpload = async (file, type) => {
    const form = new FormData();
    form.append("image", file);
    form.append("type", type);

    return await API.post("/upload-image", form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
