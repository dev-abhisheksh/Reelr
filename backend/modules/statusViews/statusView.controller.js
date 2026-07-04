import asyncHandler from "../../middlewares/asyncHandler.middleware.js";
import ApiError from "../../utils/apiError.js";
import { StatusView } from "./statusView.model.js";

const increStatusViews = asyncHandler(async (req, res) => {
    const { statusId } = req.params;
    if (!statusId) throw new ApiError(400, "Status ID is not provided")
    const viewerId = req.user._id

    const statusView = await StatusView.findOneAndUpdate(
        { statusId, viewerId },
        { $setOnInsert: { statusId, viewerId } },
        { upsert: true, new: true, includeResultMetadata: true }
    )

    if (!statusView.lastErrorObject.upserted) {
        return res.status(200).json({ success: true, message: "Already viewed" });
    }

    return res.status(201).json({ success: true, message: "Status view added", statusView: statusView.value });
})

export { increStatusViews };