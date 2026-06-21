import React from "react";
import { LogOut, SquarePen } from "lucide-react";

const ProfileHeader = ({ userDetails, onLogout, onToggleEdit }) => {
  return (
    <>
      {/* Logout + Edit Button */}
      <div className="w-full absolute h-6 px-5 top-5 z-20 flex justify-between items-center">
        <div
          className="bg-gray-900 rounded-md p-2 flex justify-center items-center hover:bg-orange-500 transition-colors duration-300 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="text-orange-500" />
        </div>

        <SquarePen
          size={38}
          onClick={onToggleEdit}
          className="text-white hover:bg-orange-500 bg-gray-900 rounded-md p-2 flex justify-center items-center transition-colors duration-300 cursor-pointer"
        />
      </div>

      {/* Cover */}
      <div className="relative h-auto w-full">
        <div className="w-full h-48 bg-gray-800 overflow-hidden">
          <img
            src={
              userDetails.coverImage ||
              "https://res.cloudinary.com/dranpsjot/image/upload/v1762681941/coverImage_qorkmv.jpg"
            }
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile image */}
        <div className="flex flex-col items-center -mt-14 px-5">
          <img
            src={
              userDetails.profileImage ||
              "https://res.cloudinary.com/dranpsjot/image/upload/v1762681550/hi_i7mwyu.jpg"
            }
            className="w-28 h-28 rounded-full border-2 border-white object-cover bg-gray-900"
            alt="profile"
          />

          {/* Info */}
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
    </>
  );
};

export default ProfileHeader;
