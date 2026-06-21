import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { SquarePen, Trash2 } from "lucide-react";

const ReelDetailModal = ({
  isOpen,
  onClose,
  reel,
  isEditing,
  setIsEditing,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !reel) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#1C1C1D] rounded-xl overflow-hidden shadow-xl">
        <button
          className="absolute right-3 top-3 h-10 w-10 rounded-full bg-gray-800/70 hover:bg-gray-700 flex justify-center items-center transition-colors z-20"
          onClick={onClose}
        >
          <IoMdArrowRoundBack size={28} className="text-white" />
        </button>

        <div className="flex flex-col gap-4 p-5 text-white">
          <video
            className="w-full max-h-[45vh] rounded-lg object-cover"
            src={reel.videoUrl}
            autoPlay
            loop
            playsInline
          />

          <div className="flex justify-between items-start gap-3">
            {/* LEFT SIDE */}
            <div className="flex-1">
              {isEditing ? (
                <div>
                  <input
                    className="bg-gray-800 text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    className="bg-gray-800 text-white px-3 py-2 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <h1 className="font-semibold text-xl text-white truncate">
                    {reel.title}
                  </h1>

                  <p className="text-gray-400 text-sm mt-1">
                    {reel.description}
                  </p>
                </>
              )}
            </div>

            {/* RIGHT SIDE: EDIT BUTTON */}
            {isEditing ? (
              <button
                onClick={onSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Save
              </button>
            ) : (
              <div className="flex flex-col gap-3 justify-center items-center">
                <SquarePen
                  size={25}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => setIsEditing(true)}
                />
                <Trash2
                  size={26}
                  className="text-red-600 cursor-pointer hover:text-red-500"
                  onClick={onDelete}
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="text-gray-300 text-sm">
              Views: {reel.views}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelDetailModal;
