import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/**
 * Optional JWT middleware — attaches req.user if a valid token is present,
 * but does NOT block the request if no token / invalid token.
 * Use this for routes that work for both authenticated and unauthenticated users.
 */
const optionalJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return next(); // No token — proceed without req.user
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password");
        if (user) {
            req.user = user;
        }
    } catch (err) {
        // Invalid/expired token — proceed without req.user
    }

    next();
};

export default optionalJWT;
