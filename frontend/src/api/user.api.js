import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/user",
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
