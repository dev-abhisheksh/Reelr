import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    text: {
        type: String,
        trim: true,
        maxlength: 1500
    },

    image: {
        type: String
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

postSchema.index({ userId: true, createdAt: true })

export const Post = mongoose.model("Post", postSchema)