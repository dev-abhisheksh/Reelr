import { Notification } from "../models/notification.model.js";

// GET /notification — fetch all notifications for the logged-in user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ receiver: userId })
            .populate("sender", "username profileImage")
            .populate("postId", "text image")
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            receiver: userId,
            isRead: false
        });

        return res.status(200).json({
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

// PATCH /notification/mark-read — mark all notifications as read
const markNotificationsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { receiver: userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        console.error("Failed to mark notifications read:", error);
        return res.status(500).json({ message: "Failed to mark notifications read" });
    }
};

export { getNotifications, markNotificationsRead };
