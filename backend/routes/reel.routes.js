import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import optionalJWT from "../middlewares/optionalAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { upload } from "../config/multer.js";
import { deleteReel, getAllReels, getReelById, getReelsByUser, updateReel, uploadReel, getTrendingReels, incrementViews, getTotalViewsOfCreator } from "../controllers/reel.controller.js";
import rateLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/upload", verifyJWT, upload.single("video"), uploadReel)

router.get("/all", optionalJWT, rateLimiter({ keyPrefix: "allReels", limit: 7, windowSec: 60 }), getAllReels)
router.delete("/delete/:id", verifyJWT, deleteReel)
router.get("/single-reel/:id", verifyJWT, getReelById)
router.patch("/update/:id", verifyJWT, updateReel)
router.get("/all-reels/:userId", verifyJWT, getReelsByUser)
router.get("/popular", getTrendingReels)
router.patch("/:reelId/views", incrementViews)
router.get("/total-user-views/:creatorId", verifyJWT, getTotalViewsOfCreator)

export default router