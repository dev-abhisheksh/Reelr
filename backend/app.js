import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import reelRoutes from "./routes/reel.routes.js"

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: "https://reelr.vercel.app",
    credentials: true  
}));

app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/api/reel/", reelRoutes)

export { app }