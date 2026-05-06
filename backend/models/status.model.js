import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 

    mediaUrl: {
        type: String
    },

    statusType: {
        type: String,
        enum: ["image", "video", "text"],
    },

    
}, { timestamps: true })

export const Status = mongoose.model("Status", statusSchema)