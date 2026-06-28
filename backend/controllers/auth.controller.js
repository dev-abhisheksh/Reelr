import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import ApiError from "../utils/apiError.js";
import { Session } from "../models/session.model.js";
import crypto from "crypto";

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

const generateAccessTokenWithSession = ({ user, session }) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            sessionId: session._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Must be true in production for sameSite 'none'
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const registerUser = async (req, res) => {
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
        const { fullName, username, email, password, role } = req.body;
        if (!username || !email || !password) {
            await mongoSession.abortTransaction();
            mongoSession.endSession();
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] }).session(mongoSession);
        if (existingUser) {
            await mongoSession.abortTransaction();
            mongoSession.endSession();
            const field = existingUser.email === email ? "Email" : "Username";
            return res.status(400).json({ message: `${field} is already in use. Kindly login.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [user] = await User.create([{
            fullName,
            username,
            email,
            password: hashedPassword,
            role: ["viewer", "creator"].includes(role) ? role : "viewer"
        }], { session: mongoSession });

        const createdUser = await User.findById(user._id)
            .select("-password -refreshToken")
            .session(mongoSession);

        const refreshToken = generateRefreshToken(user);
        const refreshTokenHash = hashToken(refreshToken);

        const [session] = await Session.create([{
            userId: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        }], { session: mongoSession });

        const accessToken = generateAccessTokenWithSession({ user, session });

        await mongoSession.commitTransaction();
        mongoSession.endSession();

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(201).json({ message: "User registered successfully", createdUser });

    } catch (error) {
        await mongoSession.abortTransaction();
        mongoSession.endSession();
        console.error(error);
        return res.status(500).json({ message: "Failed to create user. Internal Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not registered",
            });
        }

        const isMatchPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatchPassword) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to log in user",
        });
    }
};

const verifyUser = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User authenticated",
        user: req.user
    });
};


const logoutUser = async (req, res) => {
    try {

        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.status(400).json({
            message: "RefreshToken not found"
        })

        const refreshTokenHash = hashToken(refreshToken)

        const session = await Session.findOne({
            refreshTokenHash,
            revoked: false
        })

        if (!session) return res.status(400).json({ message: "Invalid RefreshToken" })

        session.revoked = true;
        await session.save()

        // if (req.user) {
        //     req.user.refreshToken = null;
        //     await req.user.save({ validateBeforeSave: false });
        // }

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return res.status(200).json({
            message: "User logged out successfully",
            success: true
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};

const refreshTokenRotation = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new ApiError(401, "Not authorized");

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(401, "User not found");

    const refreshTokenHash = hashToken(refreshToken);
    const session = await Session.findOne({ refreshTokenHash, revoked: false });

    if (!session) {
        await Session.updateMany({ userId: user._id }, { revoked: true });
        throw new ApiError(401, "Refresh token reuse detected. Please login again.");
    }

    const newRefreshToken = generateRefreshToken(user);
    const newRefreshTokenHash = hashToken(newRefreshToken);

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    const newAccessToken = generateAccessTokenWithSession({ user, session });

    res.cookie("accessToken", newAccessToken, cookieOptions);
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    return res.status(200).json({ success: true, message: "Tokens refreshed successfully" });
});

export {
    registerUser,
    loginUser,
    verifyUser,
    logoutUser,
    refreshTokenRotation
}