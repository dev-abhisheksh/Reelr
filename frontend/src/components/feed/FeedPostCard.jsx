import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

const FeedPostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  const toggleLike = () => {
    setIsLiked(prev => !prev);
  };

  const toggleSave = () => {
    setIsSaved(prev => !prev);
  };

  const toggleCaption = () => {
    setIsExpanded(prev => !prev);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 800);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <article className="border-b border-white/[0.06]">
      {/* ── Post Header ── */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] rounded-full ring-[1.5px] ring-neutral-700 overflow-hidden">
            <img
              src={post.userId?.profileImage}
              className="w-full h-full object-cover"
              alt=""
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${post.userId?.username || "U"}&background=333&color=fff&size=34`;
              }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-white">
              {post.userId?.username}
            </span>
            <span className="text-neutral-500 text-[13px]">•</span>
            <span className="text-neutral-500 text-[13px]">
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <button className="p-1 hover:bg-white/5 rounded-full transition-colors">
          <MoreHorizontal size={20} className="text-neutral-400" />
        </button>
      </div>

      {/* ── Post Image ── */}
      {post.image && (
        <div
          className="relative w-full bg-neutral-950 select-none"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.image}
            className="w-full max-h-[585px] object-cover"
            alt="post"
            loading="lazy"
          />

          {/* Double-tap heart animation */}
          {showHeartPop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart
                size={80}
                fill="white"
                className="text-white drop-shadow-2xl animate-[heartPop_0.8s_ease-out_forwards]"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-1.5">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className="active:scale-[1.2] transition-transform duration-150"
            aria-label="Like"
          >
            <Heart
              size={24}
              fill={isLiked ? "#ff3040" : "none"}
              className={`transition-colors duration-200 ${isLiked ? "text-[#ff3040]" : "text-white hover:text-neutral-400"
                }`}
            />
          </button>
          <button
            className="hover:text-neutral-400 transition-colors"
            aria-label="Comment"
          >
            <MessageCircle size={24} className="text-white" />
          </button>
          <button
            className="hover:text-neutral-400 transition-colors"
            aria-label="Share"
          >
            <Send size={22} className="text-white -rotate-12" />
          </button>
        </div>
        <button
          onClick={toggleSave}
          className="active:scale-[1.2] transition-transform duration-150"
          aria-label="Save"
        >
          <Bookmark
            size={24}
            fill={isSaved ? "white" : "none"}
            className={`transition-colors duration-200 ${isSaved ? "text-white" : "text-white hover:text-neutral-400"
              }`}
          />
        </button>
      </div>

      {/* ── Likes count ── */}
      <div className="px-3.5 pb-1">
        <p className="text-[13px] font-semibold text-white">
          {(post.likesCount ?? 0) + (isLiked ? 1 : 0)} likes
        </p>
      </div>

      {/* ── Caption ── */}
      {post.text && (
        <div className="px-3.5 pb-1">
          <p className="text-[13px] text-white leading-[18px]">
            <span className="font-semibold mr-1.5">
              {post.userId?.username}
            </span>
            {post.text.length > 100 && !isExpanded ? (
              <>
                {post.text.slice(0, 100)}...
                <button
                  onClick={toggleCaption}
                  className="text-neutral-500 ml-1"
                >
                  more
                </button>
              </>
            ) : (
              post.text
            )}
          </p>
        </div>
      )}

      {/* ── Timestamp ── */}
      <div className="px-3.5 pt-1 pb-3">
        <time className="text-[11px] text-neutral-500 uppercase tracking-wider">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: new Date(post.createdAt).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
          })}
        </time>
      </div>
    </article>
  );
};

export default FeedPostCard;
