import React, { useState } from "react";
import PostUploadForm from "../components/upload/PostUploadForm";
import ReelUploadForm from "../components/upload/ReelUploadForm";

const UploadPage = () => {
  const [activeTab, setActiveTab] = useState("post");

  return (
    <div className="h-screen w-full bg-black text-white p-5 overflow-y-auto pb-5">
      <div className="mb-6 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Upload</h1>
        <div className="flex rounded-full bg-neutral-900 p-1">
          {[
            { key: "post", label: "Post" },
            { key: "reel", label: "Reel" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-neutral-950 p-5 shadow-lg shadow-black/20">
        {activeTab === "post" ? <PostUploadForm /> : <ReelUploadForm />}
      </div>
    </div>
  );
};

export default UploadPage;
