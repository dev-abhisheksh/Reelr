import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const user = JSON.parse(localStorage.getItem("user"));
        if (!token || !user) return;

        const socket = io("https://your-main-backend.onrender.com", {
            auth: { token },
            transports: ["websocket"]
        });

        socket.on("connect", () => {
            console.log("Notification socket connected");
            socket.emit("register", user._id); // map userId → socketId on server
        });

        // Listen for new notifications from worker
        socket.on("new-notification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });

        socket.on("disconnect", () => {
            console.log("Notification socket disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const markAllRead = () => setUnreadCount(0);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};