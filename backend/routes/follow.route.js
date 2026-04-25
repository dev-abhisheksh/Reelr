import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import { acceptFollowRequest, followUser, getFollowRequests, unfollowUser } from "../controllers/follow.controller.js";

const router = express.Router();

router.get("/requests", verifyJWT, getFollowRequests)
router.post("/:followUserId", verifyJWT, followUser)
router.patch("/accept/:followRequestId", verifyJWT, acceptFollowRequest)
router.patch("/unfollow/:unfollowUserId", verifyJWT, unfollowUser)

export default router