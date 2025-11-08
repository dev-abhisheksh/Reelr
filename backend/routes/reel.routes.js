import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { upload } from "../config/multer.js";
import { deleteReel, getAllReels, getReelById, getReelsByUser, updateReel, uploadReel, getTrendingReels, incrementViews } from "../controllers/reel.controller.js";

const router = express.Router();

router.post("/upload", verifyJWT, allowRoles("creator", "admin"), upload.single("video"), uploadReel)

router.get("/all", getAllReels)
router.delete("/delete/:id", verifyJWT, allowRoles("creator", "admin"), deleteReel)
router.get("/single-reel/:id", verifyJWT, allowRoles("creator", "admin"), getReelById)
router.patch("/update/:id", verifyJWT, allowRoles("creator", "admin"), updateReel)
router.get("/all-reels/:userId", verifyJWT, allowRoles("admin"), getReelsByUser)
router.get("/popular", getTrendingReels)
router.patch("/:reelId/views", incrementViews)
router.post("/upload", verifyJWT, uploadReel)

export default router