import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http"
import { initSocket } from "./socket.js";
import "./workers/postNotification.worker.js";

const server = http.createServer(app)
initSocket(server)

connectDB()

server.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
