// import { Worker } from "bullmq";
// import cloudinary from "../config/cloudinary.js";
// import { Reel } from "../models/reels.model.js";
// import { client } from "../utils/redis-client.js";


// const worker = new Worker("reel-uploader",
//     async (job) => {
//         console.log("Processing Reel Upload", job.data);
//         const { file, body, userId } = job.data;

//         const buffer = Buffer.from(file, "base64")

//         const result = await new Promise((resolve, reject) => {
//             const stream = cloudinary.uploader.upload_stream(
//                 {
//                     resource_type: "video",
//                     folder: "reelsFolder"
//                 },
//                 (err, res) => {
//                     if (err) reject(err)
//                     else resolve(res)
//                 }
//             )
//             stream.end(buffer)
//         })

//         await Reel.create({
//             ...body,
//             videoUrl: result.secure_url,
//             creator: userId
//         })

//         return "done"
//     },
//     {connection:client}
// )

// worker.on("completed", (job)=>{
//     console.log("Reel Upload Job Completed", job.id);
// })

// worker.on("failed", (job, error)=>{
//     console.error("Reel Upload Job Failed", job.id, error);
// })