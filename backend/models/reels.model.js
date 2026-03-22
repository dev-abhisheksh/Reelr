import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },

    description: {
        type: String,
        lowercase: true,
        trim: true
    },

    videoUrl: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    views: {
        type: Number,
        default: 0
    },

    likesCount: {
        type: Number,
        default: 0
    },

    commentsCount: {
        type: Number,
        default: 0
    },

    tags: [
        {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
        }
    ],
    category: {
        type: String,
        lowercase: true,
        trim: true,
    }

}, { timestamps: true });

reelSchema.index({ createdAt: -1 })

export const Reel = mongoose.model("Reel", reelSchema);
