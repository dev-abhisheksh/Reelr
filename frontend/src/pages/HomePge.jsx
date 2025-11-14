import React, { useEffect, useState } from 'react'
import { Friends, SearchUsers } from '../api/user.api'

const HomePge = () => {

  const [friends, setFriends] = useState([])             // default friends list
  const [searchText, setSearchText] = useState("")       // user input text
  const [searchResults, setSearchResults] = useState([]) // live API results


  // 🔎 Live Search Effect
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);  // clear results if input empty
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await SearchUsers(searchText);
        setSearchResults(res.data);
      } catch (err) {
        console.log(err);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [searchText]);


  // 👥 Fetch friends on load
  useEffect(() => {
    const allFriends = async () => {
      const res = await Friends();
      setFriends(res.data);
    }
    allFriends();
  }, []);


  return (
    <div className="bg-[#1a1a1a] min-h-screen w-full">

      {/* Header */}
      <div className="px-5 py-4 border-b border-[#2a2a2a]">
        <h1 className="text-2xl text-white font-semibold tracking-wide">Messenger</h1>
      </div>

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

        {/* 🔎 If user is typing → show search results */}
        {searchText.length > 0 && searchResults.length > 0 && (
          searchResults.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#262626] transition cursor-pointer"
            >
              <img
                src={user.profileImage}
                className="h-12 w-12 rounded-full object-cover"
              />
              <h2 className="text-lg text-white">{user.username}</h2>
            </div>
          ))
        )}

        {/* If user typed but NO matches */}
        {searchText.length > 0 && searchResults.length === 0 && (
          <p className="text-gray-500 px-3">No users found</p>
        )}

        {/* Default friends list when search empty */}
        {searchText.length === 0 && friends.length > 0 && (
          friends.map((friend, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#262626] transition cursor-pointer"
            >
              <img
                src={friend.profileImage}
                className="h-12 w-12 rounded-full object-cover"
              />
              <h2 className="text-lg text-white">{friend.username}</h2>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default HomePge
