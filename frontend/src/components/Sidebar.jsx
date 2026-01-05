import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading,
    subscribeToUserUpdates,
    unsubscribeFromUserUpdates
  } = useChatStore();
  
  const { onlineUsers, socket } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  // Initial load
  useEffect(() => {
    getUsers();
    subscribeToUserUpdates();

    return () => {
      unsubscribeFromUserUpdates();
    };
  }, [getUsers, subscribeToUserUpdates, unsubscribeFromUserUpdates]);

  // Initialize unread counts when users are loaded
  useEffect(() => {
    if (users && users.length > 0) {
      const counts = {};
      users.forEach(user => {
        counts[user._id] = user.unreadCount || 0;
      });
      setUnreadCounts(counts);
    }
  }, [users]);

  // Listen for new messages to update unread count in real-time
  useEffect(() => {
    if (!socket) return;
  
    const handleNewMessage = (data) => {
      const message = data.message || data;
  
      // 1️⃣ Ignore missing/invalid payloads
      if (!message || !message._id) return;
  
      // 2️⃣ Ignore system / reconnect events that have no content
      if (!message.text && !message.image) return;
  
      // 3️⃣ Ignore your own messages
      const authUserId = useAuthStore.getState().authUser?._id;
      if (message.senderId === authUserId) return;
  
      // 4️⃣ Only count unread if you are NOT currently chatting with sender
      if (selectedUser?._id !== message.senderId) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1
        }));
      }
    };
  
    socket.on("newMessage", handleNewMessage);
  
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);
  

  // Reset unread count when user is selected
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUnreadCounts(prev => ({
      ...prev,
      [user._id]: 0
    }));
  };

  // Format last seen time
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Offline";
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now - lastSeenDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return lastSeenDate.toLocaleDateString();
  };

  // Filter users by search term and online status
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOnlineFilter = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    return matchesSearch && matchesOnlineFilter;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Search Bar */}
        <div className="mt-3 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-base-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Online Filter */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleUserSelect(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) 
                  ? "Online" 
                  : formatLastSeen(user.lastSeen)
                }
              </div>
            </div>

            {/* Unread count badge */}
            {unreadCounts[user._id] > 0 && (
              <div className="flex items-center justify-center min-w-[20px] h-5 px-2 bg-primary text-primary-content text-xs font-bold rounded-full">
                {unreadCounts[user._id] > 99 ? '99+' : unreadCounts[user._id]}
              </div>
            )}
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            {searchTerm ? "No users found" : "No online users"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;