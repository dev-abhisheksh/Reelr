    import express from "express";
    import verifyJWT from "../../middlewares/auth.middleware.js";
    import { addStatus } from "./status.controller.js";
    import { upload } from "../../config/multer.js";

    const router = express.Router();

    router.use(verifyJWT)

    router.post("/add-status",upload.single("media"), addStatus)

    export default router   