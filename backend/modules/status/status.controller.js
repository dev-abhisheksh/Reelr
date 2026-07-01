import asyncHandler from "../../middlewares/asyncHandler.middleware.js";
import { Follow } from "../../models/follow.model.js";
import ApiError from "../../utils/apiError.js";
import { uploadImage, uploadVideo } from "../../utils/uploadFunction.js";
import { Status } from "./status.model.js";

const addStatus = asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text && !req.file) {
        throw new ApiError(400, "At least one input field is required");
    }

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

const fetchStatus = asyncHandler(async (req, res) => {
    const users = await Follow.find({
        follower: req.user._id,
        status: "accepted"
    }).select("following")

    const followingIds = await users.map(id => id.following)
    console.log(followingIds)

    const status = await Status.find({
        userId: { $in: followingIds }
    })
    .populate("userId", "profileImage")
    .select("-createdAt -__v")

    return res.status(200).json({
        success: true,
        message: "Status fetched",
        status
    })
})

export {
    addStatus,
    fetchStatus
}