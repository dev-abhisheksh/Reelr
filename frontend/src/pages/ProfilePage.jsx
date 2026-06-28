import React, { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import LogoutModal from "../components/profile/LogoutModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const queryClient = useQueryClient();

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { user, setUser, loading: authLoading } = useAuth()
  const navigate = useNavigate();

  // Fetch profile via React Query
  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: userProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch reels via React Query
  const { data: reels = [] } = useQuery({
    queryKey: ["myReels"],
    queryFn: myReels,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const userDetails = profileResponse?.user;
  const userId = profileResponse?.userId;

  // Sync profile details for the edit form
  useEffect(() => {
    if (userDetails) {
      setFullName(userDetails.fullName || "");
      setBio(userDetails.bio || "");
    }
  }, [userDetails]);

  const handleReelDelete = async () => {
    toast("Delete this reel?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteReel(selectedReel._id);
            toast.success("Reel deleted successfully");

            // Optimistically update the react query cache for reels
            queryClient.setQueryData(["myReels"], (old) => {
              if (!old) return [];
              return old.filter((r) => r._id !== selectedReel._id);
            });

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

      // Update the react query cache for reels
      queryClient.setQueryData(["myReels"], (old) => {
        if (!old) return [];
        return old.map((reel) =>
          reel._id === selectedReel._id
            ? { ...reel, title: editTitle, description: editDescription }
            : reel
        );
      });

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

      // Update the react query cache for profile
      queryClient.setQueryData(["myProfile"], (old) => {
        if (!old) return old;
        return {
          ...old,
          user: {
            ...old.user,
            profileImage: res.data.imageUrl,
          },
        };
      });

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

      // Update the react query cache for profile
      queryClient.setQueryData(["myProfile"], (old) => {
        if (!old) return old;
        return {
          ...old,
          user: {
            ...old.user,
            coverImage: res.data.imageUrl,
          },
        };
      });

      toast.success("Cover image updated");
    } catch (err) {
      toast.error("Failed to upload cover image");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!fullName.trim()) return toast.error("Full name is required");

      const res = await updateProfileData(fullName, bio);

      // Update the react query cache for profile
      queryClient.setQueryData(["myProfile"], (old) => {
        if (!old) return old;
        return {
          ...old,
          user: res.data.user,
        };
      });

      toast.success("Profile updated");
      setEditForm(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const toggleEditForm = () => {
    if (!editForm && userDetails) {
      setFullName(userDetails.fullName || "");
      setBio(userDetails.bio || "");
    }
    setEditForm(!editForm);
  };

  const handleLogout = async (allDevices = false) => {
    try {
      await logout(allDevices);
      setUser(null);
      queryClient.clear(); // Clear cache on logout to prevent leaks
      toast.success(allDevices ? "Logged out from all devices successfully" : "Logged out successfully");
      setIsLogoutModalOpen(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  if (isProfileLoading || !userDetails) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4 text-zinc-400">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
          <span className="text-sm tracking-wide">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center pb-12">
      <ProfileHeader
        userDetails={userDetails}
        onLogout={() => setIsLogoutModalOpen(true)}
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

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default ProfilePage;
