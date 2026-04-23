import { Follow } from "../models/follow.model.js";
import { Post } from "../models/post.model.js";
import { uploadImage } from "../utils/uploadImage.js";


const createPost = async (req, res) => {
    try {
        const userId = req.user._id;

        const { text } = req.body;

        let image = ""
        if (req.file) {
            image = await uploadImage(req.file)
        }

        if (!text && !image) return res.status(400).json({ message: "Post must have text or image" })

        const post = await Post.create({
            userId,
            text,
            image
        })

        return res.status(201).json({
            message: "Post created successfully",
            post: {
                _id: post._id,
                text: post.text,
                image: post.image,
                createdAt: post.createdAt
            }
        });

    } catch (error) {
        console.error("Failed to create post:", error)
        return res.status(500).json({ message: "Failed to create post" })
    }
}

const getPostsByUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const posts = await Post.find({ userId })
        return res.status(200).json({
            message: "Fetched posts of user",
            count: posts.length,
            posts
        })
    } catch (error) {
        console.error("Failed to fetch posts", error)
        return res.status(500).json({ message: "Failed to fetch psosts" })
    }
}

const getFeed = async (req, res) => {
    try {
        const userId = req.user._id;

        const followingDocs = await Follow.find({
            follower: userId,
            status: "accepted"
        }).select("following")

        const followingIds = followingDocs.map(doc => doc.following)

        followingIds.push(userId)

        const posts = await Post.find({
            userId: { $in: followingIds },
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .limit(200)

        return res.status(200).json({
            count: posts.length,
            posts
        })

    } catch (error) {
        console.error("Feed error:", error);
        return res.status(500).json({ message: "Failed to fetch feed" });
    }
}

export {
    createPost,
    getPostsByUser,
    getFeed
}