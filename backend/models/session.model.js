import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },

    refreshTokenHash: {
        type: String,
        required: [true, "RefreshToken hash is required"]
    },

    ip: {
        type: String,
        required: [true, "IP Address is required"]
    },

    userAgent: {
        type: String,
        required: [true, "User Agent is required"]
    },

    revoked: {
        type: Boolean,
        defaultfalse
    }

}, { timestamps: true })

export const Session = mongoose.model("Session", sessionSchema)