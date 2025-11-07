import cloudinary from "../config/cloudinary.js";
import { User } from "../models/user.model.js";

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

export {
    uploadUserImage,
    getMyProfile,
    updateProfile
}