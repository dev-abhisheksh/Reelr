import mongoose from "mongoose"
import { Like } from "../models/likes.model.js"
import { Reel } from "../models/reels.model.js";


const likeToggle = async (req, res) => {
    try {
        const userId = req.user._id;
        const { reelId } = req.params
        if (!mongoose.Types.ObjectId.isValid(reelId)) {
            return res.status(400).json({ message: "Invalid or missing reelId" })
        }

        const deleteLike = await Like.findOneAndDelete({ userId, reelId })

        if (deleteLike) {
            await Reel.findByIdAndUpdate(reelId, { $inc: { likesCount: -1 } })
            return res.status(200).json({
                message: "Reel Unliked",
                liked: false,
                success: true
            })
        }

        await Like.create({ reelId, userId })
        await Reel.findByIdAndUpdate(reelId, { $inc: { likesCount: 1 } });

        return res.status(200).json({
            message: "Reel Liked",
            success: true,
            liked: true
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({
                message: "Already Liked",
                success: true,
                liked: true
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

        const likesCount = await Like.countDocuments({ userId: req.user._id, reelId })

        const liked = await Like.exists({ reelId, userId: req.user._id })

        return res.status(200).json({
            message: "Fetched all views",
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