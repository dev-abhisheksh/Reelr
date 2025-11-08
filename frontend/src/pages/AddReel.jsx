import React, { useState, useRef } from "react";
import { uploadReel } from "../api/reels.api";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddReel = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("general");
  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Only video files allowed.");
      return;
    }

    setError("");
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Thumbnail must be an image.");
      return;
    }

    setThumbnail(file);
    setError("");
  };

  const upload = async () => {
    if (!videoFile || !title.trim() || !description.trim()) {
      setError("Title, description, and video are required.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("video", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean)));
    formData.append("category", category);

    try {
      const res = await uploadReel(formData);
      console.log("Uploaded:", res.data);
      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-full bg-black text-white p-5 overflow-y-auto pb-5">

      <h1 className="text-2xl font-semibold mb-5">Upload Reel</h1>

      {/* VIDEO UPLOAD */}
      <div
        className="border-2 border-gray-600 border-dashed rounded-xl h-72 flex flex-col justify-center items-center cursor-pointer hover:border-white transition"
        onClick={() => videoInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith("video/")) {
            setVideoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
          }
        }}
      >
        {previewUrl ? (
          <video
            src={previewUrl}
            className="h-full rounded-lg"
            muted
            autoPlay
            loop
          />
        ) : (
          <div className="flex flex-col justify-center items-center">
            <FaCloudUploadAlt className="text-5xl text-gray-400" />
            <p className="mt-3 text-gray-400">Click or drag & drop video</p>
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

      {/* TITLE */}
      <input
        className="w-full mt-5 p-3 bg-neutral-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <textarea
        className="w-full mt-3 p-3 h-28 bg-neutral-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white resize-none"
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* TAGS */}
      <input
        className="w-full mt-3 p-3 bg-neutral-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      {/* CATEGORY */}
      <select
        className="w-full mt-3 p-3 bg-neutral-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
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

      {/* THUMBNAIL UPLOAD */}
      <div className="mt-4">
        <p className="text-gray-400 mb-2">Thumbnail (optional)</p>
        <div
          className="border border-gray-700 p-3 rounded-lg cursor-pointer hover:border-white"
          onClick={() => thumbnailInputRef.current.click()}
        >
          {thumbnail ? (
            <p className="text-green-400">{thumbnail.name}</p>
          ) : (
            <p className="text-gray-400">Upload image</p>
          )}
        </div>

        <input
          ref={thumbnailInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {/* SUBMIT */}
      <button
        onClick={upload}
        disabled={loading}
        className={`w-full mt-6 mb-12 py-3 rounded-lg text-center font-semibold 
                    ${loading ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"}
                `}
      >
        {loading ? "Uploading..." : "Upload Reel"}
      </button>

    </div>
  );
};

export default AddReel;
