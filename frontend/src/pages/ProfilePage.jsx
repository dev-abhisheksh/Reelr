import React, { useEffect, useState } from "react";
import { userProfile } from "../api/user.api";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user, userId } = await userProfile();
        console.log("User details", user);
        console.log("UserId", userId);
        // console.log("Full user data:", user);
        console.log("Profile image path:", user?.profileImage);
        console.log("Cover image path:", user?.coverImage);
        setUserDetails(user);
        setUserId(userId);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchProfile();
  }, []);

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      {/* Profile Header */}
      <div className="relative h-auto w-full">
        {/* Cover Image */}
        <div className="w-full h-48 bg-gray-800 overflow-hidden">
          <img
            src={userDetails?.coverImage}
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center -mt-14 px-5">
          {/* Profile Image */}
          <img
            src={userDetails?.profileImage}
            alt={userDetails?.username}
            className="w-28 h-28 rounded-full border-4 border-gray-900 object-cover bg-gray-900"
          />

          {/* User Info */}
          <div className="flex flex-col items-center gap-2 mt-3">
            <div className="flex gap-5 items-center">
              <h2 className="text-xl font-semibold text-white">
                {userDetails?.fullName}
              </h2>
              <p className="text-gray-400 text-sm">@{userDetails?.username}</p>
            </div>
            <p className="text-sm text-gray-300 max-w-xs text-center px-4 mt-2">
              {userDetails?.bio || "No bio yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-around w-full mt-6 text-center border-t border-b border-gray-700 py-4">
        <div>
          <p className="font-semibold text-lg">0</p>
          <p className="text-gray-400 text-sm">Posts</p>
        </div>
        <div>
          <p className="font-semibold text-lg">0</p>
          <p className="text-gray-400 text-sm">Followers</p>
        </div>
        <div>
          <p className="font-semibold text-lg">0</p>
          <p className="text-gray-400 text-sm">Following</p>
        </div>
      </div>

      {/* Role + Joined Date */}
      <div className="flex gap-7 mt-4 text-sm text-gray-400">
        <p>
          Role:{" "}
          <span className="text-white font-medium">{userDetails?.role}</span>
        </p>
        {userDetails?.createdAt && (
          <p>
            Joined:{" "}
            {new Date(userDetails.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Posts Grid Placeholder */}
      <div className="grid grid-cols-3 gap-1 mt-8 w-full max-w-md px-2">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-800 flex items-center justify-center text-gray-600 text-sm"
          >
            Coming soon
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
