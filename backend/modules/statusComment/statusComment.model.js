import mongoose from "mongoose";

const statusCommentSchema = new mongoose.Schema({
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
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
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Automatically deletes the comment after 24 hours
    }
}, { timestamps: false });

export const StatusComment = mongoose.model("StatusComment", statusCommentSchema);
