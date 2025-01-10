import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import Navbar from "../../components/user/Navbar";
import { useSocketContext } from "../../context/SocketContext";
import {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useGetMatchProfilesQuery,
  useMarkMessagesAsReadMutation,
  useGetUnreadMessageCountQuery,
  useUserBlockedMutation,
  useUserUnblockedMutation,
  useUserBlockedListQuery,
  useUserCreateReportMutation,
} from "../../slices/apiUserSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Search,
  Phone,
  Video,
  Smile,
  CheckCheck,
  Check,
  Ban,
  AlertCircle,Flag,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import type { EmojiClickData } from "emoji-picker-react";
import VideoCall from "./videoCall";
import { useCreateVideoCallMutation } from "../../slices/apiUserSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IMatchProfile } from "../../types/like.types";
// import { IMessage } from "../../types/message.types";
import { IApiError } from "../../types/error.types";
interface Message {
  receiverId: string | null;
  _id?: string;
  senderId: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

interface CallState {
  isReceivingCall: boolean;
  from: string;
  offer: RTCSessionDescriptionInit | undefined;
}

const MatchesAndChat: React.FC = () => {
  const { socket, onlineUsers } = useSocketContext();
  const [sendMessageMutation] = useSendMessageMutation();
  const [createVideoCall] = useCreateVideoCallMutation();
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const location = useLocation();
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callState, setCallState] = useState<CallState>({
    isReceivingCall: false,
    from: "",
    offer: undefined,
  });
  const [lastMessages, setLastMessages] = useState<
    Record<string, { message: string; timestamp: string }>
  >({});
  const [userCreateReport] = useUserCreateReportMutation();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const reportReasons = [
    'Inappropriate behavior',
    'Harassment',
    'Spam',
    'Fake profile',
    'Offensive content',
    'Other'
  ];

