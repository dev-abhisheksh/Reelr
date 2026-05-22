import { Worker } from "bullmq";
import { Notification } from "../models/notification.model.js";
import { client } from "../utils/redis-client.js";

const worker = new Worker(
    "follow-request-notification",
    async (job) => {
        try {

            const { senderId, recieverId } = job.data;

            const notification = await Notification.create({
                sender: senderId,
                receiver: recieverId,
                type: "follow-request",
                message: "sent you a follow request"
            });

            // IMPORTANT
            await client.publish(
                "new-notification",
                JSON.stringify(notification)
            );

            console.log("Follow Request Notification Created");

        } catch (error) {
            console.error("Follow request worker error", error);
        }
    },
    { connection: client }
);