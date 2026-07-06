import express from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { commentOnReel, getComments } from "./reelComment.controller.js";

const router = express.Router();
router.use(verifyJWT);

router.post("/add/:reelId", commentOnReel);
router.get("/get/:reelId", getComments);

export default router;
