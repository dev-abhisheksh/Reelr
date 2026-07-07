import express from "express";
import verifyJWT from "../../middlewares/auth.middleware";
import { addCommentOnPost, fetchAllCommentsOfAPost } from "./postComment.controller";

const router = express.Router();

router.use(verifyJWT)

router.post("/comment-post/:postId", addCommentOnPost);
router.post("/post-comments/:postId", fetchAllCommentsOfAPost);

export default router;