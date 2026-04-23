import { Follow } from "../models/follow.model.js"
import { User } from "../models/user.model.js"

const followUser = async (req, res) => {
    try {
        const follower = req.user._id
        const { followUserId: following } = req.params
        if (!following) return res.status(400).json({ message: "userID is required" })

        if (follower.toString() === following) {
            return res.status(400).json({ message: "Cannot follow yourself" })
        }

        const user = await User.findById(following);
        if (!user) return res.status(404).json({ message: "user not found" })

        const existing = await Follow.findOne({ following, follower })
        if (existing) return res.status(400).json({ message: "Already requested/following" })

        const status = user.isPrivate ? "pending" : "accepted"

        const follow = await Follow.create({
            follower,
            following,
            status
        })

        return res.status(201).json({
            message: status === "pending"
                ? "Follow request sent"
                : "Followed successfully",
            follow
        });
    } catch (error) {
        console.error("Failed to follow user", error)
        return res.status(500).json({ message: "Failed to follow user" })
    }
}

export{
    followUser
}