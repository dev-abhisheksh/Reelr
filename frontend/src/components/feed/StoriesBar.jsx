import React, { useState, useMemo } from "react";
import { useStatus } from "../../hooks/useStatus";
import StatusViewer from "./StatusViewer";

const StoriesBar = () => {
  const { data, isLoading } = useStatus();
  const [activeUserIdx, setActiveUserIdx] = useState(null);

  // Group status items by userId so each user appears only once in the stories bar
  const groupedStories = useMemo(() => {
    if (!data?.status) return [];
    const groups = {};
    data.status.forEach((item) => {
      const uId = item.userId?._id || item.userId;
      if (!uId) return;
      if (!groups[uId]) {
        groups[uId] = {
          user: item.userId,
          statuses: [],
        };
      }
      groups[uId].statuses.push(item);
    });
    return Object.values(groups);
  }, [data]);

  if (isLoading || groupedStories.length === 0) {
    return null; // Keep it clean if loading or no stories
  }

  return (
    <div className="pt-[52px]">
      <div className="max-w-[470px] mx-auto border-b border-white/[0.06]">
        <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
          {groupedStories.slice(0, 10).map((story, idx) => (
            <div
              key={`story-${idx}`}
              onClick={() => setActiveUserIdx(idx)}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
            >
              <div className="w-[62px] h-[62px] rounded-full p-[2px] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 transition-transform duration-200 group-hover:scale-105">
                <div className="w-full h-full rounded-full p-[2px] bg-black">
                  <img
                    src={story.user?.profileImage}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${story.user?.username || 'U'}&background=333&color=fff&size=62`;
                    }}
                  />
                </div>
              </div>
              <span className="text-[11px] text-neutral-400 max-w-[64px] truncate group-hover:text-neutral-200 transition-colors">
                {story.user?.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Render the Full Screen IG-Style Story Viewer */}
      {activeUserIdx !== null && (
        <StatusViewer
          stories={groupedStories}
          initialUserIndex={activeUserIdx}
          onClose={() => setActiveUserIdx(null)}
        />
      )}
    </div>
  );
};

export default StoriesBar;
