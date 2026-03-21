import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    reelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

likeSchema.index({ userId: 1, reelId: 1 }, { unique: true })

export const Like = mongoose.model("Like", likeSchema)