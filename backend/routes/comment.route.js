import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { addComment, getComments, pinComment } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/create-comment/:reelId", verifyJWT, addComment)
router.get("/get-comments/:reelId", getComments)
router.patch("/pin-comment/:commentId", verifyJWT, pinComment)

export default router;