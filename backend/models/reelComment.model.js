import mongoose from "mongoose";

const reelCommentSchema = new mongoose.Schema({
    reelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    comment: {
        type: String,
        required: true,
        maxlength: 500
    },

    isPinned: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReelComment",
        default: null
    },

}, { timestamps: true })

reelCommentSchema.index({ reelId: 1, createdAt: -1 });
reelCommentSchema.index({ parentComment: 1, createdAt: -1 });

export const ReelComment = mongoose.model("ReelComment", reelCommentSchema);
