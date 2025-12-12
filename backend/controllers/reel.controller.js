import { Reel } from "../models/reels.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import { client } from "../utils/redis-client.js";

const uploadReel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).json({ message: "video file not uploaded" });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "reelsFolder",
                    eager: [
                        {
                            format: "mp4",
                            quality: "auto"
                        }
                    ],
                    eager_async: true,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        // creating in DB
        const { title, description, tags, category } = req.body;
        const reel = await Reel.create({
            title,
            description,
            tags,
            category,
            videoUrl: result.secure_url,
            creator: req.user._id,
            thumbnail: req.body.thumbnail || result.eager?.[0]?.secure_url || "",
        });

        return res.status(200).json({ message: "Reel uploaded successfully", reel });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Failed to upload reel. Internal server error",
        });
    }
};

const deleteReel = async (req, res) => {
    try {
        const { id } = req.params;
        const reel = await Reel.findById(id);

        if (!reel) return res.status(404).json({ message: "Reel not found" });

        // Extract public ID from video URL
        const publicId = reel.videoUrl
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0]; // removes extension

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

        // Delete from DB
        await Reel.findByIdAndDelete(id);

        res.status(200).json({ message: "Reel deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete reel" });
    }
};


// Controller
const getAllReels = async (req, res) => {
    try {
        const cacheReels = await client.get("reels");
        if (cacheReels) {
            console.log("✅ Served from Redis cache");
            return res.status(200).json({
                message: "All Reels fetched from cache successfully",
                allReels: JSON.parse(cacheReels),
            });
        }

        const allReels = await Reel.find()
            .populate("creator", "username profileImage")
            .sort({ createdAt: -1 });

        if (allReels.length === 0)
            return res.status(404).json({ message: "No reels" });

        // ✅ ioredis syntax for TTL
        await client.set("reels", JSON.stringify(allReels), "EX", 300);
        console.log("🆕 Cached all reels in Redis (via ioredis)");

        return res.status(200).json({
            message: "All Reels fetched successfully",
            allReels,
        });
    } catch (error) {
        console.error("Error fetching reels:", error);
        return res.status(500).json({ message: "Failed to fetch reels" });
    }
};



const getReelById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "No id provided to fetch" })
        }

        const reel = await Reel.findById({ _id: id });
        if (!reel) {
            return res.status(404).json({ message: "Invalid id or not reel not available" })
        }

        return res.status(200).json({ message: "Reel fetched by Id successfull", reel })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "failed to fetch reel" })
    }
}

const updateReel = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, thumbnail, tags } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (thumbnail) updateData.thumbnail = thumbnail;
        if (tags) updateData.tags = tags;

        const updatedReel = await Reel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedReel) {
            return res.status(404).json({ message: "Reel not found" });
        }

        console.log('Reel updated successfully');
        return res.status(200).json({
            message: "Reel updated successfully",
            updatedReel,
        });
    } catch (error) {
        console.error('Update reel error:', error);
        return res.status(500).json({ message: "Failed to update reel" });
    }
};

const getReelsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const reels = await Reel.find({ creator: userId }).sort({ createdAt: -1 }).populate("creator", "username profileImage");

        if (!reels || reels.length === 0) {
            return res.status(404).json({ message: "Reels not found for this user" })
        }

        return res.status(200).json({ reels })
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user reels" })
    }
}

const getTrendingReels = async (req, res) => {
    try {
        // Fetch all reels and sort by (likes count + views)
        const reels = await Reel.aggregate([
            {
                $addFields: {
                    likeCount: { $size: "$likes" }, // count number of likes
                    totalEngagement: { $add: [{ $size: "$likes" }, "$views"] } // likes + views
                }
            },
            { $sort: { totalEngagement: -1, createdAt: -1 } }, // highest first, tie-break by recency
            { $limit: 20 } // limit to top 20 trending reels
        ]);

        if (!reels || reels.length === 0) {
            return res.status(404).json({ message: "No trending reels found" });
        }

        return res.status(200).json({ reels });
    } catch (error) {
        console.error("Error fetching trending reels:", error);
        return res.status(500).json({ message: "Failed to fetch trending reels" });
    }
};

const incrementViews = async (req, res) => {
    try {
        const { reelId } = req.params;
        if (!reelId) {
            return res.status(400).json({ message: "Reel id is required" })
        }

        const updatedViews = await Reel.findByIdAndUpdate(
            reelId,
            { $inc: { views: 1 } },
            { new: true }
        )

        if (!updatedViews) {
            return res.status(404).json({ message: "Reel not found" })
        }
        return res.status(200).json({ message: "view updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Failed to add view" })
    }
}

const getTotalViewsOfCreator = async (req, res) => {
    try {
        const { creatorId } = req.params;
        const result = await Reel.aggregate([  // ← Added 'await' here
            {
                $match: {
                    creator: new mongoose.Types.ObjectId(creatorId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            }
        ]);
        const totalViews = result.length > 0 ? result[0].totalViews : 0;
        res.status(200).json({ totalViews })
    } catch (error) {
        console.error("Error fetching total views:", error)
        res.status(500).json({ message: "Server error" })
    }
}

const likeUnlikeReel = async (req, res) => {
    try {
        const userId = req.user._id;
        const reelId = req.params.id;

        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({ error: "Reel not found" });
        }

        let liked;

        if (reel.likes.includes(userId)) {
            // UNLIKE
            reel.likes.pull(userId);
            liked = false;
        } else {
            // LIKE
            reel.likes.push(userId);
            liked = true;
        }

        await reel.save();

        // RETURN FULL REEL WITH POPULATED CREATOR (OPTIONAL)
        const updatedReel = await Reel.findById(reelId)
            .populate("creator", "username profilePic");

        return res.status(200).json({
            liked,
            likes: updatedReel.likes,       // full array of user IDs
            totalLikes: updatedReel.likes.length,
            reel: updatedReel               // entire updated reel
        });

    } catch (error) {
        console.error("Error liking/unliking reel:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export {
    uploadReel,
    deleteReel,
    getAllReels,
    getReelById,
    updateReel,
    getReelsByUser,
    getTrendingReels,
    incrementViews,
    getTotalViewsOfCreator,
    likeUnlikeReel
}