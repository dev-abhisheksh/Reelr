import express from "express"
import verifyJWT from "../middlewares/auth.middleware.js";
import { search } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/", verifyJWT, search)

export default router