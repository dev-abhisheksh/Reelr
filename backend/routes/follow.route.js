import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import { acceptFollowRequest, followUser, getFollowRequests, isFollowing, unfollowUser, userStats } from "../controllers/follow.controller.js";

const router = express.Router();

router.get("/requests", verifyJWT, getFollowRequests)
router.patch("/accept/:followRequestId", verifyJWT, acceptFollowRequest)
router.patch("/unfollow/:unfollowUserId", verifyJWT, unfollowUser)
router.get("/stats", verifyJWT, userStats)
router.get("/is-following/:userId", verifyJWT, isFollowing)

router.post("/:followUserId", verifyJWT, followUser)

export default router;