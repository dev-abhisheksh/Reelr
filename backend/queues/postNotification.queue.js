import { Queue } from "bullmq"
import { client } from "../utils/redis-client.js"

export const postNotificationQueue = new Queue("post-notification", {
    connection: client
})