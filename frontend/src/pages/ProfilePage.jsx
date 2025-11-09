import React, { useEffect, useState, useContext } from "react";
import { myReels, userProfile } from "../api/user.api";
import { IoMdArrowRoundBack } from "react-icons/io";
import { SquarePen, X } from "lucide-react";



const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userId, setUserId] = useState("");
  const [reels, setReels] = useState([])
  const [reelsModal, setReelsModal] = useState(false)
  const [selectedReel, setSelectedReel] = useState(null)
  const [editForm, setEditForm] = useState(false)

  const toggleEditForm = () => setEditForm(!editForm)

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

      <div className=" absolute h-6 px-2 top-5 right-3 z-20 flex justify-center items-center">
        <h1 className="text-black font-bold"><SquarePen onClick={toggleEditForm} className="text-white" /></h1>
      </div>

      {/* Profile Header */}
      <div className="relative h-auto w-full">
        {/* Cover Image */}
        <div className="w-full h-48 bg-gray-800 overflow-hidden">
          <img
            src={userDetails?.coverImage || "https://res.cloudinary.com/dranpsjot/image/upload/v1762681941/coverImage_qorkmv.jpg"}
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center -mt-14 px-5">
          {/* Profile Image */}
          <img
            src={userDetails?.profileImage || "https://res.cloudinary.com/dranpsjot/image/upload/v1762681550/hi_i7mwyu.jpg"}
            className="w-28 h-28 rounded-full border-2 border-white object-cover bg-gray-900"
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
          <p className="text-gray-400 text-sm">Total Views</p>
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
            className="aspect-square border border-white rounded-md bg-gray-800 flex items-center justify-center text-gray-600 text-sm overflow-hidden"
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl h-[90vh] bg-[#1C1C1D] rounded-lg overflow-hidden">
            <button
              className="absolute right-4 top-4 h-10 w-10 rounded-full z-10 bg-gray-700 hover:bg-gray-600 flex justify-center items-center transition-colors"
              onClick={() => setReelsModal(false)}
            >
              <IoMdArrowRoundBack size={32} />
            </button>

            {/* Video Preview */}
            <div className="h-full w-full flex flex-col p-6">
              <div className="flex-1 flex items-center justify-center mb-4">
                <video
                  className="w-full max-h-[60vh] rounded-md object-contain"
                  src={selectedReel.videoUrl}
                  autoPlay
                  loop
                  playsInline
                />
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <div>
                  <h1 className="font-bold text-lg">Title: {selectedReel.title}</h1>
                  <p className="text-gray-400 mt-1">Description: {selectedReel.description}</p>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <h3 className="text-sm text-gray-300">Views: {selectedReel.views}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : ""}

      <div
        className={`fixed top-0 left-0 h-full w-full bg-white z-50 transform transition-transform duration-300 ease-out
    ${editForm ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center border-b border-gray-300 p-4">
          <h1 className="text-black text-xl font-semibold flex-1 text-center">
            Edit Profile
          </h1>
          <X onClick={toggleEditForm} className="text-black cursor-pointer" size={24} />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto h-[calc(100%-60px)]">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <img
              src="/default-avatar.png"
              alt="profile"
              className="w-20 h-20 sm:w-14 sm:h-14 rounded-full bg-gray-200 object-cover"
            />
            <button className="text-blue-600 font-medium text-sm sm:text-base">
              Change Profile Image
            </button>
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-gray-500 text-sm font-medium">Cover Image</label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <button className="text-blue-600 font-medium text-sm">
                Upload Cover Image
              </button>
              <p className="text-xs text-gray-400 mt-1">
                Recommended: 1500 x 500px
              </p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-gray-500 text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="text-black w-full mt-2 p-3 border border-gray-300 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-gray-500 text-sm font-medium">Bio</label>
            <textarea
              maxLength={150}
              rows={4}
              placeholder="Tell us about yourself..."
              className="text-black w-full mt-2 p-3 border border-gray-300 rounded-xl outline-none resize-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-right text-xs text-gray-400 mt-1">0 / 150</p>
          </div>

          {/* Gender */}
          <div>
            <label className="text-gray-500 text-sm font-medium">Gender</label>
            <select className="text-black w-full mt-2 p-3 border border-gray-300 rounded-xl outline-none text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option className="text-black">Prefer not to say</option>
              <option className="text-black">Male</option>
              <option className="text-black">Female</option>
              <option className="text-black">Custom</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              This won't be part of your public profile.
            </p>
          </div>

          <div className="flex justify-center items-center w-full">
            <button className="h-10 rounded-lg bg-green-400 text-xl font-bold border border-green-500 w-[90%]">Submit</button>
          </div>

          {/* Toggle Switch Card */}
          <div className="h-10">

          </div>

        </div>
      </div>
    </div>



  );
};

export default ProfilePage;
// className = "aspect-square bg-gray-800 flex items-center justify-center text-gray-600 text-sm"