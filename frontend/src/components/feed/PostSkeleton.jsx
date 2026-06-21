import React from "react";

const PostSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-9 h-9 rounded-full bg-neutral-800" />
      <div className="h-3 w-24 bg-neutral-800 rounded" />
    </div>
    <div className="w-full aspect-square bg-neutral-800" />
    <div className="px-4 py-3 space-y-2">
      <div className="h-3 w-20 bg-neutral-800 rounded" />
      <div className="h-3 w-48 bg-neutral-800 rounded" />
    </div>
  </div>
);

export default PostSkeleton;
