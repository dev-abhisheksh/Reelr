import asyncHandler from "../../middlewares/asyncHandler.middleware";
import ApiError from "../../utils/apiError";
import { StatusView } from "./statusView.model";

const increStatusViews = asyncHandler(async (req, res) => {
    const { statusId } = req.params;
    if (!statusId) throw new ApiError(400, "Status ID is not provided")
    const viewerId = req.user._id

    const statusView = await StatusView.findByIdAndUpdate(
        { statusId, viewerId },
        { $setOnInsert: { statusId, viewerId } },
        { upsert: true, new: true, rawResult: true }
    )

    if (!statusView.lastErrorObject.upserted) {
        return res.status(200).json({ success: true, message: "Already viewed" });
    }

    return res.status(201).json({ success: true, message: "Status view added", statusView: statusView.value });
})