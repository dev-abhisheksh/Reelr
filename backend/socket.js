import { Server } from "socket.io";
import Redis from "ioredis";

let io;
const onlineUser = new Map();

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["https://reelr.vercel.app", "http://localhost:5173"],
            credentials: true
        }
    });

    // Subscriber lives inside server process where io exists
    const subscriber = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        tls: { rejectUnauthorized: false }
    });

    subscriber.subscribe("new-notification", (err) => {
        if (err) console.error("Redis subscribe error:", err);
        else console.log("Subscribed to new-notification channel");
    });

    subscriber.on("message", (channel, message) => {
        if (channel === "new-notification") {
            const notification = JSON.parse(message);

            console.log("Notification received from Redis:", notification);
            console.log("Online users:", [...onlineUser.entries()]); // see who's online
            console.log("Looking for receiver:", notification.receiver.toString());

            const receiverSocketId = onlineUser.get(notification.receiver.toString());
            console.log("Receiver socket ID:", receiverSocketId); // null = not online

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("new-notification", notification);
                console.log(`Notification emitted to ${notification.receiver}`);
            } else {
                console.log("Receiver is not online, notification saved to DB only");
            }
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected", socket.id);

        socket.on("register", (userId) => {
            onlineUser.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUser.entries()) {
                if (socketId === socket.id) {
                    onlineUser.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};

export { initSocket, getIO, onlineUser };