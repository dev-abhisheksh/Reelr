import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { addComment } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/create-comment/:reelId", verifyJWT, addComment)

export default router;