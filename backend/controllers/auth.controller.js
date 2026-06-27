import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import ApiError from "../utils/apiError.js";

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

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

const registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are necessary" })
        }

        const existinguser = await User.findOne({ username });
        if (existinguser) {
            return res.status(400).json({ message: "User already exists . Kindly Login" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            role: "viewer"
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        //generating tokens here
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        res.cookie("accessToken", accessToken, cookieOptions)
        res.cookie("refreshToken", refreshToken, cookieOptions)

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        res.status(201).json({ message: "User registered successfully", createdUser })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to create user. Internal Server Error" })
    }
}

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
        await user.save({validateBeforeSave: false})

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
        const userId = req.user?.id;

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
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id)
    if (!user) throw new ApiError(401, "User not found")

    if (user.refreshToken !== refreshToken) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false })

        throw new ApiError(401, "Refresh token reuse detected. Please login again.")
    }

    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user._id)

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false })

    res.cookie("accessToken", newAccessToken, cookieOptions)
    res.cookie("refreshToken", newRefreshToken, cookieOptions)

    return res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
    });
})

export {
    registerUser,
    loginUser,
    verifyUser,
    logoutUser,
    refreshTokenRotation
}