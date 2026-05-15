import { Worker } from "bullmq";
import { Follow } from "../models/follow.model.js";
import { Notification } from "../models/notification.model.js";
import { client } from "../utils/redis-client.js";

new Worker("post-notification", async (job) => {
    try {
        const { postId, userId } = job.data;

        const followers = await Follow.find({
            following: userId,
            status: "accepted"
        }).select("follower")

        const notifications = followers.map((followerDoc) => ({
            sender: userId,
            receiver: followerDoc.follower,
            postId,
            type: "post"
        }))

        await Notification.insertMany(notifications)

        console.log("Notification created")
    } catch (error) {
        console.error(error)
        throw error
    }
}, {
    connection: client
}
)

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});