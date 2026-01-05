import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import TypingIndicator from "./TypingIndicator";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkelton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    selectedUser,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch messages & subscribe to real-time updates
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages(selectedUser._id);

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Listen for typing indicator
  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data) => {
      if (data.senderId === selectedUser?._id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("userTyping", handleUserTyping);
    };
  }, [socket, selectedUser]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator username={selectedUser.fullName} />}

        {/* Dummy div for scroll-to-bottom */}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;