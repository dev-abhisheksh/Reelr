import express from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { commentOnReel } from "./comment.controller.js";

const router = express.Router()
router.use(verifyJWT)

router.post("/add/:reelId", commentOnReel)

export default router;