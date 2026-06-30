import asyncHandler from "../../middlewares/asyncHandler.middleware";
import ApiError from "../../utils/apiError";
import { uploadImage, uploadVideo } from "../../utils/uploadFunction";
import { Status } from "./status.model";

const addStatus = asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text || !req.file) throw new ApiError(400, "Atleast one input field is required")

    let mediaUrl = ""
    let statusType = "text";

    if (req.file) {
        if (req.file.mimetype.startsWith("image/")) {
            mediaUrl = await uploadImage(req.file);
            statusType = "image"
        }
        else if (req.file.mimetype.startsWith("video/")) {
            mediaUrl = await uploadVideo(req.file)
            statusType = "video"
        } else {
            throw new ApiError(404, "Only image and video files are allowed")
        }
    }

    const status = await Status.create({
        userId: req.user._id,
        mediaUrl,
        statusType,
        text: text || "",
    });

    return res.status(201).json({
        message: "Status added successfully"
    })

})

export {
    addStatus
}