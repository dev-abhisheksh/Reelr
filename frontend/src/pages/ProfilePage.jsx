import React, { useEffect, useState, useRef } from "react";
import {
  myReels,
  profileImagesUpload,
  updateProfileData,
  userProfile,
} from "../api/user.api";
import { toast } from "sonner";
import { logout } from "../api/auth.api";
import { deleteReel, updateReel } from "../api/reels.api";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ReelsGrid from "../components/profile/ReelsGrid";
import EditProfileForm from "../components/profile/EditProfileForm";
import ReelDetailModal from "../components/profile/ReelDetailModal";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userId, setUserId] = useState("");
  const [reels, setReels] = useState([]);

  const [reelsModal, setReelsModal] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);

  const [editForm, setEditForm] = useState(false);
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");

  const profileRef = useRef(null);
  const coverRef = useRef(null);

  const [isEditing, setisEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleReelDelete = async () => {
    toast("Delete this reel?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteReel(selectedReel._id);
            toast.success("Reel deleted successfully");
            setReels((prev) => prev.filter((r) => r._id !== selectedReel._id));
            setReelsModal(false);
          } catch (error) {
            console.error("Error deleting reel:", error);
            toast.error("Failed to delete reel");
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

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
      toast.error("Failed to update reel");
    }
  };

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user, userId } = await userProfile();

        setUserDetails(user);
        setUserId(userId);

        setFullName(user.fullName);
        setBio(user.bio || "");
      } catch (error) {
        toast.error("Error loading profile");
      }
    };
    fetchProfile();
  }, []);

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
      await logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success("Logged out successfully");
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
    <div className="bg-black text-white min-h-screen flex flex-col items-center pb-12">
      <ProfileHeader
        userDetails={userDetails}
        onLogout={handleLogout}
        onToggleEdit={toggleEditForm}
      />

      <ProfileStats
        postsCount={reels.length}
        role={userDetails?.role}
        createdAt={userDetails?.createdAt}
      />

      <ReelsGrid
        reels={reels}
        onReelClick={(reel) => {
          setSelectedReel(reel);
          setEditTitle(reel.title);
          setEditDescription(reel.description);
          setisEditing(false);
          setReelsModal(true);
        }}
      />

      <ReelDetailModal
        isOpen={reelsModal}
        onClose={() => setReelsModal(false)}
        reel={selectedReel}
        isEditing={isEditing}
        setIsEditing={setisEditing}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        onSave={handleSaveReelUpdates}
        onDelete={handleReelDelete}
      />

      <EditProfileForm
        isOpen={editForm}
        onClose={toggleEditForm}
        fullName={fullName}
        setFullName={setFullName}
        bio={bio}
        setBio={setBio}
        onProfileImageChange={handleProfileImage}
        onCoverImageChange={handleCoverImage}
        onSubmit={handleSubmit}
        profileRef={profileRef}
        coverRef={coverRef}
      />
    </div>
  );
};

export default ProfilePage;
