import React, { useState, useRef } from "react";
import { uploadReel } from "../../api/reels.api";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ReelUploadForm = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("general");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const navigate = useNavigate();

  const clearError = () => setError("");

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Only video files allowed.");
      return;
    }

    clearError();
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Thumbnail must be an image.");
      return;
    }

    clearError();
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview("");
  };

  const uploadReelPost = async () => {
    if (!videoFile || !title.trim() || !description.trim()) {
      setError("Video, title, and description are required for a reel.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim()).filter(Boolean)));
    formData.append("category", category);

    setLoading(true);
    setError("");

    try {
      await uploadReel(formData);
      toast.success("Reel uploaded successfully");
      navigate("/");
    } catch (err) {
      console.error("Reel upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <input
            className="w-full p-3 bg-neutral-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <textarea
          className="w-full h-28 p-3 bg-neutral-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white resize-none"
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full p-3 bg-neutral-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <select
          className="w-full p-3 bg-neutral-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="general">General</option>
          <option value="funny">Funny</option>
          <option value="tech">Tech</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="education">Education</option>
        </select>
      </div>

      <div className="mt-5">
        <p className="text-gray-400 mb-2">Video</p>
        <div
          className="border-2 border-gray-600 border-dashed rounded-xl h-72 flex flex-col justify-center items-center cursor-pointer hover:border-white transition"
          onClick={() => videoInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("video/")) {
              setVideoFile(file);
              setVideoPreview(URL.createObjectURL(file));
              clearError();
            }
          }}
        >
          {videoPreview ? (
            <video
              src={videoPreview}
              className="h-full rounded-xl"
              muted
              autoPlay
              loop
            />
          ) : (
            <div className="flex flex-col justify-center items-center">
              <FaCloudUploadAlt className="text-5xl text-gray-400" />
              <p className="mt-3 text-gray-400">Click or drag & drop a video</p>
            </div>
          )}

          <input
            ref={videoInputRef}
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-gray-400 mb-2">Thumbnail (optional)</p>
        <div
          className="border-2 border-gray-600 border-dashed rounded-xl h-36 flex flex-col justify-center items-center cursor-pointer hover:border-white transition"
          onClick={() => thumbnailInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
              setThumbnail(file);
              setThumbnailPreview(URL.createObjectURL(file));
              clearError();
            }
          }}
        >
          {thumbnailPreview ? (
            <div className="relative h-full w-full">
              <img src={thumbnailPreview} alt="thumbnail-preview" className="h-full w-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeThumbnail();
                }}
                className="absolute top-3 right-3 rounded-full bg-black/80 px-3 py-1 text-sm text-white"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-400">Upload thumbnail</p>
            </div>
          )}

          <input
            ref={thumbnailInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      <button
        onClick={uploadReelPost}
        disabled={loading}
        className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${loading ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Uploading..." : "Upload Reel"}
      </button>
    </>
  );
};

export default ReelUploadForm;
