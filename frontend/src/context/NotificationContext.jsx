import React from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { API } from "../api/axiosInstance";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch saved notifications from DB (covers offline period)
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await API.get("/notification");
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user"));
        if (!token || !user) return;

        // 1. Fetch existing notifications from DB (catches anything missed while offline)
        fetchNotifications();

        // 2. Connect socket for real-time notifications
        const socket = io("http://localhost:8000", {
            auth: { token },
            transports: ["websocket"]
        });

        socket.on("connect", () => {
            console.log("Notification socket connected");
            socket.emit("register", user._id || user.id);
        });

        socket.on("new-notification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // 🔔 Show sonner toast
            toast(`Someone posted a new reel!`, {
                description: "Tap to view",
                duration: 4000,
                action: {
                    label: "View",
                    onClick: () => window.location.href = `/post/${notification.postId}`
                }
            });
        });

        socket.on("disconnect", () => {
            console.log("Notification socket disconnected");
        });

        return () => socket.disconnect();
    }, [fetchNotifications]);

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