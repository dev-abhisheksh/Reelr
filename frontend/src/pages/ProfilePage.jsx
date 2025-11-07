import React, { useEffect, useState } from "react";
import { myReels, userProfile } from "../api/user.api";
import { IoMdArrowRoundBack } from "react-icons/io";


const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userId, setUserId] = useState("");
  const [reels, setReels] = useState([])
  const [reelsModal, setReelsModal] = useState(false)
  const [selectedReel, setSelectedReel] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user, userId } = await userProfile();
        setUserDetails(user);
        setUserId(userId);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserReels = async () => {
      try {
        const reelsData = await myReels(); // API call
        console.log("Fetched reels:", reelsData); // this must show
        setReels(reelsData);
      } catch (error) {
        console.error("Failed to fetch user reels:", error);
      }
    };

    fetchUserReels();
  }, []);

  const toggleReelModal = () => setReelsModal(!reelsModal)

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
          <p className="font-semibold text-lg">{reels.length}</p>
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
        {reels.length > 0 && reels.map((reel, index) => (
          <div key={index}
            className="aspect-square border border-white bg-gray-800 flex items-center justify-center text-gray-600 text-sm overflow-hidden"
            onClick={() => {
              setSelectedReel(reel);
              setReelsModal(true);
            }}
          >
            <video

              src={reel.videoUrl}
              className="w-full h-full object-cover"
              muted
              loop
            />
          </div>

        ))}
      </div>

      {/* //creating a model to view each reels by clicking on it */}
      {reelsModal && selectedReel ? (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="w-[92%] h-[90%] bg-[#1C1C1D] rounded-lg flex justify-center">
            <button
              className="absolute right-2 top-5 h-10 w-10 rounded-full z-55 bg-gray-700 flex justify-center items-center"
              onClick={() => setReelsModal(false)}
            >
              <IoMdArrowRoundBack size={32} />
            </button>

            {/* Video Preview */}
            <div className="h-[55%] w-[95%] flex justify-center items-center">
              <div className="flex flex-col overflow-hidden gap-5">
                <div className="h-[55%] overflow-hidden">
                  <video
                    className="w-full h-[55%] overflow-hidden rounded-md"
                    src={selectedReel.videoUrl}
                    autoPlay
                    loop
                    playsInline 
                  />
                </div>
                <div className="p-3 flex flex-col justify-between h-full flex-1">
                  <div>
                    <h1 className="font-bold">Title : {selectedReel.title}</h1>
                    <p className="text-gray-400 pl-2">Description : {selectedReel.description}</p>
                  </div>

                  <div className="absolute bottom-20 left-10">
                    <h3>Views : {selectedReel.views}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : ""}


    </div>
  );
};

export default ProfilePage;
// className = "aspect-square bg-gray-800 flex items-center justify-center text-gray-600 text-sm"