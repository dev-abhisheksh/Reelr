import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js"
import { upload } from "../config/multer.js"
import { createPost, getPostsByUser } from "../controllers/post.controller.js"

const router = express.Router()

router.post("/create", verifyJWT, upload.single("image"), createPost)
router.get("/", verifyJWT, getPostsByUser)

export default router;  