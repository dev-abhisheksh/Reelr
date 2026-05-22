import { Worker } from "bullmq";
import { Notification } from "../models/notification.model.js";
import { client } from "../utils/redis-client.js";

const worker = new Worker("follow-request-notification", async (job) => {
    try {
        const { senderId, recieverId } = job.data;

        await Notification.create({
            sender: senderId,
            reciever: recieverId,
            type: "follow-request"
        })

        console.log("Follow Request Notification Created")
    } catch (error) {
        console.error("Follow request woorker error", error)
    }
}, { connection: client })