import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

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

const registerUser = async (req, res) => {
    try {
        const { fullName, username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(404).json({ message: "All fields are necessary" })
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

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })

        res.status(201).json({ message: "User registered successfully", createdUser, accessToken, refreshToken })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to create user. Internal Server Error" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        // 1. Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not registered" });
        }

        // 2. Check password
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // 3. Generate JWT tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // 4. Send access token as HTTP-only cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // ❗ change to true in production (https)
            sameSite: "lax", // use "none" + secure:true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // 5. Return user data (no tokens in response)
        const loggedInUser = await User.findById(user._id).select("-password");

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: loggedInUser,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Failed to log in user" });
    }
};

// verify logged-in user (used for cookie-based auth check)
const verifyUser = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User authenticated",
        user: req.user,
    });
};


export {
    registerUser,
    loginUser,
    verifyUser
}