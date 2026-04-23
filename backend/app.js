import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import reelRoutes from "./routes/reel.routes.js"
import likeRoutes from "./routes/like.route.js"
import commentRoutes from "./routes/comment.route.js"
import postRoutes from "./routes/post.route.js"
import followRoutes from "./routes/follow.route.js"

dotenv.config()

const app = express();

app.set("trust proxy", true);

app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: ["https://reelr.vercel.app", "http://localhost:5173"],
    credentials: true
}));

app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/reel", reelRoutes)
app.use("/like", likeRoutes)
app.use("/comment", commentRoutes)
app.use("/post", postRoutes)
app.use("/follow", followRoutes)

export { app }