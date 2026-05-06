import { Status } from "../models/status.model.js";
import { uploadImage, uploadVideo } from "../utils/uploadFunction.js";


const createStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { statusType, text } = req.body;

        if (!statusType) {
            return res.status(400).json({ message: "Select type of the status" });
        }

        let mediaUrl = "";

        if (statusType === "image" || statusType === "video") {
            if (!req.file) {
                return res.status(400).json({ message: "Media file required" });
            }

            if (statusType === "image") {
                mediaUrl = await uploadImage(req.file);
            } else {
                mediaUrl = await uploadVideo(req.file);
            }
        }

        if (statusType === "text" && !text) {
            return res.status(400).json({
                message: "Text status must have text content"
            });
        }

        const status = await Status.create({
            userId,
            statusType,
            text: text || "",
            mediaUrl
        });

        return res.status(201).json({
            message: "Status created successfully",
            status
        });

    } catch (error) {
        console.error("Failed to create status:", error);
        return res.status(500).json({
            message: "Failed to create status"
        });
    }
};

export { createStatus };