import express from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { commentOnStatus, getStatusComments } from "./statusComment.controller.js";

const router = express.Router();
router.use(verifyJWT);

router.post("/add/:statusId", commentOnStatus);
router.get("/get/:statusId", getStatusComments);

export default router;
