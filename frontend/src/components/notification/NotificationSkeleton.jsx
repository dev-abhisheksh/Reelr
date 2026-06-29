import React from "react";
import Skeleton from "../ui/Skeleton";

const NotificationSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3 backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            {/* Avatar circle placeholder */}
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />

            {/* Text details placeholder */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-2 w-full">
                  {/* Username line */}
                  <Skeleton className="h-3.5 w-24" />
                  
                  {/* Description line */}
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>

              {/* Action Buttons placeholder */}
              {index % 2 === 0 && (
                <div className="flex items-center gap-2 mt-3 pt-1">
                  <Skeleton className="h-9 w-24 rounded-full" />
                  <Skeleton className="h-9 w-24 rounded-full bg-neutral-800/50" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
