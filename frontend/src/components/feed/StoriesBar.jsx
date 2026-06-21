import React from "react";

const StoriesBar = ({ feedPosts }) => {
  return (
    <div className="pt-[52px]">
      <div className="max-w-[470px] mx-auto border-b border-white/[0.06]">
        <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
          {feedPosts.slice(0, 8).map((post, idx) => (
            <div key={`story-${idx}`} className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-[62px] h-[62px] rounded-full p-[2px] bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
                <div className="w-full h-full rounded-full p-[2px] bg-black">
                  <img
                    src={post.userId?.profileImage}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${post.userId?.username || 'U'}&background=333&color=fff&size=62`;
                    }}
                  />
                </div>
              </div>
              <span className="text-[11px] text-neutral-400 max-w-[64px] truncate">
                {post.userId?.username}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesBar;
