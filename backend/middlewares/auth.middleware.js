import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // Import User model

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    try {
      // Fetch full user from database including friends array
      const user = await User.findById(decoded._id).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // Now has friends array
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
};

export default verifyJWT;