import mongoose from "mongoose"
import { Like } from "../models/likes.model.js"
import { Reel } from "../models/reels.model.js";
import { client } from "../utils/redis-client.js";


const likeToggle = async (req, res) => {
    try {
        const userId = req.user._id;
        const { reelId } = req.params
        if (!mongoose.Types.ObjectId.isValid(reelId)) {
            return res.status(400).json({ message: "Invalid or missing reelId" })
        }

        const deleteLike = await Like.findOneAndDelete({ userId, reelId })

        let updatedReel;

        if (deleteLike) {
            // Unlike — decrement, but never go below 0
            updatedReel = await Reel.findOneAndUpdate(
                { _id: reelId, likesCount: { $gt: 0 } },
                { $inc: { likesCount: -1 } },
                { new: true }
            );

            // If likesCount was already 0 or reel not found, just fetch it
            if (!updatedReel) {
                updatedReel = await Reel.findById(reelId);
            }

            // Invalidate Redis cache so refresh serves fresh data
            await client.del("reels:all").catch(err => console.error("Redis del failed:", err));

            return res.status(200).json({
                message: "Reel Unliked",
                liked: false,
                likesCount: updatedReel?.likesCount ?? 0,
                success: true
            })
        }

        await Like.create({ reelId, userId })
        updatedReel = await Reel.findByIdAndUpdate(
            reelId,
            { $inc: { likesCount: 1 } },
            { new: true }
        );

        // Invalidate Redis cache
        await client.del("reels:all").catch(err => console.error("Redis del failed:", err));

        return res.status(200).json({
            message: "Reel Liked",
            success: true,
            liked: true,
            likesCount: updatedReel?.likesCount ?? 1
        })
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate like — fetch actual count to stay in sync
            const reel = await Reel.findById(req.params.reelId).select("likesCount");
            return res.status(200).json({
                message: "Already Liked",
                success: true,
                liked: true,
                likesCount: reel?.likesCount ?? 0
            })
        }

        console.error(error)
        return res.status(500).json({ message: "Failed to like toggle reel" })
    }
}


const fetchLikesOfAReel = async (req, res) => {
    try {
        const { reelId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(reelId)) {
            return res.status(400).json({ message: "Invalid Reel id" })
        }

        // Count ALL likes for this reel (not just current user's)
        const likesCount = await Like.countDocuments({ reelId })

        const liked = await Like.exists({ reelId, userId: req.user._id })

        return res.status(200).json({
            message: "Fetched likes",
            count: likesCount,
            liked: !!liked,
            success: true
        })
    } catch (error) {
        console.error("Failed to fetch likes", error)
        return res.status(500).json({ message: "Failed to fetch likes" })
    }
}

export {
    likeToggle,
    fetchLikesOfAReel
}