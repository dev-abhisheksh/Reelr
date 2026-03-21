import { Queue } from "bullmq"
import { client } from "../utils/redis-client.js"

export const reelUploadQueue = new Queue("reel-uploader", {
    connection: client
})