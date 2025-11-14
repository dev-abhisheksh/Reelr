import cloudinary from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import { Reel } from "../models/reels.model.js";
import { response } from "express";

const uploadUserImage = async (req, res) => {
    try {
        // Debug logging
        console.log("req.files:", req.files);
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        // Check if any file was uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "No image uploaded",
                debug: {
                    files: req.files,
                    body: req.body
                }
            });
        }

        // Get the first file (regardless of field name)
        const file = req.files[0];
        console.log("File found:", file.fieldname);

        const { type } = req.body;
        if (!type || !["profile", "cover"].includes(type)) {
            return res.status(400).json({
                message: "Invalid or missing image type. Must be 'profile' or 'cover'"
            });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: type === "profile" ? "profile_images" : "cover_images",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(file.buffer);
        });

        // Update user
        if (type === "profile") {
            req.user.profileImage = result.secure_url;
        } else {
            req.user.coverImage = result.secure_url;
        }

        await req.user.save();

        res.status(200).json({
            success: true,
            message: `${type} image uploaded successfully`,
            imageUrl: result.secure_url,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload image",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};



const updateProfile = async (req, res) => {
    try {
        const { bio, fullName } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { bio, fullName },
            { new: true, runValidators: true }
        ).select("-password")

        res.json({
            success: true,
            message: "Profile Updated successfull",
            user: updatedUser,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message
        })
    }
}

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password -__v")
            // .populate({
            //     path: "watchHistory",
            //     select: "title thumbnailUrl views likes",
            // })
            .lean();

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching your profile",
            error: error.message,
        });
    }
};

const myReels = async (req, res) => {
    try {
        const userId = req.user._id;

        const reels = await Reel.find({ creator: userId })
            .populate("creator", "username profileImage") // only valid ref
            .sort({ createdAt: -1 });

        return res.status(200).json(reels); // send actual data
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch reels" });
    }
};

const addFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const currentUserId = req.user._id;

        if (!friendId) return res.status(400).json({ message: "Friend Id is required" })

        if (friendId === currentUserId.toString()) return res.status(400).json({ message: "I know your lonely but u cant add yrself as friend" })

        //check if ffriend exists
        const friendUser = await User.findById(friendId)
        if (!friendUser) return res.status(404).json({ message: "User not found" });

        //check if user is already a friend
        if (req.user.friends.includes(friendId)) return req.status(400).json({ message: "Already friends" })

        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: { friends: friendId }
        })

        await User.findByIdAndUpdate(friendId, {
            $addToSet: { friends: currentUserId }
        })

        res.status(200).json({ message: "Friend added successfully" })
    } catch (error) {
        res.status(500).json({ messsage: "Error adding friend", error: error.message })
    }
}

const getAllFriends = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const user = await User.findById(currentUserId)
            .populate("friends", "username fullName profileImage bio")
            .select("friends")

        res.status(200).json(user.friends)
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch friends list" })
    }
}

const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.params;
        const currentUserId = req.user._id;

        if (!friendId) return res.status(400).json({ message: "Friend ID is required" })

        const userExists = await User.findById(friendId);
        if (!userExists) return res.status(404).json({ message: "user not found" })

        if (!req.user.friends.includes(friendId)) return res.status(400).json({ message: "User is not a friend" })

        await User.findByIdAndUpdate(currentUserId, {
            $pull: { friends: friendId }
        })

        await User.findByIdAndUpdate(friendId, {
            $pull: { friends: currentUserId }
        })

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error removing friend", error: error.message });
    }
}

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user._id

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await User.find({
            username: { $regex: query, $options: "i" },
            _id: {
                $ne: currentUserId
            }
        })
            .select("username fullName profileImage bio")
            .limit(10)

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error searching users", error: error.message });
    }
}

const allUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message })
    }
}

export {
    uploadUserImage,
    getMyProfile,
    updateProfile,
    myReels,
    addFriend,
    removeFriend,
    searchUsers,
    getAllFriends,
    allUsers
}