import { Server } from "socket.io";

let io;

const onlineUser = new Map()

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["https://reelr.vercel.app", "http://localhost:5173"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected", socket.id)

        socket.on("register", (userId) => {
            onlineUser.set(userId, socket.id)
            console.log(`User ${userId} registered with socket ${socket.id}`)
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUser.entries()) {
                if (socketId === socket.id) {
                    onlineUser.delete(userId)
                    console.log(`User ${userId} disconnected`)
                    break;
                }
            }
        })
    })
}

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized")
    return io
}

export {
    initSocket,
    getIO,
    onlineUser
}