import React, { useEffect, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useClearNotificationMutation,useGetNotificationQuery } from "../../slices/apiUserSlice";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Bell, X } from "lucide-react";
import { toast } from "react-toastify";


const NotificationsDropdown: React.FC = () => {
  const {
    socket,
  } = useSocketContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const [clearNotification] = useClearNotificationMutation();
  const { data: userNotifications,refetch } = useGetNotificationQuery(userId!, {
      skip: !userId,
    });
  const unreadCount = userNotifications?.length || 0
 
useEffect(() => {
    if (!socket) return;
    socket.on("OneUserLiked", ({ likedUserId,name }) => {
      if (likedUserId === userId) {
        toast.success(`${name} liked your profile.`)
      }
      refetch()
    });

    socket.on("OneMessage", ({ receivedUserId,name }) => {
      if (receivedUserId === userId) {
        toast.success(`${name} sent a message.`)
      }
      refetch()
    });
    socket.on("OneMatch", ({ userID }) => {
      if (userID === userId) {
        toast.success(`You have a new match!`)
      }
      refetch()
    });

    return () => {
      socket.off("OneUserLiked");
      socket.off("OneMessage")
    };
  }, [refetch, socket, userId]);




  const clearNotifications = async () => {
    try {
      if (!userId) {
        console.error("User ID is undefined. Cannot clear notifications.");
        return;
      }
      await clearNotification(userId).unwrap();
      refetch()
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button 
        className="relative p-2 hover:bg-gray-700 rounded-full transition-colors duration-200" 
        onClick={toggleDropdown}
      >
        <Bell className="text-white w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

     

      {/* Dropdown */}
      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden"
          style={{ zIndex: 50 }}
        >
          <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
            <button 
              onClick={() => setShowDropdown(false)} 
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {userNotifications && unreadCount > 0 ? (
            <>
              <ul className="max-h-64 overflow-y-auto">
                {userNotifications.map((notification, index) => (
                  <li 
                    key={index} 
                    className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <p className="text-sm text-gray-700">{notification.message}</p>
                  </li>
                ))}
              </ul>
              <div className="p-2 bg-gray-50">
                <button
                  onClick={clearNotifications}
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                >
                  <X className="mr-2 w-4 h-4" />
                  Clear All Notifications
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Bell className="mx-auto mb-2 w-8 h-8 text-gray-300" />
              No notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;