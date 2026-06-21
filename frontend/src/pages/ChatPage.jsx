import React, { useEffect, useState } from "react";
import {
  Friends,
  SearchUsers,
  addFriend,
  checkFriendStatus,
  getUserProfileById,
  removeFriend,
} from "../api/user.api";
import { getReelById } from "../api/reels.api";
import { toast } from "sonner";
import { useSocket } from "../context/SocketContext";

import FriendsList from "../components/chat/FriendsList";
import ChatWindow from "../components/chat/ChatWindow";
import UserProfileModal from "../components/chat/UserProfileModal";

const ChatPage = () => {
  const [friends, setFriends] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Profile modal states
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // Chat states
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socket = useSocket();

  const openChat = (friend) => {
    setChatUser(friend);
    setMessageInput("");

    if (socket) {
      socket.emit("load-messages", { recipientId: friend._id });
    }
  };

  // Load messages when socket emits them
  useEffect(() => {
    if (!socket) return;

    const handleMessagesLoaded = (data) => {
      const formattedMessages = data.messages.map((msg) => ({
        sender: msg.sender === socket.user?._id ? "you" : msg.sender,
        text: msg.text,
        timestamp: msg.createdAt,
      }));
      setMessages(formattedMessages);
    };

    socket.on("messages-loaded", handleMessagesLoaded);

    return () => {
      socket.off("messages-loaded", handleMessagesLoaded);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!socket || !messageInput.trim()) return;

    socket.emit("send-message", {
      to: chatUser._id,
      message: messageInput,
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: "you",
        text: messageInput,
        timestamp: new Date(),
      },
    ]);
    setMessageInput("");
  };

  // Handle receiving messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (chatUser && data.from === chatUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            sender: data.from,
            text: data.message,
            timestamp: new Date(),
          },
        ]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, chatUser]);

  const handleRemoveFriend = async () => {
    try {
      await removeFriend(selectedUserId);
      setFriends((prev) => prev.filter((f) => f._id !== selectedUserId));
      setIsFriend(false);
      toast.success("Friend removed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to unfriend");
    }
  };

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
      await addFriend(friendId);
      setIsFriend(true);
      toast.success("Friend added successfully");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  // Live Search Effect
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await SearchUsers(searchText);
        setSearchResults(res.data);
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText]);

  // Fetch friends on load
  useEffect(() => {
    const allFriends = async () => {
      const res = await Friends();
      setFriends(res.data);
    };
    allFriends();
  }, []);

  // Fetch user profile when modal opens
  useEffect(() => {
    if (isProfileModalOpen && selectedUserId) {
      const load = async () => {
        try {
          setLoading(true);
          const profileRes = await getUserProfileById(selectedUserId);
          setUserDetails(profileRes.data.user);

          const reelRes = await getReelById(selectedUserId);
          setReels(reelRes.data.reels || []);
        } catch (error) {
          console.error("Error loading profile data");
        } finally {
          setLoading(false);
        }
      };

      load();
    }
  }, [isProfileModalOpen, selectedUserId]);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  const closeModal = () => {
    setIsProfileModalOpen(false);
    setUserDetails(null);
    setReels([]);
    setSelectedUserId(null);
  };

  // Handle Enter key for sending messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Chat View
  if (chatUser) {
    return (
      <ChatWindow
        chatUser={chatUser}
        onBack={() => {
          setChatUser(null);
          setMessages([]);
        }}
        messages={messages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        onSend={sendMessage}
        onKeyPress={handleKeyPress}
        socket={socket}
      />
    );
  }

  // Main View (Friends List)
  return (
    <div className="bg-[#1a1a1a] min-h-screen w-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#2a2a2a]">
        <h1 className="text-2xl text-white font-semibold tracking-wide">Messenger</h1>
      </div>

      <FriendsList
        searchText={searchText}
        setSearchText={setSearchText}
        searchResults={searchResults}
        friends={friends}
        onUserClick={handleUserClick}
        onFriendClick={openChat}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeModal}
        selectedUserId={selectedUserId}
        userDetails={userDetails}
        reels={reels}
        isFriend={isFriend}
        loading={loading}
        onAddFriend={handleAddFriend}
        onRemoveFriend={handleRemoveFriend}
      />
    </div>
  );
};

export default ChatPage;