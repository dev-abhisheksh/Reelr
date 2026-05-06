import mongoose from "mongoose";

const statusViewSchema = new mongoose.Schema({
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

statusViewSchema.index({ statusId: 1, userId: 1 }, { unique: true })

export const StatusView = mongoose.model("StatusView", statusViewSchema)