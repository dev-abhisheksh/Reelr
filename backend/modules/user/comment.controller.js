import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import { Reel } from "../../models/reels.model.js";
import { Comment } from "../../models/comments.model.js";

const commentOnReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    let { comment } = req.body;
    if (!mongoose.Types.ObjectId.isValid(reelId)) throw new ApiError(400, "Invalid ReelId")

    if (!comment || comment.trim().length === 0) throw new ApiError(400, "Comment cannot be empty")
    comment = comment.trim()

    const reel = await Reel.findById(reelId)
    if (!reel) throw new ApiError(404, "Reel not found")

    const newComment = await Comment.create({
        reelId,
        userId: req.user._id,
        comment,
        parentComment: parentComment || null
    });

    res.status(201).json({
        success: true,
        message: "Comment added",
        data: newComment
    });

})

export{
    commentOnReel
}