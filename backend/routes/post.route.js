import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js"
import { upload } from "../config/multer.js"
import { createPost, getFeed, getPostsByUser } from "../controllers/post.controller.js"

const router = express.Router()

router.post("/create", verifyJWT, upload.single("image"), createPost)
router.get("/", verifyJWT, getPostsByUser)
router.get("/feed", verifyJWT, getFeed)

export default router;  