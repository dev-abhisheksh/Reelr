import React from "react";

const FriendsList = ({
  searchText,
  setSearchText,
  searchResults,
  friends,
  onUserClick,
  onFriendClick,
}) => {
  return (
    <>
      {/* Search Input */}
      <div className="px-4 py-3">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full bg-[#2a2a2a] text-gray-200 border border-[#3a3a3a] 
                   outline-none rounded-xl py-2 px-4 
                   placeholder:text-gray-400 focus:border-gray-500 transition"
        />
      </div>

      {/* List Area */}
      <div className="px-3 space-y-4 mt-2">
        {/* Search results */}
        {searchText.length > 0 && searchResults.length > 0 && (
          searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#262626] transition cursor-pointer"
              onClick={() => onUserClick(user._id)}
            >
              <img
                src={user.profileImage || "https://res.cloudinary.com/dranpsjot/image/upload/v1762681550/hi_i7mwyu.jpg"}
                className="h-12 w-12 rounded-full object-cover"
                alt={user.username}
              />
              <h2 className="text-lg text-white">{user.username}</h2>
            </div>
          ))
        )}

        {/* No results */}
        {searchText.length > 0 && searchResults.length === 0 && (
          <p className="text-gray-500 px-3">No users found</p>
        )}

        {/* Friends list */}
        {searchText.length === 0 && friends.length > 0 && (
          friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#262626] transition cursor-pointer"
              onClick={() => onFriendClick(friend)}
            >
              <img
                src={friend.profileImage || "https://res.cloudinary.com/dranpsjot/image/upload/v1762681550/hi_i7mwyu.jpg"}
                className="h-12 w-12 rounded-full object-cover"
                alt={friend.username}
              />
              <h2 className="text-lg text-white">{friend.username}</h2>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FriendsList;
