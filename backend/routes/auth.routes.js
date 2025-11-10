import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { loginUser, logoutUser, registerUser, verifyUser } from "../controllers/auth.controller.js";
import { upload } from "../config/multer.js";
// import { uploadProfileImage } from "../controllers/user.controller.js";

const router = express.Router();

//no auth required
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyJWT, verifyUser)
router.get("/logout", logoutUser)

export default router