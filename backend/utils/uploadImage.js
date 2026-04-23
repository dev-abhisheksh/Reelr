import cloudinary from "../config/cloudinary.js"

export const uploadImage = (file)=>{
    return new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {resource_type: "image"},
            (error, result)=>{
                if(error) reject(error);
                else resolve(result.secure_url)
            }
        )
        stream.end(file.buffer)
    })
}