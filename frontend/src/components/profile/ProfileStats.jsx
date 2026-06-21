import React from "react";

const ProfileStats = ({ postsCount, role, createdAt }) => {
  return (
    <>
      {/* Stats */}
      <div className="flex justify-around w-full mt-6 text-center border-t border-b border-gray-700 py-4">
        <div>
          <p className="font-semibold text-lg">{postsCount}</p>
          <p className="text-gray-400 text-sm">Posts</p>
        </div>
        <div>
          <p className="font-semibold text-lg">0</p>
          <p className="text-gray-400 text-sm">Total Views</p>
        </div>
        <div>
          <p className="font-semibold text-lg">0</p>
          <p className="text-gray-400 text-sm">Following</p>
        </div>
      </div>

      {/* Role + Join Date */}
      <div className="flex gap-7 mt-4 text-sm text-gray-400">
        <p>
          Role:{" "}
          <span className="text-white font-medium">{role}</span>
        </p>
        {createdAt && (
          <p>
            Joined:{" "}
            {new Date(createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </>
  );
};

export default ProfileStats;
