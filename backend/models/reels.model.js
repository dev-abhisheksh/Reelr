import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
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
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    tags: [
        {
            type: String,
            lowercase: true,
            trim: true,
            index: true, // makes searching faster
        }
    ],
    category: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
    }

}, { timestamps: true });

reelSchema.index({ title: "text", description: "text" });

export const Reel = mongoose.model("Reel", reelSchema);
