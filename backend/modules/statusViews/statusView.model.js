import mongoose from "mongoose";

const statusViewSchema = new mongoose.Schema({
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
        required: true
    },

    viewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    viewdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
}, { timestamps: false })

statusViewSchema.index({ statusId: 1, viewerId: 1 }, { unique: true })

export const StatusView = mongoose.model("StatusView", statusViewSchema)