import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { getNotifications, markNotificationsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", verifyJWT, getNotifications);
router.patch("/mark-read", verifyJWT, markNotificationsRead);

export default router;
