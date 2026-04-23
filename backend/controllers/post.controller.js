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

export {
    createPost
}