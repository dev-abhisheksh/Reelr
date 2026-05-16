import { Worker } from "bullmq";
import { Follow } from "../models/follow.model.js";
import { Notification } from "../models/notification.model.js";
import { client } from "../utils/redis-client.js";
import connectDB from "../config/db.js";
import Redis from "ioredis";

connectDB();

// Separate redis client for publishing
const publisher = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: { rejectUnauthorized: false }
});

const worker = new Worker("post-notification", async (job) => {
    try {
        const { postId, userId } = job.data;

        const followers = await Follow.find({
            following: userId,
            status: "accepted"
        }).select("follower");

        if (followers.length === 0) return;

        const notifications = followers.map((followerDoc) => ({
            sender: userId,
            receiver: followerDoc.follower,
            postId,
            type: "post"
        }));

        await Notification.insertMany(notifications);

        // Publish each notification to Redis channel
        for (const notification of notifications) {
            await publisher.publish(
                "new-notification",
                JSON.stringify(notification)
            );
        }

        console.log("Notifications created and published");
    } catch (error) {
        console.error(error);
        throw error;
    }
}, { connection: client });

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed`, err));