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

    message: {
        type: String,
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

}, { timestamps: true });

notificatonSchema.index({ receiver: 1, createdAt: -1 });

notificatonSchema.index(
    {
        sender: 1,
        receiver: 1,
        type: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            type: "follow-request"
        }
    }
);

export const Notification = mongoose.model("Notification", notificatonSchema);