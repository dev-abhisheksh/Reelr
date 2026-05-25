import mongoose from "mongoose";

const notificatonSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },

    followRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Follow",
    },

    type: {
        type: String,
        enum: ["post", "follow-request", "like", "comment"],
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

notificatonSchema.index({ receiver: 1, createdAt: -1 })

export const Notification = mongoose.model("Notification", notificatonSchema)