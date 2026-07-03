import React, { useState, useEffect, useRef } from "react";

const StatusViewer = ({ stories, initialUserIndex, onClose }) => {
  const [currentUserIdx, setCurrentUserIdx] = useState(initialUserIndex);
  const [currentStatusIdx, setCurrentStatusIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const clickStartTime = useRef(0);

  const currentStory = stories[currentUserIdx];
  const currentStatus = currentStory?.statuses[currentStatusIdx];

  const handleNext = () => {
    setProgress(0);
    if (!currentStory) return;
    if (currentStatusIdx < currentStory.statuses.length - 1) {
      setCurrentStatusIdx((prev) => prev + 1);
    } else if (currentUserIdx < stories.length - 1) {
      setCurrentUserIdx((prev) => prev + 1);
      setCurrentStatusIdx(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (currentStatusIdx > 0) {
      setCurrentStatusIdx((prev) => prev - 1);
    } else if (currentUserIdx > 0) {
      const prevUserIdx = currentUserIdx - 1;
      setCurrentUserIdx(prevUserIdx);
      setCurrentStatusIdx(stories[prevUserIdx].statuses.length - 1);
    } else {
      setProgress(0);
    }
  };

  // Progress Bar timer
  useEffect(() => {
    if (isPaused || !currentStatus) return;

    const duration = 5000; // 5 seconds per story slide
    const intervalTime = 30; // smooth 30ms interval updates
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentUserIdx, currentStatusIdx, isPaused, currentStatus]);

  if (!currentStory || !currentStatus) return null;

  const handlePointerDown = (e) => {
    clickStartTime.current = Date.now();
    setIsPaused(true);
  };

  const handlePointerUp = (e) => {
    setIsPaused(false);
    const clickDuration = Date.now() - clickStartTime.current;
    // If it's a short tap (less than 250ms), navigate
    if (clickDuration < 250) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (clickX < width * 0.30) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main Story Container */}
      <div
        className="relative w-full max-w-[480px] h-full md:h-[90vh] md:max-h-[850px] md:rounded-2xl overflow-hidden bg-zinc-950 flex flex-col justify-center shadow-2xl border border-white/[0.05]"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Top Indicators & User Details */}
        <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none">
          {/* Progress Bars */}
          <div className="flex gap-1 mb-3">
            {currentStory.statuses.map((_, idx) => {
              let barProgress = 0;
              if (idx < currentStatusIdx) barProgress = 100;
              if (idx === currentStatusIdx) barProgress = progress;
              return (
                <div
                  key={idx}
                  className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-30 transition-linear"
                    style={{ width: `${barProgress}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <img
                  src={currentStory.user?.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${currentStory.user?.username || 'U'}&background=333&color=fff&size=32`;
                  }}
                />
              </div>
              <span className="text-white text-sm font-semibold">
                {currentStory.user?.username || "Unknown"}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="w-full h-full flex items-center justify-center bg-black">
          {currentStatus.statusType === "image" && (
            <img
              src={currentStatus.mediaUrl}
              alt=""
              className="w-full h-full object-contain pointer-events-none"
            />
          )}

          {currentStatus.statusType === "video" && (
            <video
              src={currentStatus.mediaUrl}
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-contain pointer-events-none"
            />
          )}

          {currentStatus.statusType === "text" && (
            <div className="w-full h-full bg-gradient-to-tr from-purple-800 via-indigo-900 to-pink-700 flex items-center justify-center p-8 text-center text-white text-2xl font-bold font-sans">
              {currentStatus.text}
            </div>
          )}
        </div>

        {/* Caption Overlay (For image/video statuses that have companion text) */}
        {currentStatus.statusType !== "text" && currentStatus.text && (
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent z-10 text-center text-white text-sm md:text-base pointer-events-none">
            <p className="max-w-[85%] mx-auto leading-relaxed text-zinc-200">
              {currentStatus.text}
            </p>
          </div>
        )}
      </div>F
    </div>
  );
};

export default StatusViewer;
