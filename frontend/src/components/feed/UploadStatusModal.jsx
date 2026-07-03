import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { useStatus } from "../../hooks/useStatus";

const UploadStatusModal = ({ onClose }) => {
  const { uploadStatus, isUploading } = useStatus();
  const [activeTab, setActiveTab] = useState("media"); // "media" or "text"

  // Media Tab States
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(""); // "image" or "video"
  const [caption, setCaption] = useState("");

  // Text Tab States
  const [textContent, setTextContent] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const type = file.type.split("/")[0];
    if (type !== "image" && type !== "video") {
      toast.error("Only images and videos are supported");
      return;
    }

    setMediaFile(file);
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (activeTab === "media") {
      if (!mediaFile) {
        toast.error("Please select an image or video file first");
        return;
      }
      formData.append("media", mediaFile);
      if (caption.trim()) {
        formData.append("text", caption.trim());
      }
    } else {
      if (!textContent.trim()) {
        toast.error("Please type some text for your status");
        return;
      }
      formData.append("text", textContent.trim());
    }

    try {
      await uploadStatus(formData);
      toast.success("Status uploaded successfully!");
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={!isUploading ? onClose : undefined} />

      {/* Modal Card */}
      <div className="relative w-full max-w-[450px] bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10 text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold tracking-tight">Create a Story</h2>
          {!isUploading && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpload} className="flex flex-col p-5 flex-1">
          {/* Tab Selector */}
          {!mediaFile && (
            <div className="flex bg-zinc-950 p-1 rounded-xl mb-4 border border-white/[0.04]">
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "media" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                Photo / Video
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "text" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                Text Status
              </button>
            </div>
          )}

          {/* Media Upload tab */}
          {activeTab === "media" && (
            <div className="flex flex-col gap-4 flex-1">
              {!mediaPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-52 border-2 border-dashed border-white/10 hover:border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/80 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-200">
                    Upload Photo or Video
                  </span>
                  <span className="text-xs text-zinc-500">Up to 10MB</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative h-52 bg-black rounded-xl overflow-hidden group border border-white/10">
                  {mediaType === "image" ? (
                    <img src={mediaPreview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <video src={mediaPreview} controls className="w-full h-full object-contain" />
                  )}
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 p-1.5 rounded-full text-white/80 hover:text-white transition-all shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Caption field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Caption (Optional)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a status caption..."
                  disabled={isUploading}
                  className="w-full bg-zinc-950 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Text Upload tab */}
          {activeTab === "text" && (
            <div className="flex flex-col gap-4 flex-1">
              <div className="relative h-52 bg-gradient-to-tr from-purple-800 via-indigo-900 to-pink-700 rounded-xl overflow-hidden flex items-center justify-center p-6 border border-white/10">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="What's on your mind?"
                  maxLength={150}
                  disabled={isUploading}
                  className="w-full bg-transparent border-none text-center text-xl font-bold placeholder-white/50 text-white focus:ring-0 focus:outline-none resize-none overflow-hidden max-h-[140px]"
                  style={{ caretColor: "white" }}
                />
                <span className="absolute bottom-2 right-3 text-xs text-white/60">
                  {textContent.length}/150
                </span>
              </div>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="flex gap-3 mt-6">
            {!isUploading && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-semibold border border-white/[0.08] hover:bg-white/5 rounded-xl transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading}
              className="flex-[2] py-3 text-sm font-semibold bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sharing...</span>
                </>
              ) : (
                <span>Share to Story</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadStatusModal;
