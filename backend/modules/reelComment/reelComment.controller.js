import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import { Reel } from "../../models/reels.model.js";
import { ReelComment } from "../../models/reelComment.model.js";

const commentOnReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    let { comment, parentComment } = req.body;
    if (!mongoose.Types.ObjectId.isValid(reelId)) throw new ApiError(400, "Invalid ReelId");

    if (!comment || comment.trim().length === 0) throw new ApiError(400, "Comment cannot be empty");
    comment = comment.trim();

    const reel = await Reel.findById(reelId);
    if (!reel) throw new ApiError(404, "Reel not found");

    if (parentComment && !mongoose.Types.ObjectId.isValid(parentComment)) {
        throw new ApiError(400, "Invalid parentComment ID");
    }

    const session = await mongoose.startSession();
    let populatedComment;

    try {
        await session.withTransaction(async () => {
            const newComment = await ReelComment.create([{
                reelId,
                userId: req.user._id,
                comment,
                parentComment: parentComment || null
            }], { session });

            await Reel.findByIdAndUpdate(
                reelId,
                { $inc: { commentsCount: 1 } },
                { session }
            );

            populatedComment = await ReelComment.findById(newComment[0]._id)
                .populate("userId", "username profileImage")
                .session(session);
        });

        res.status(201).json({
            success: true,
            message: "Comment added",
            data: populatedComment
        });
    } catch (error) {
        console.error("Failed to add comment:", error);
        throw new ApiError(500, "Failed to add comment");
    } finally {
        session.endSession();
    }
});

const getComments = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reelId)) {
        throw new ApiError(400, "Invalid ReelId");
    }

    const comments = await ReelComment.find({ reelId, isDeleted: false })
        .populate("userId", "username profileImage")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        comments
    });
});

export {
    commentOnReel,
    getComments
}
