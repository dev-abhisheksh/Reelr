import mongoose from "mongoose";

const postCommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    comment: {
        type: String,
        trim: true,
        maxlength: 500
    },

}, { timestamps: true })

postCommentSchema.index({ postId: 1, createdAt: -1 })

export const postComment = mongoose.model("postComment", postCommentSchema)