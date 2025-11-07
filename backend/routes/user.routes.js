import express from "express"
import { upload } from "../config/multer.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { getMyProfile, myReels, updateProfile, uploadUserImage } from "../controllers/user.controller.js";
import { uploadReel } from "../controllers/reel.controller.js";

const router = express.Router();

// router.post("/upload-image", verifyJWT, upload.single("image"), uploadUserImage)
router.post("/upload-image", verifyJWT, upload.any(), uploadUserImage)
router.get("/me", verifyJWT, getMyProfile)
router.post("/update-profile", verifyJWT, updateProfile)
router.get("/my-reels", verifyJWT, myReels)

export default router