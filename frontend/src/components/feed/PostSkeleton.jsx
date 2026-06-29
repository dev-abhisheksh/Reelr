import React from "react";
import Skeleton from "../ui/Skeleton";

const PostSkeleton = () => (
  <div>
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="w-9 h-9 rounded-full" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="w-full aspect-square rounded-none" />
    <div className="px-4 py-3 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-48" />
    </div>
  </div>
);

export default PostSkeleton;
