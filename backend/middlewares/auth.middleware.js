// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

// const verifyJWT = async (req, res, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//             return res.status(401).json({ message: "No token provided, Unauthorized access" })
//         }
//         console.log("Cookies:", req.cookies);
//         console.log("Header:", req.header("Authorization"));


//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         const user = await User.findById(decoded._id);
//         if (!user) {
//             return res.status(401).json({ message: "User not found" });
//         }
//         req.user = user;
//         next();
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ message: "Invalid or Expired token" })
//     }
// }

// export default verifyJWT

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token provided, Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id || decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default verifyJWT;
