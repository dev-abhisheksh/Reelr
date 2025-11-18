import React, { useEffect, useState, useRef } from "react";
import {
  myReels,
  profileImagesUpload,
  updateProfileData,
  userProfile,
} from "../api/user.api";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LogOut, SquarePen, X } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "../api/auth.api";
import { updateReel } from "../api/reels.api";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userId, setUserId] = useState("");
  const [reels, setReels] = useState([]);

  const [reelsModal, setReelsModal] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);

  const [editForm, setEditForm] = useState(false);
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");

  const navigate = useNavigate();

  const profileRef = useRef(null);
  const coverRef = useRef(null);

  const [isEditing, setisEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const handleSaveReelUpdates = async () => {
    try {
      const data = {
        title: editTitle,
        description: editDescription,
      };
      await updateReel(selectedReel._id, data);

      setisEditing(false);
      setSelectedReel((prev) => ({
        ...prev,
        title: editTitle,
        description: editDescription,
      }));

      setReels((prevReels) =>
        prevReels.map((reel) =>
          reel._id === selectedReel._id
            ? { ...reel, title: editTitle, description: editDescription }
            : reel
        )
      );
      toast.success("Reel updated successfully");
    } catch (err) {
      toast.error(errorMsg);
    }
  };


  // ✅ Upload profile picture
  const handleProfileImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const res = await profileImagesUpload(file, "profile");

      setUserDetails((prev) => ({
        ...prev,
        profileImage: res.data.imageUrl,
      }));

      toast.success("Profile picture updated");
    } catch (err) {
      toast.error("Failed to upload profile image");
    }
  };

  // ✅ Upload cover image
  const handleCoverImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const res = await profileImagesUpload(file, "cover");

      setUserDetails((prev) => ({
        ...prev,
        coverImage: res.data.imageUrl,
      }));

      toast.success("Cover image updated");
    } catch (err) {
      toast.error("Failed to upload cover image");
    }
  };

  // ✅ Submit Profile Update
  const handleSubmit = async () => {
    try {
      if (!fullName.trim()) return toast.error("Full name is required");

      const res = await updateProfileData(fullName, bio);

      setUserDetails(res.data.user);
      toast.success("Profile updated");

      setEditForm(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const toggleEditForm = () => setEditForm(!editForm);

  // ✅ Fetch Profile + Prefill inputs
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user, userId } = await userProfile();

        setUserDetails(user);
        setUserId(userId);

        // Prefill editable values
        setFullName(user.fullName);
        setBio(user.bio || "");
      } catch (error) {
        toast.error("Error loading profile");
      }
    };
    fetchProfile();
  }, []);

  // ✅ Fetch reels
  useEffect(() => {
    const fetchUserReels = async () => {
      try {
        const reelsData = await myReels();
        setReels(reelsData);
      } catch (error) {
        toast.error("Failed to load reels");
      }
    };

    fetchUserReels();
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // optional backend call

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // clear user context/state if you have one
      // setUser(null);
      toast.success("Logged out successfully");

      // redirect
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      {/* Logout + Edit Button */}
      <div className="w-full absolute h-6 px-5 top-5 z-20 flex justify-between items-center">
        <div
          className="bg-gray-900 rounded-md p-2 flex justify-center items-center hover:bg-orange-500 transition-colors duration-300"
          onClick={handleLogout}
        >
          <LogOut />
        </div>

        <SquarePen
          size={38}
          onClick={toggleEditForm}
          className="text-white hover:bg-orange-500 bg-gray-900 rounded-md p-2 flex justify-center items-center transition-colors duration-300"
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

      {/* Stats */}
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

      {/* Role + Join Date */}
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

      {/* Reels Grid */}
      <div className="grid grid-cols-3 gap-1 mt-8 w-full max-w-md px-2">
        {reels.length > 0 &&
          reels.map((reel, index) => (
            <div
              key={index}
              className="aspect-square border border-white rounded-md bg-gray-800 overflow-hidden"
              onClick={() => {
                setSelectedReel(reel);
                setEditTitle(reel.title)
                setEditDescription(reel.description)
                setisEditing(false)
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

      {/* Reel Modal */}
      {reelsModal && selectedReel && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#1C1C1D] rounded-xl overflow-hidden shadow-xl">
            <button
              className="absolute right-3 top-3 h-10 w-10 rounded-full bg-gray-800/70 hover:bg-gray-700 flex justify-center items-center transition-colors z-20"
              onClick={() => setReelsModal(false)}
            >
              <IoMdArrowRoundBack size={28} />
            </button>

            <div className="flex flex-col gap-4 p-5">

              <video
                className="w-full max-h-[45vh] rounded-lg object-cover"
                src={selectedReel.videoUrl}
                autoPlay
                loop
                playsInline
              />

              <div className="flex justify-between items-start gap-3">

                {/* LEFT SIDE */}
                <div className="flex-1">
                  {isEditing ? (
                    <div>
                      <input
                        className="bg-gray-800 text-white px-3 py-2 rounded w-full"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />

                      <textarea
                        className="bg-gray-800 text-white px-3 py-2 rounded w-full mt-2"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="font-semibold text-xl text-white truncate">
                        {selectedReel.title}
                      </h1>

                      <p className="text-gray-400 text-sm mt-1">
                        {selectedReel.description}
                      </p>
                    </>
                  )}
                </div>

                {/* RIGHT SIDE: EDIT BUTTON */}
                {isEditing ? (
                  <button
                    onClick={handleSaveReelUpdates}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <SquarePen
                    className="cursor-pointer hover:text-gray-300"
                    onClick={() => setisEditing(true)}
                  />
                )}
              </div>




              <div className="border-t border-gray-700 pt-3">
                <h3 className="text-gray-300 text-sm">
                  Views: {selectedReel.views}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Form */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-gray-900 z-50 transform transition-transform duration-300 ${editForm ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center border-b border-gray-800 p-4 bg-gray-950">
          <h1 className="text-white text-xl font-semibold flex-1 text-center">
            Edit Profile
          </h1>
          <X
            onClick={toggleEditForm}
            className="text-gray-400 hover:text-white cursor-pointer transition-colors"
            size={24}
          />
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-60px)]">
          {/* Profile Pic */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">
              Profile Picture
            </label>
            <button
              onClick={() => profileRef.current.click()}
              className="w-full p-4 bg-gray-800 rounded-xl border border-gray-700 
        flex items-center justify-center gap-3 hover:bg-gray-750 hover:border-gray-600 
        transition-all text-gray-300 font-medium"
            >
              Change Profile Image
            </button>
            <input
              ref={profileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleProfileImage}
            />
          </div>

          {/* Cover Pic */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">
              Cover Image
            </label>
            <button
              onClick={() => coverRef.current.click()}
              className="w-full h-40 bg-gray-800 border border-gray-700 rounded-xl 
        flex flex-col items-center justify-center hover:bg-gray-750 hover:border-gray-600 
        transition-all text-gray-300 font-medium"
            >
              Upload Cover Image
            </button>
            <input
              ref={coverRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleCoverImage}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl 
        text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 
        transition-colors"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">Bio</label>
            <textarea
              maxLength={150}
              rows={4}
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 rounded-xltext-white placeholder-gray-500 resize-none focus:outline-nonefocus:border-blue-500 transition-colors"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-right text-xs text-gray-500 mt-1">
              {bio.length}/150
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold w-full transition-colors">
              Save Changes
            </button>
          </div>

          <div className="h-10">

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
