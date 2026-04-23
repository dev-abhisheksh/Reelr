import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import { followUser } from "../controllers/follow.controller.js";

const router = express.Router();

router.post("/:followUserId", verifyJWT, followUser)

export default router