  const handleReportUser = async () => {
    if (!userId || !selectedMatch || !reportReason) {
      toast.error("Unable to report user at this time.");
      return;
    }
  
    try {
      const reportData = {
        reporterId: userId,
        reportedId: selectedMatch,
        reason: reportReason,
        additionalDetails,
      };  
      await userCreateReport(reportData).unwrap();
      handleBlockUser()
      toast.success("Report submitted successfully");
      setShowReportModal(false);
      setReportReason('');
      setAdditionalDetails('');
    } catch (err) {
      console.log(err)
      toast.error("Failed to submit report. Please try again.");
    }
  };
  
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockUser] = useUserBlockedMutation();
  const [unblockUser] = useUserUnblockedMutation();
  const handleBlockUser = async () => {
    if (!userId || !selectedMatch) {
      toast.error("User ID or Selected Match is missing.");
      return;
    }
    try {
      await blockUser({
        userId: userId,
        blockedUserId: selectedMatch,
      }).unwrap();

      // Emit socket event when blocking
      socket?.emit("userBlocked", {
        blockedUserId: selectedMatch,
        blockedByUserId: userId,
      });

      toast.success("User blocked successfully");
      setShowBlockModal(false);
      refetchBlockedUsers();
      // setSelectedMatch(null);
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.data?.message || "Failed to block user");
    }
  };

  // Update unblock user handler
  const handleUnblockUser = async () => {
    if (!userId || !selectedMatch) {
      toast.error("User ID or Selected Match is missing.");
      return;
    }
    try {
      await unblockUser({
        userId: userId,
        blockedUserId: selectedMatch,
      }).unwrap();

      // Emit socket event when unblocking
      socket?.emit("userUnblocked", {
        unblockedUserId: selectedMatch,
        unblockedByUserId: userId,
      });

      toast.success("User unblocked successfully");
      refetchBlockedUsers();
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.data?.message || "Failed to unblock user");
    }
  };

  const { data: userBlockedList, refetch: refetchBlockedUsers } =
    useUserBlockedListQuery(userId!, {
      skip: !userId,
    });

  const isMessagingBlocked = () => {
    if (
      !userBlockedList?.blockedUsers ||
      !selectedMatch ||
      !userId ||
      !selectedMatchProfile?.blockedUsers
    )
      return false;

    // Check if either user has blocked the other
    const isBlocked = userBlockedList.blockedUsers.includes(selectedMatch);
    const amIBlocked = selectedMatchProfile.blockedUsers.includes(userId);

    return isBlocked || amIBlocked;
  };
  const canSeeOnlineStatus = (userId: string, matchId: string) => {
    if (!selectedMatchProfile?.blockedUsers) {
      return;
    }
    if (!userBlockedList?.blockedUsers) return true;
    return (
      !userBlockedList.blockedUsers.includes(matchId) &&
      !selectedMatchProfile.blockedUsers.includes(userId)
    );
  };

  const { data: chatHistory, refetch: refetchChatHistory } =
    useGetChatHistoryQuery(
      { userId1: userId, userId2: selectedMatch },
      {
        skip: !userId || !selectedMatch,
        pollingInterval: 0,
      }
    );

  const { data: matchProfiles = [], refetch: refetchMatchProfiles } =
    useGetMatchProfilesQuery(userId!, {
      skip: !userId,
    });

    console.log('matchProfiles matchProfiles matchProfiles matchProfiles',matchProfiles)

  const { data: unreadMessageCounts, refetch: refetchUnreadCounts } =
    useGetUnreadMessageCountQuery(userId!, {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    });
  const [localUnreadCounts, setLocalUnreadCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (selectedMatch && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setLastMessages((prev) => ({
        ...prev,
        [selectedMatch]: {
          message: lastMessage.message,
          timestamp: lastMessage.createdAt,
        },
      }));
    }
  }, [messages, selectedMatch]);

  useEffect(() => {
    if (
      unreadMessageCounts?.data &&
      typeof unreadMessageCounts.data === "object"
    ) {
      setLocalUnreadCounts(unreadMessageCounts.data);
    }
  }, [unreadMessageCounts]);

  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Filter matches based on search query
  const filteredMatches = matchProfiles.filter((match: IMatchProfile) =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMatchProfile = matchProfiles.find(
    (match: IMatchProfile) => match.id === selectedMatch
  );

  useEffect(() => {
    if (!socket) return;
console.log('kkkkkkkkkkkkkkk')
    socket.on("userWasBlocked", ({ blockedUserId }) => {
      refetchBlockedUsers();
      refetchMatchProfiles();
      console.log('blockedUserIdblockedUserIdblockedUserId',blockedUserId,'blockedUserId',userId)
      if (blockedUserId === userId) {
        toast.error("You have been blocked by this user");
      }
    });

    // Listen for when you are unblocked by someone
    socket.on("userWasUnblocked", ({ unblockedByUserId }) => {
      refetchBlockedUsers();
      refetchMatchProfiles();
      if (unblockedByUserId === selectedMatch) {
        toast.success("You have been unblocked by this user");
      }
    });

    return () => {
      socket.off("userWasBlocked");
      socket.off("userWasUnblocked");
    };
  }, [
    socket,
    selectedMatch,
    refetchBlockedUsers,
    userBlockedList,
    refetchMatchProfiles,userId
  ]);

  // Add focus detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && selectedMatch) {
        refetchChatHistory();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [selectedMatch, refetchChatHistory]);

  useEffect(() => {
    if (
      selectedMatch &&
      messages.length > 0 &&
      document.visibilityState === "visible"
    ) {
      const unreadMessages = messages.filter(
        (msg) => msg.senderId === selectedMatch && !msg.isRead
      );

      if (unreadMessages.length > 0) {
        setLocalUnreadCounts((prev) => ({
          ...prev,
          [selectedMatch]: 0,
        }));

        if (userId && selectedMatch) {
          markMessagesAsRead({
            userId,
            senderId: selectedMatch,
          }).then(() => {
            refetchUnreadCounts();
          });
        }
        unreadMessages.forEach((msg) => {
          socket?.emit("markMessageRead", {
            messageId: msg._id,
            senderId: selectedMatch,
            readerId: userId,
          });
        });
      }
    }
  }, [
    selectedMatch,
    messages,
    userId,
    markMessagesAsRead,
    refetchUnreadCounts,
    socket,
  ]);

  // Update when returning to the page
  useEffect(() => {
    if (location.state && location.state.partnerUserId) {
      setSelectedMatch(location.state.partnerUserId);
      //   refetchChatHistory();
    }
  }, [location.state]);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory.data as unknown as Message[]);
    }
  }, [chatHistory]);

  const name = userInfo?.name;

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage: Message) => {
        // Only update messages if they belong to the current conversation
        setLastMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: {
            message: newMessage.message,
            timestamp: newMessage.createdAt,
          },
        }));
        setMessages((prevMessages) => {
          // Check if the message belongs to the current conversation
          if (
            (newMessage.senderId === selectedMatch &&
              newMessage.senderId !== userId) ||
            (newMessage.senderId === userId &&
              selectedMatch === newMessage.receiverId)
          ) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });

        if (
          newMessage.senderId !== userId &&
          newMessage.senderId !== selectedMatch
        ) {
          setLocalUnreadCounts((prev) => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
          refetchUnreadCounts(); // Refresh server counts
        }

        if (
          newMessage.senderId !== userId &&
          newMessage.senderId !== selectedMatch
        ) {
          // Optionally trigger a refetch of unread counts
          refetchChatHistory();
        }
      });

      socket.on("messageRead", ({ messageId, readerId }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, isRead: true } : msg
          )
        );

        // Update unread counts when messages are read
        if (readerId !== userId) {
          refetchUnreadCounts();
        }
      });

      return () => {
        socket.off("newMessage");
        socket.off("messageRead");
      };
    }
  }, [socket, selectedMatch, userId, refetchUnreadCounts, refetchChatHistory]);

  useEffect(() => {
    if (selectedMatch && userId) {
      markMessagesAsRead({ userId, senderId: selectedMatch });
    }
  }, [selectedMatch, userId, markMessagesAsRead]);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming calls
    socket.on("incoming-call", ({ from, offer }) => {
      setCallState({
        isReceivingCall: true,
        from,
        offer,
      });
    });

    // Clean up listeners
    return () => {
      socket.off("incoming-call");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("call-rejected", () => {
      setShowVideoCall(false);
      setCallState({
        isReceivingCall: false,
        from: "",
        offer: undefined,
      });
    });

    return () => {
      socket.off("call-rejected");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const cursorPosition = messageInput.length;
    const newMessage =
      messageInput.slice(0, cursorPosition) +
      emoji +
      messageInput.slice(cursorPosition);

    setMessageInput(newMessage);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedMatch) return;

    if (isMessagingBlocked()) {
      const isBlocked = userBlockedList?.blockedUsers.includes(selectedMatch);
      toast.error(
        isBlocked
          ? "You have blocked this user. Unblock them to send messages."
          : "This user has blocked you. You cannot send messages."
      );
      return;
    }

    try {
      const newMessage = {
        senderId: userId as string,
        receiverId: (selectedMatch as string) || "",
        message: messageInput,
        createdAt: new Date().toISOString(),
      };
      await sendMessageMutation(newMessage).unwrap();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: userId as string,
          receiverId: selectedMatch,
          message: messageInput,
          createdAt: new Date().toISOString(),
        },
      ]);

      socket?.emit("notifyForMessage", {
        name,
        receivedUserId: selectedMatch,
      });

      setMessageInput("");
    } catch (err: unknown) {
      const error = err as IApiError;
      if (
        error?.status === 403 &&
        error?.data?.code === "SUBSCRIPTION_EXPIRED"
      ) {
        toast.error(
          error?.data?.message ||
            "Your subscription has expired. Please subscribe."
        );
        navigate("/userPlanDetails");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  const handleMatchSelect = (matchId: string) => {
    setSelectedMatch(matchId);
    refetchChatHistory();
  };

  const handleVideoCall = () => {
    if (!selectedMatch) {
      return;
    }
    if (isMessagingBlocked()) {
      const isBlocked = userBlockedList?.blockedUsers.includes(selectedMatch);
      toast.error(
        isBlocked
          ? "You have blocked this user. Unblock them to start a video call."
          : "This user has blocked you. You cannot start a video call."
      );
      return;
    }

    if (selectedMatch && userId) {
      setShowVideoCall(true);
    }
  };

  const handleAcceptCall = () => {
    setShowVideoCall(true);
  };

  const handleRejectCall = () => {
    const callStatus = "rejected";
    if (userId && selectedMatch) {
      createVideoCall({
        callerId: userId,
        receiverId: selectedMatch.toString(),
        type: "video-call",
        duration: 0,
        status: callStatus,
      });
    } else {
      console.error("UserId or selectedMatch is undefined");
    }
    if (socket && callState.from) {
      socket.emit("call-rejected", { to: callState.from });
    }
    setShowVideoCall(false);
    setCallState({
      isReceivingCall: false,
      from: "",
      offer: undefined,
    });
  };

  const handleVoiceCall = () => {};

  // Function to format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  // Sort matches based on last message timestamp
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const timestampA = lastMessages[a.id]?.timestamp || "0";
    const timestampB = lastMessages[b.id]?.timestamp || "0";
    return new Date(timestampB).getTime() - new Date(timestampA).getTime();
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="max-w-[1400px] h-full mx-auto px-4 py-4">
          <div className="flex gap-4 h-full">
            {/* Left Side: Matches with Search */}
            <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                  Your Matches
                </h2>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search matches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Matches List */}
              {/* <div className="flex-1 overflow-y-auto">
                <div className="px-4 pb-4 space-y-2">
                  {filteredMatches.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No matches found</p>
                    </div>
                  ) : (
                    filteredMatches.map(
                      (match: IMatchProfile, index: number) => (
                        <div
                          key={index}
                          onClick={() => handleMatchSelect(match.id)}
                          className={`flex items-center p-2 rounded-lg hover:bg-pink-50 transition-all cursor-pointer ${
                            selectedMatch === match.id ? "bg-pink-100" : ""
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={match.image[0]}
                              alt={match.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                            />
                            {match?.blockedUsers?.includes(userId ?? "") ===
                              false &&
                              userBlockedList?.blockedUsers?.includes(
                                match.id
                              ) === false &&
                              onlineUsers.includes(match.id) && (
                                <div
                                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                  title="Online"
                                />
                              )}
                          </div>
                          <div className="ml-3 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-800 truncate">
                                {match.name}
                              </h3>
                              {localUnreadCounts[match.id] > 0 && (
                                <span className="ml-2 bg-pink-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                  {localUnreadCounts[match.id]}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {calculateAge(match.age)} years • {match.place}
                            </p>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div> */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-4 pb-4 space-y-2">
                  {sortedMatches.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No matches found</p>
                    </div>
                  ) : (
                    sortedMatches.map((match: IMatchProfile) => (
                      <div
                        key={match.id}
                        onClick={() => handleMatchSelect(match.id)}
                        className={`flex items-center p-3 rounded-lg hover:bg-pink-50 transition-all cursor-pointer ${
                          selectedMatch === match.id ? "bg-pink-100" : ""
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={match.image[0]}
                            alt={match.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                          />
                          {match?.blockedUsers?.includes(userId ?? "") === false && 
                            userBlockedList?.blockedUsers?.includes(match.id) === false && 
                            onlineUsers.includes(match.id) && (
                            <div
                              className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                              title="Online"
                            />
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {match.name}
                            </h3>
                            {lastMessages[match.id] && (
                              <span className="text-xs text-gray-500">
                                {formatRelativeTime(lastMessages[match.id].timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate max-w-[150px]">
                              {lastMessages[match.id]?.message || 'Start a conversation'}
                            </p>
                            {localUnreadCounts[match.id] > 0 && (
                              <span className="ml-2 bg-pink-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                {localUnreadCounts[match.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Chat */}
            <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col min-w-0">
              {!selectedMatch ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-lg">
                    Select a person to start chatting...
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b flex items-center justify-between bg-white rounded-t-xl">
                    <div className="flex items-center min-w-0">
                      <img
                        src={selectedMatchProfile?.image[0]}
                        alt={selectedMatchProfile?.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-pink-500 flex-shrink-0"
                      />
                      <div className="ml-3 overflow-hidden">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {selectedMatchProfile?.name}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">
                          {calculateAge(selectedMatchProfile?.age || "")} years
                          • {selectedMatchProfile?.place}
                        </p>
                        {canSeeOnlineStatus(userId!, selectedMatch) && (
                          <h2 className="text-sm text-green-500">
                            {onlineUsers.includes(selectedMatch)
                              ? "Online"
                              : ""}
                          </h2>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {userId && showVideoCall && socket ? (
                        <VideoCall
                          userId={userId}
                          matchId={selectedMatch}
                          socket={socket}
                          onClose={() => {
                            setShowVideoCall(false);
                            setCallState({
                              isReceivingCall: false,
                              from: "",
                              offer: undefined,
                            });
                          }}
                          isInitiator={!callState.isReceivingCall}
                          incomingOffer={callState.offer}
                          partnerName={
                            callState.isReceivingCall
                              ? selectedMatchProfile?.name || "Partner"
                              : selectedMatchProfile?.name || "Partner"
                          }
                        />
                      ) : (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={handleVoiceCall}
                            className="p-2 rounded-full hover:bg-gray-100"
                            title="Voice Call"
                          >
                            <Phone className="h-5 w-5 text-pink-500" />
                          </button>
                          <button
                            onClick={handleVideoCall}
                            className="p-2 rounded-full hover:bg-gray-100"
                            title="Video Call"
                          >
                            <Video className="h-5 w-5 text-pink-500" />
                          </button>
                        </div>
                      )}

<button
  onClick={() => setShowReportModal(true)}
  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
  title="Report User"
>
  <Flag className="h-5 w-5" />
</button>

{showReportModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all animate-fade-in">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <Flag className="text-red-500 h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Report & Block {selectedMatchProfile?.name}
          </h3>
        </div>

        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reason for reporting
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full text-white p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Select a reason</option>
              {reportReasons.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional details
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Please provide more details about your report..."
              className="w-full text-white p-2 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowReportModal(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleReportUser}
            disabled={!reportReason}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
              hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium 
              shadow-sm hover:shadow active:scale-95 flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Flag className="h-4 w-4" />
            Submit Report
          </button>
        </div>
      </div>
    </div>
  </div>
)}
                      {/* Enhanced Block/Unblock Button */}
                      <button
                        onClick={() => {
                          const isBlocked =
                            userBlockedList?.blockedUsers?.includes(
                              selectedMatch
                            );
                          if (isBlocked) {
                            handleUnblockUser();
                          } else {
                            setShowBlockModal(true);
                          }
                        }}
                        className={`p-2 rounded-full transition-all duration-200 
                          ${
                            userBlockedList?.blockedUsers?.includes(
                              selectedMatch
                            )
                              ? "bg-red-50 text-red-500 hover:bg-red-100"
                              : "text-gray-400 hover:bg-gray-100 hover:text-red-500"
                          }`}
                        title={
                          userBlockedList?.blockedUsers?.includes(selectedMatch)
                            ? "Unblock User"
                            : "Block User"
                        }
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Block Modal */}
                  {showBlockModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all animate-fade-in">
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 rounded-full">
                              <AlertCircle className="text-red-500 h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              Block {selectedMatchProfile?.name}?
                            </h3>
                          </div>

                          <div className="mb-6 space-y-4">
                            <p className="text-gray-700 font-medium">
                              When you block someone:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                They won't be able to send you messages
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                They won't see when you're online
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                They won't be able to start video calls with you
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                You can unblock them at any time
                              </li>
                            </ul>
                          </div>

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setShowBlockModal(false)}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium active:scale-95"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleBlockUser}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
                                hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium 
                                shadow-sm hover:shadow active:scale-95 flex items-center gap-2"
                            >
                              <Ban className="h-4 w-4" />
                              Block User
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {callState.isReceivingCall && !showVideoCall && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">
                          Incoming Video Call from{" "}
                          {selectedMatchProfile?.name || "Unknown"}
                        </h3>
                        <div className="flex gap-4">
                          <button
                            onClick={handleAcceptCall}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={handleRejectCall}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="space-y-4 px-2">
                      {messages.map((msg, index) => {
                        const isCurrentUser = msg.senderId === userId;

                        return (
                          <div
                            key={index}
                            className={`flex items-end space-x-2 ${
                              isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            {!isCurrentUser && (
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm text-gray-600">
                                  {selectedMatchProfile?.name?.charAt(0) || "?"}
                                </span>
                              </div>
                            )}

                            <div
                              className={`flex flex-col ${
                                isCurrentUser ? "items-end" : "items-start"
                              } max-w-[75%]`}
                            >
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isCurrentUser
                                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                                    : "bg-white border border-gray-200 text-gray-800"
                                } shadow-sm`}
                              >
                                <p className="text-sm leading-relaxed break-words">
                                  {msg.message}
                                </p>
                              </div>

                              <div className="flex items-center mt-1 space-x-2">
                                <span className="text-xs text-gray-500">
                                  {formatMessageTime(msg.createdAt)}
                                </span>
                                {isCurrentUser && (
                                  <span className="text-gray-500">
                                    {msg.isRead ? (
                                      <CheckCheck className="h-3 w-3" />
                                    ) : (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {isCurrentUser && (
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                                <span className="text-sm text-pink-600">
                                  {userInfo?.name?.charAt(0) || "Y"}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                    {isMessagingBlocked() && (
                      <div className="flex items-center justify-center p-4 mb-4 bg-red-50 rounded-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Ban className="h-6 w-6 text-red-500 mr-2" />
                            <span className="text-red-600 font-medium">
                              {userBlockedList?.blockedUsers.includes(
                                selectedMatch
                              )
                                ? "You have blocked this user"
                                : "You have been blocked by this user"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {userBlockedList?.blockedUsers.includes(
                              selectedMatch
                            )
                              ? "Unblock this user to resume messaging"
                              : "You cannot send or receive messages from this user"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 bg-white border-t relative"
                  >
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 hover:border-pink-200 transition-colors">
                      <div className="relative">
                        <button
                          type="button"
                          ref={emojiButtonRef}
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-2 text-gray-500 hover:text-pink-500 rounded-full hover:bg-white transition-all duration-200 active:scale-95"
                        >
                          <Smile className="h-5 w-5" />
                        </button>

                        {showEmojiPicker && (
                          <div
                            ref={emojiPickerRef}
                            className="absolute bottom-12 left-0 z-50 shadow-xl rounded-xl border border-gray-100"
                          >
                            <EmojiPicker
                              onEmojiClick={handleEmojiClick}
                              width={300}
                              height={400}
                            />
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={
                          isMessagingBlocked()
                            ? "Messaging is not available"
                            : "Type a message..."
                        }
                        disabled={isMessagingBlocked()}
                        className="flex-1 p-2 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm disabled:bg-gray-100"
                      />

                      <button
                        type="submit"
                        disabled={!messageInput.trim() || isMessagingBlocked()}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg 
                    hover:from-pink-600 hover:to-rose-600 transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-pink-500 
                    disabled:hover:to-rose-500 shadow-sm hover:shadow active:scale-95
                    flex items-center gap-2"
                      >
                        <span>Send</span>
                        <svg
                          className="w-4 h-4 rotate-90"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesAndChat;

// Helper function to calculate age
const calculateAge = (birthDate: string | number | Date) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
