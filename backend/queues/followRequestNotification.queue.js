import { Queue } from "bullmq";
import { client } from "../utils/redis-client.js";

export const followRequestNotificationQueue = new Queue("follow-request-notification", {
    connection: client
})