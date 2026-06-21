import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

const ChatWindow = ({
  chatUser,
  onBack,
  messages,
  messageInput,
  setMessageInput,
  onSend,
  onKeyPress,
  socket,
}) => {
  return (
    <div className="bg-[#111] text-white h-screen flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-gray-700 p-4">
        <button
          onClick={onBack}
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
                  msg.sender === "you" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="flex items-center gap-3 p-4 border-t border-gray-700 pb-30">
        <input
          className="flex-1 p-3 bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type a message..."
          disabled={!socket}
        />
        <button
          onClick={onSend}
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
};

export default ChatWindow;
