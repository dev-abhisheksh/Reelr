import express from "express"
import { upload } from "../config/multer.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { addFriend, allUsers, checkFriendStatus, getAllFriends, getMyProfile, getUserProfile, myReels, removeFriend, searchUsers, updateProfile, uploadUserImage } from "../controllers/user.controller.js";
import { uploadReel } from "../controllers/reel.controller.js";

const router = express.Router();

// router.post("/upload-image", verifyJWT, upload.single("image"), uploadUserImage)
router.post("/upload-image", verifyJWT, upload.any(), uploadUserImage)
router.get("/me", verifyJWT, getMyProfile)
router.post("/update-profile", verifyJWT, updateProfile)
router.get("/my-reels", verifyJWT, myReels)
router.get("/friends", verifyJWT, getAllFriends)
router.post("/friends-add/:friendId", verifyJWT, addFriend)
router.delete("/friend-remove/:friendId", verifyJWT, removeFriend)
router.get("/search-users", verifyJWT, searchUsers)
router.get("/all-users", verifyJWT, allUsers)
router.get("/user-profile/:userId", verifyJWT, getUserProfile)
router.get("/check-friendship/:friendId", verifyJWT, checkFriendStatus)

export default router