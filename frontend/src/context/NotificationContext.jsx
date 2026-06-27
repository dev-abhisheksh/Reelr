import React from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { API } from "../api/axiosInstance";
import { fetchNotifications } from "../api/notification.api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const {user, setUser, loading:authLoading} = useAuth()

    useEffect(() => {
        const fetchAllNotifications = async () => {
            try {
                if(authLoading) return;
                if(!user) return
                const res = await fetchNotifications();
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.unreadCount);
                console.log(res.data)
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        }
        fetchAllNotifications()
    }, [user, authLoading])

    // useEffect(() => {
    //     if(authLoading) return;
    //     if(!user) return;

    //     // 2. Connect socket for real-time notifications
    //     const socket = io("http://localhost:8000", {
    //         auth: { token },
    //         transports: ["websocket"]
    //     });

    //     socket.on("connect", () => {
    //         console.log("Notification socket connected");
    //         socket.emit("register", user._id || user.id);
    //     });

    //     socket.on("new-notification", (notification) => {

    //         setNotifications((prev) => [notification, ...prev]);
    //         setUnreadCount((prev) => prev + 1);

    //         if (notification.type === "new-post") {

    //             toast("Someone posted a new reel!", {
    //                 description: "Tap to view",
    //                 duration: 4000,
    //                 action: {
    //                     label: "View",
    //                     onClick: () =>
    //                         window.location.href = `/post/${notification.postId}`
    //                 }
    //             });

    //         }

    //         if (notification.type === "follow-request") {

    //             toast("New follow request", {
    //                 description: `${notification.sender.username} wants to follow you`,
    //                 duration: 4000,
    //                 action: {
    //                     label: "View",
    //                     onClick: () =>
    //                         window.location.href = `/notifications`
    //                 }
    //             });

    //         }
    //     });

    //     socket.on("disconnect", () => {
    //         console.log("Notification socket disconnected");
    //     });

    //     return () => socket.disconnect();
    // }, [user, authLoading]);

    const markAllRead = async () => {
        setUnreadCount(0);
        try {
            await API.patch("/notification/mark-read");
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};