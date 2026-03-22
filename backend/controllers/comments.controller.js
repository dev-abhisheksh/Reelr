import mongoose from "mongoose";
import { Comment } from "../models/comments.model.js";
import sanitizeHtml from "sanitize-html";
import { Reel } from "../models/reels.model.js";

const addComment = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { reelId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reelId)) {
            return res.status(400).json({ message: "Invalid ReelId" });
        }

        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const cleanText = sanitizeHtml(text.trim());

        let populatedComment;

        await session.withTransaction(async () => {

            const reelExists = await Reel.findById(reelId).session(session);
            if (!reelExists) {
                throw new Error("Reel not found");
            }

            const newComment = await Comment.create([{
                comment: cleanText,
                userId: req.user._id,
                reelId
            }], { session });

            await Reel.findByIdAndUpdate(
                reelId,
                { $inc: { commentsCount: 1 } },
                { session }
            );

            populatedComment = await Comment.findById(newComment[0]._id)
                .populate("userId", "username profileImage")
                .session(session);
        });

        return res.status(201).json({
            message: "Comment added successfully",
            success: true,
            comment: populatedComment
        });

    } catch (error) {
        console.error("Failed to add a comment", error);

        if (error.message === "Reel not found") {
            return res.status(404).json({ message: "Reel not found" });
        }

        return res.status(500).json({ message: "Failed to add a comment" });
    } finally {
        session.endSession();
    }
};

const getComments = async (req, res) => {
    try {
        const { reelId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(reelId)) {
            return res.status(400).json({ message: "Invalid ReelId" });
        }
        const comments = await Comment.find({ reelId }).populate("userId", "username profileImage").sort({ createdAt: -1 });
        return res.status(200).json({ comments })
    } catch (error) {
        console.error("Failed to fetch comments", error);
        return res.status(500).json({ message: "Failed to fetch comments" });
    }
}

const pinComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Invalid CommentId" });
        }

        const comment = await Comment.findById(commentId)
            .select("reelId isPinned");

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const reel = await Reel.findById(comment.reelId).select("userId");

        if (reel.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only reel owner can pin comments" });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $set: { isPinned: !comment.isPinned } },
            { new: true }
        );

        return res.status(200).json({
            message: "Comment pinned status updated",
            comment: updatedComment
        });

    } catch (error) {
        console.error("Failed to update comment pinned status", error);
        return res.status(500).json({ message: "Failed to update comment pinned status" });
    }
}

export { addComment, getComments, pinComment };