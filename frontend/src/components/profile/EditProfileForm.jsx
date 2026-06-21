import React from "react";
import { X } from "lucide-react";

const EditProfileForm = ({
  isOpen,
  onClose,
  fullName,
  setFullName,
  bio,
  setBio,
  onProfileImageChange,
  onCoverImageChange,
  onSubmit,
  profileRef,
  coverRef,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-full bg-gray-900 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center border-b border-gray-800 p-4 bg-gray-950">
        <h1 className="text-white text-xl font-semibold flex-1 text-center">
          Edit Profile
        </h1>
        <X
          onClick={onClose}
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
            onChange={onProfileImageChange}
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
            onChange={onCoverImageChange}
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
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
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
            onClick={onSubmit}
            className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold w-full transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default EditProfileForm;
