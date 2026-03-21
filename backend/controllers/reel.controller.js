import { Reel } from "../models/reels.model.js";
import { Like } from "../models/likes.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import { client } from "../utils/redis-client.js";

const deleteRedisCache = async (client, patterns) => {
    const patternArr = Array.isArray(patterns) ? patterns : [patterns]

    for (const pattern of patterns) {
        let cursor = "0";
        do {
            const [next, keys] = await client.scan(cursor, "MATCH", pattern, "COUNT", 100);
            if (keys.length > 0) {
                await client.del(...keys)
            }
            cursor = next;
        } while (cursor != "0")
        console.log("Cache cleared")
    }
}

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

        await deleteRedisCache(client, [
            "reels:all",
            `me:${req.user._id}`
        ]).catch(err => console.error("Redis cache clear failed", err))

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
        const cacheKey = `reels:all`
        let allReels;

        // 1. Try Redis cache for reel data
        const cached = await client.get(cacheKey)
        if (cached) {
            allReels = JSON.parse(cached);
        } else {
            allReels = await Reel.find()
                .populate("creator", "username profileImage")
                .sort({ createdAt: -1 })
                .lean();

            if (allReels.length > 0) {
                await client.set(cacheKey, JSON.stringify(allReels), "EX", 300);
            }
        }

        if (!allReels || allReels.length === 0) {
            return res.status(200).json({
                message: "No reels available",
                allReels: []
            })
        }

        // 2. Compute per-user "liked" status in ONE batch query
        const userId = req.user?._id;
        if (userId) {
            const reelIds = allReels.map(r => r._id);
            const userLikes = await Like.find(
                { userId, reelId: { $in: reelIds } },
                { reelId: 1, _id: 0 }
            ).lean();

            const likedSet = new Set(userLikes.map(l => l.reelId.toString()));

            allReels = allReels.map(reel => ({
                ...reel,
                liked: likedSet.has(reel._id.toString())
            }));
        } else {
            // Unauthenticated — no likes
            allReels = allReels.map(reel => ({ ...reel, liked: false }));
        }

        return res.status(200).json({
            message: "All reels fetched successfully",
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

        await deleteRedisCache(client, [
            `reels:all`
        ])

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

        const reels = await Reel.find({ creator: userId })
            .sort({ createdAt: -1 })
            .populate("creator", "username profileImage")
            .lean();

        const userIdFromReq = req.user?._id;

        const reelsWithLiked = await Promise.all(
            reels.map(async (reel) => {
                const liked = await Like.exists({
                    reelId: reel._id,
                    userId: userIdFromReq
                });

                return {
                    ...reel,
                    liked: !!liked
                };
            })
        );

        return res.status(200).json({ reels: reelsWithLiked });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch user reels" })
    }
}

const getTrendingReels = async (req, res) => {
    try {
        // Fetch all reels and sort by (likesCount + views)
        const reels = await Reel.aggregate([
            {
                $addFields: {
                    totalEngagement: { $add: ["$likesCount", "$views"] }
                }
            },
            { $sort: { totalEngagement: -1, createdAt: -1 } },
            { $limit: 20 }
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



export {
    uploadReel,
    deleteReel,
    getAllReels,
    getReelById,
    updateReel,
    getReelsByUser,
    getTrendingReels,
    incrementViews,
    getTotalViewsOfCreator
}