import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id || decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);

        // Auto clear invalid cookie
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(401).json({ message: "Token expired or invalid" });
    }
};

export default verifyJWT;
