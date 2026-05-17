import React, { useState, useRef } from "react";
import { createPost } from "../api/post.api";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadPage = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const imageInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed.");
      return;
    }

    setError("");
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl("");
  };

  const upload = async () => {
    if (!text.trim() && !image) {
      setError("Post must include text or an image.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (image) formData.append("image", image);

    try {
      await createPost(formData);
      toast.success("Post uploaded successfully");
      navigate("/feed");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white p-5 overflow-y-auto pb-5">
      <h1 className="text-2xl font-semibold mb-5">Upload Post</h1>

      <textarea
        className="w-full h-40 p-4 bg-neutral-900 border border-gray-700 rounded-xl focus:outline-none focus:border-white resize-none"
        placeholder="Write your post..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-5">
        <p className="text-gray-400 mb-2">Image (optional)</p>
        <div
          className="border-2 border-gray-600 border-dashed rounded-xl h-48 flex flex-col justify-center items-center cursor-pointer hover:border-white transition"
          onClick={() => imageInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
              setImage(file);
              setPreviewUrl(URL.createObjectURL(file));
              setError("");
            }
          }}
        >
          {previewUrl ? (
            <div className="relative h-full w-full">
              <img src={previewUrl} alt="preview" className="h-full w-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-3 right-3 rounded-full bg-black/80 px-3 py-1 text-sm text-white"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <FaCloudUploadAlt className="text-5xl text-gray-400" />
              <p className="mt-3 text-gray-400">Click or drag & drop an image</p>
            </div>
          )}

          <input
            ref={imageInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <button
        onClick={upload}
        disabled={loading}
        className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${loading ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Uploading..." : "Upload Post"}
      </button>
    </div>
  );
};

export default UploadPage;
