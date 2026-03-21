import mongoose from "mongoose"
import { Like } from "../models/likes.model.js"


const likeToggle = async (req, res) => {
    try {
        const userId = req.user._id;
        const { reelId } = req.params
        if (!mongoose.Types.ObjectId.isValid(reelId)) {
            return res.status(400).json({ message: "Invalid or missing reelId" })
        }

        const deleteLike = await Like.findByIdAndDelete({ userId, reelId })
        if (deleteLike) {
            return res.status(200).json({
                message: "Reel Unliked",
                liked: false,
                success: true
            })
        }

        await Like.create({ reelId, userId })

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

export {
    likeToggle
}