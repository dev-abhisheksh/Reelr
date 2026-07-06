import mongoose from "mongoose";
import asyncHandler from "../../middlewares/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import { Status } from "../status/status.model.js";
import { StatusComment } from "./statusComment.model.js";

const commentOnStatus = asyncHandler(async (req, res) => {
    const { statusId } = req.params;
    let { comment } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(statusId)) {
        throw new ApiError(400, "Invalid statusId");
    }

    if (!comment || comment.trim().length === 0) {
        throw new ApiError(400, "Comment cannot be empty");
    }
    comment = comment.trim();

    const status = await Status.findById(statusId);
    if (!status) {
        throw new ApiError(404, "Status not found");
    }

    const newComment = await StatusComment.create({
        statusId,
        userId: req.user._id,
        comment
    });

    const populatedComment = await StatusComment.findById(newComment._id)
        .populate("userId", "username profileImage");

    res.status(201).json({
        success: true,
        message: "Status comment added",
        data: populatedComment
    });
});

const getStatusComments = asyncHandler(async (req, res) => {
    const { statusId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(statusId)) {
        throw new ApiError(400, "Invalid statusId");
    }

    const comments = await StatusComment.find({ statusId })
        .populate("userId", "username profileImage")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        comments
    });
});

export {
    commentOnStatus,
    getStatusComments
};
