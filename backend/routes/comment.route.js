import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { addComment, getComments } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/create-comment/:reelId", verifyJWT, addComment)
router.get("/get-comments/:reelId", getComments)

export default router;