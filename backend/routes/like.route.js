import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import { likeToggle } from "../controllers/like.controller.js";

const router = express.Router();

router.post("/toggle-like/:reelId", verifyJWT, likeToggle)

export default router;