import express from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { addStatus, fetchStatus } from "./status.controller.js";
import { upload } from "../../config/multer.js";
import { increStatusViews } from "../statusViews/statusView.controller.js";

const router = express.Router();

router.use(verifyJWT)

router.post("/add-status", upload.single("media"), addStatus)
router.get("/status", fetchStatus)
router.post("/view/:statusId", increStatusViews)

export default router;