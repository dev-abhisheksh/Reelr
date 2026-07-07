import mongoose, { mongo } from "mongoose";

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

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
}, { timestamps: false })

export const postComment = mongoose.model("postComment", postCommentSchema)