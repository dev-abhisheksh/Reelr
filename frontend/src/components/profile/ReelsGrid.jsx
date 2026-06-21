import React from "react";

const ReelsGrid = ({ reels, onReelClick }) => {
  return (
    <div className="grid grid-cols-3 gap-1 mt-8 w-full max-w-md px-2">
      {reels.length > 0 &&
        reels.map((reel, index) => (
          <div
            key={reel._id || index}
            className="aspect-square border border-white rounded-md bg-gray-800 overflow-hidden cursor-pointer"
            onClick={() => onReelClick(reel)}
          >
            <video
              src={reel.videoUrl}
              className="w-full h-full object-cover"
              muted
              loop
            />
          </div>
        ))}
    </div>
  );
};

export default ReelsGrid;
