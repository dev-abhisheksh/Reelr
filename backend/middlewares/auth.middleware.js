import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // Import User model
import ApiError from "../utils/apiError.js";
import { Session } from "../models/session.model.js";


const verifyJWT = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || req.headers?.authorization?.replace("Bearer ", "")

    if (!token) throw new ApiError(401, "Unauthorized request")

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    if (!decoded.sessionId) throw new ApiError(401, "Invalid token");

    const session = await Session.findById(decoded.sessionId);
    if (!session || session.revoked) throw new ApiError(401, "Session revoked or expired");

    const user = await User.findById(decoded._id).select("-password")
    if (!user) throw new ApiError(401, "User not found")

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

export default verifyJWT;