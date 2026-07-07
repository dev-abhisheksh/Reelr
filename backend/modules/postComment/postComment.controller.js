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

const fetchAllCommentsOfAPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) throw new ApiError(400, "Invalid PostId");

    const comments = await PostComment.find({
        postId,
        isDeleted: false
    })
        .populate("userId", "username profileImage")

    if (comments.length < 0) return res.status(200).json({
        message: `Fetched ${comments.length} comments`
    })

    return res.status(200).json({
        success: true,
        message: `Fetched ${comments.length} comments`,
        comments
    })
})

export {
    addCommentOnPost,
    fetchAllCommentsOfAPost
}