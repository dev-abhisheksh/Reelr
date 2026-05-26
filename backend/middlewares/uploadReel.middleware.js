import multer from "multer";

const videoUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("video/")) cb(null, true)
        else cb(new Error("Only video files are allowed"), false)
    }
})

export default videoUpload.single("video")