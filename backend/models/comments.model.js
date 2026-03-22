import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
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
    }
}, { timestamps: true })

commentSchema.index({ reelId: 1 });
commentSchema.index({ userId: 1 });

export const Comment = mongoose.model("Comment", commentSchema)