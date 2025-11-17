import React, { useEffect, useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { Friends, SearchUsers, addFriend, checkFriendStatus, getUserProfileById, removeFriend } from '../api/user.api'
import { getReelById } from '../api/reels.api'
import { UserMinus, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useSocket } from '../context/SocketContext'

const HomePage = () => {
  const [friends, setFriends] = useState([])
  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // Profile modal states
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [reels, setReels] = useState([])
  const [reelsModal, setReelsModal] = useState(false)
  const [selectedReel, setSelectedReel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isFriend, setIsFriend] = useState(false)

  // Chat states
  const [chatUser, setChatUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const socket = useSocket()

  const openChat = (friend) => {
    setChatUser(friend)
    // setMessages([]) // Clear previous messages
    setMessageInput("")
    
    // Load chat history
    if (socket) {
      socket.emit("load-messages", { recipientId: friend._id })
    }
  }

  // Load messages when socket emits them
  useEffect(() => {
    if (!socket) return;

    const handleMessagesLoaded = (data) => {
      const formattedMessages = data.messages.map(msg => ({
        sender: msg.sender === socket.user?._id ? "you" : msg.sender,
        text: msg.text,
        timestamp: msg.createdAt
      }))
      setMessages(formattedMessages)
    }

    socket.on("messages-loaded", handleMessagesLoaded)
    
    return () => {
      socket.off("messages-loaded", handleMessagesLoaded)
    }
  }, [socket])

  const sendMessage = () => {
    if (!socket || !messageInput.trim()) return;

    socket.emit("send-message", {
      to: chatUser._id,
      message: messageInput
    })

    setMessages(prev => [...prev, {
      sender: "you",
      text: messageInput,
      timestamp: new Date()
    }])
    setMessageInput("");
  }

  // Handle receiving messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      // Only add message if it's from the current chat user
      if (chatUser && data.from === chatUser._id) {
        setMessages(prev => [...prev, {
          sender: data.from,
          text: data.message,
          timestamp: new Date()
        }])
      }
    }

    // FIXED: Correct spelling of "receive"
    socket.on("receive-message", handleReceiveMessage)
    
    return () => {
      socket.off("receive-message", handleReceiveMessage)
    }
  }, [socket, chatUser])

  const handleRemoveFriend = async () => {
    try {
      await removeFriend(selectedUserId)
      setFriends(prev => prev.filter(f => f._id !== selectedUserId))
      setIsFriend(false)
      toast.success("Friend removed successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed to unfriend")
    }
  }

  useEffect(() => {
    const fetchFriendship = async () => {
      try {
        const res = await checkFriendStatus(selectedUserId);
        setIsFriend(res.data.isFriend);
      } catch (err) {
        console.error("Failed to check friend status", err);
      }
    };

    if (selectedUserId) fetchFriendship();
  }, [selectedUserId]);

  const handleAddFriend = async (friendId) => {
    try {
      await addFriend(friendId)
      setIsFriend(true)
      toast.success("Friend added successfully")
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  }

  // Live Search Effect
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([])
      return
    }

    const delay = setTimeout(async () => {
      try {
        const res = await SearchUsers(searchText)
        setSearchResults(res.data)
      } catch (err) {
        console.log(err)
      }
    }, 300)

    return () => clearTimeout(delay)
  }, [searchText])

  // Fetch friends on load
  useEffect(() => {
    const allFriends = async () => {
      const res = await Friends()
      setFriends(res.data)
    }
    allFriends()
  }, [])

  // Fetch user profile when modal opens
  useEffect(() => {
    if (isProfileModalOpen && selectedUserId) {
      const load = async () => {
        try {
          const profileRes = await getUserProfileById(selectedUserId)
          setUserDetails(profileRes.data.user)

          const reelRes = await getReelById(selectedUserId);
          setReels(reelRes.data.reels || []);
        } catch (error) {
          console.error("Error loading profile data");
        }
      }

      load()
    }
  }, [isProfileModalOpen, selectedUserId])

  const handleUserClick = (userId) => {
    setSelectedUserId(userId)
    setIsProfileModalOpen(true)
  }

  const closeModal = () => {
    setIsProfileModalOpen(false)
    setUserDetails(null)
    setReels([])
    setSelectedUserId(null)
  }

  // Handle Enter key for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Chat View
  if (chatUser) {
    return (
      <div className="bg-[#111] text-white h-screen flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-gray-700 p-4">
          <button 
            onClick={() => {
              setChatUser(null)
              setMessages([])
            }}
            className="hover:bg-gray-800 rounded-full p-1 transition"
          >
            <IoMdArrowRoundBack size={28} />
          </button>
          <img
            src={chatUser.profileImage || "https://res.cloudinary.com/dranpsjot/image/upload/v1762681550/hi_i7mwyu.jpg"}
            className="h-10 w-10 rounded-full object-cover"
            alt={chatUser.username}
          />
          <h2 className="text-xl font-semibold">{chatUser.username}</h2>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-xs break-words ${
                    msg.sender === "you"
                      ? "bg-blue-600"
                      : "bg-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-3 p-4 border-t border-gray-700 pb-20">
          <input
            className="flex-1 p-3 bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!socket}
          />
          <button
            onClick={sendMessage}
            disabled={!socket || !messageInput.trim()}
            className="px-5 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        {/* Connection Status */}
        {!socket && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg">
            Not connected to chat server
          </div>
        )}
      </div>
    );
  }

  // Main View (Friends List)
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
        {/* Search results */}
        {searchText.length > 0 && searchResults.length > 0 && (
          searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#262626] transition cursor-pointer"
              onClick={() => handleUserClick(user._id)}
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
              onClick={() => openChat(friend)}
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

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className="min-h-screen flex flex-col items-center w-full">
            {/* Close Button */}
            <div>
              <button
                className="absolute left-4 top-4 h-10 w-10 rounded-full bg-gray-800/70 hover:bg-gray-700 flex justify-center items-center transition-colors z-20"
                onClick={closeModal}
              >
                <IoMdArrowRoundBack size={28} className="text-white" />
              </button>
              <div className='absolute right-4 top-4 h-10 rounded-full bg-gray-800/70 hover:bg-gray-700 flex justify-center items-center transition-colors z-20'>
                <div className='flex justify-center items-center gap-2 px-3'>
                  {isFriend ? (
                    <div onClick={() => handleRemoveFriend(selectedUserId)}
                      className='flex gap-2 justify-center items-center cursor-pointer'>
                      <UserMinus size={20} className="text-white font-bold" />
                      <span className='text-white'>Remove</span>
                    </div>
                  ) : (
                    <div onClick={() => handleAddFriend(selectedUserId)}
                      className='flex gap-2 cursor-pointer'>
                      <UserPlus size={20} className="text-white font-bold" />
                      <span className='text-white'>Add Friend</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <p className="text-white text-lg">Loading...</p>
              </div>
            ) : userDetails ? (
              <>
                {/* Cover */}
                <div className="relative h-auto w-full">
                  <div className="w-full h-48 bg-gray-800 overflow-hidden">
                    <img
                      src={userDetails.coverImage || "https://res.cloudinary.com/dranpsjot/image/upload/v1762681941/coverImage_qorkmv.jpg"}
                      alt="cover"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Profile image */}
                  <div className="flex flex-col items-center -mt-14 px-5">
                    <img
                      src={userDetails.profileImage || "https://res.cloudinary.com/dranpsjot/image/upload/v1762681550/hi_i7mwyu.jpg"}
                      className="w-28 h-28 rounded-full border-4 border-black object-cover bg-gray-900"
                      alt={userDetails.username}
                    />

                    {/* Info */}
                    <div className="flex flex-col items-center gap-2 mt-3">
                      <div className="flex gap-5 items-center justify-center">
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
                    <p className="font-semibold text-lg text-white">{reels.length}</p>
                    <p className="text-gray-400 text-sm">Posts</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-white">0</p>
                    <p className="text-gray-400 text-sm">Total Views</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-white">0</p>
                    <p className="text-gray-400 text-sm">Following</p>
                  </div>
                </div>

                {/* Role + Join Date */}
                <div className="flex gap-7 mt-4 text-sm text-gray-400">
                  <p>
                    Role: <span className="text-white font-medium">{userDetails?.role}</span>
                  </p>
                  {userDetails?.createdAt && (
                    <p>
                      Joined: {new Date(userDetails.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Reels Grid */}
                <div className="grid grid-cols-3 gap-1 mt-8 w-full max-w-md px-2 pb-8">
                  {reels.length > 0 &&
                    reels.map((reel) => (
                      <div
                        key={reel._id}
                        className="aspect-square border border-gray-700 rounded-md bg-gray-800 overflow-hidden cursor-pointer hover:opacity-80 transition"
                        onClick={() => {
                          setSelectedReel(reel)
                          setReelsModal(true)
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
              </>
            ) : null}

            {/* Reel Modal */}
            {reelsModal && selectedReel && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-xl bg-[#1C1C1D] rounded-xl overflow-hidden shadow-xl">
                  <button
                    className="absolute right-3 top-3 h-10 w-10 rounded-full bg-gray-800/70 hover:bg-gray-700 flex justify-center items-center transition-colors z-20"
                    onClick={() => setReelsModal(false)}
                  >
                    <IoMdArrowRoundBack size={28} className="text-white" />
                  </button>

                  <div className="flex flex-col gap-4 p-5">
                    <video
                      className="w-full max-h-[45vh] rounded-lg object-cover"
                      src={selectedReel.videoUrl}
                      autoPlay
                      loop
                      playsInline
                    />

                    <div>
                      <h1 className="font-semibold text-xl text-white truncate">
                        {selectedReel.title}
                      </h1>
                      <p className="text-gray-400 text-sm mt-1">
                        {selectedReel.description}
                      </p>
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
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage