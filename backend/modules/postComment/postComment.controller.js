import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.middleware";
import ApiError from "../../utils/apiError";
import { PostComment } from "./postComment.model";

const addCommentOnPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    let { comment } = req.body;
    if (!mongoose.Types.ObjectId.isValid(postId)) throw new ApiError(400, "Invalid PostId");

    if (!comment?.trim()) throw new ApiError(400, "Comment is required")
    comment = comment.trim();
    const postComment = await PostComment.create({
        postId,
        comment,
        userId: req.user._id
    })

    const populatedComment = postComment.populate("userId", "profileImage username")

    return res.status(201).json({
        status: true,
        populatedComment
    })
})

export {
    addCommentOnPost
}