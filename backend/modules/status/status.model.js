import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    mediaUrl: {
        type: String
    },

    statusType: {
        type: String,
        enum: ["image", "video", "text"],
        required: true
    },

    text: {
        type: String,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }

}, { timestamps: false });

export const Status = mongoose.model("Status", statusSchema);