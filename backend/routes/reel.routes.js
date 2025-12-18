import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { upload } from "../config/multer.js";
import { deleteReel, getAllReels, getReelById, getReelsByUser, updateReel, uploadReel, getTrendingReels, incrementViews, getTotalViewsOfCreator, likeUnlikeReel } from "../controllers/reel.controller.js";
import rateLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/upload", verifyJWT, upload.single("video"), uploadReel)

router.get("/all", rateLimiter({ keyPrefix: "allReels", limit: 7, windowSec: 60 }), getAllReels)
router.delete("/delete/:id", verifyJWT, deleteReel)
router.get("/single-reel/:id", verifyJWT, getReelById)
router.patch("/update/:id", verifyJWT, updateReel)
router.get("/all-reels/:userId", verifyJWT, getReelsByUser)
router.get("/popular", getTrendingReels)
router.patch("/:reelId/views", incrementViews)
router.post("/upload", verifyJWT, uploadReel)
router.get("/total-user-views/:creatorId", verifyJWT, getTotalViewsOfCreator)
router.patch("/like-reel/:id", verifyJWT, likeUnlikeReel);



export default router