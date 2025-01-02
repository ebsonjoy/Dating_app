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
} from "../../slices/apiUserSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Search, Phone, Video, Smile, CheckCheck, Check } from "lucide-react";
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

// interface MatchProfile {
//   id: string;
//   name: string;
//   image: string[];
//   age: string | number | Date;
//   place: string;
// }

interface CallState {
  isReceivingCall: boolean;
  from: string;
  offer: RTCSessionDescriptionInit |  undefined
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
    offer:  undefined,
  });
  console.log("onlineUsers", onlineUsers);

  const { data: chatHistory, refetch: refetchChatHistory } =
    useGetChatHistoryQuery(
      { userId1: userId, userId2: selectedMatch },
      {
        skip: !userId || !selectedMatch,
        pollingInterval: 0, 
      }
    );

    const { data: matchProfiles = [] } = useGetMatchProfilesQuery(userId!, {
      skip: !userId,
    });
    console.log('matchProfiles',matchProfiles)

  const { data: unreadMessageCounts, refetch: refetchUnreadCounts } =
    useGetUnreadMessageCountQuery(userId!, {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    });
  console.log("unreadMessageCounts", unreadMessageCounts);
  const [localUnreadCounts, setLocalUnreadCounts] = useState<
    Record<string, number> 
  >({});

  useEffect(() => {
    if (unreadMessageCounts?.data&& typeof unreadMessageCounts.data === 'object') {
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

  console.log('filteredMatches',filteredMatches)
  const selectedMatchProfile = matchProfiles.find(
    (match: IMatchProfile) => match.id === selectedMatch
  );

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
  }, [selectedMatch, messages, userId, markMessagesAsRead, refetchUnreadCounts, socket]);

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
      console.log('chatttt',chatHistory.data)
    }
  }, [chatHistory]);

  const name = userInfo?.name;

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("newMessage", (newMessage: Message) => {
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     });

  //     socket.on("messageRead", ({ messageId, readerId }) => {
  //       setMessages((prevMessages) =>
  //         prevMessages.map((msg) =>
  //           msg._id === messageId ? { ...msg, isRead: true } : msg
  //         )
  //       );
  //     });

  //     return () => {
  //       socket.off("newMessage");
  //       socket.off("messageRead");
  //     };
  //   }
  // }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage: Message) => {
        // Only update messages if they belong to the current conversation
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
          // If message doesn't belong to current conversation, don't update
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

        // If the message is from someone else and we're not in their chat,
        // we could trigger a notification or update unread count
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
      console.log("Received incoming call from:", from);
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
      console.log("Call rejected by the opponent.");
      setShowVideoCall(false);
      setCallState({
        isReceivingCall: false,
        from: "",
        offer:  undefined,
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
    // e.preventDefault();
    // if (!messageInput.trim() || !selectedMatch) return;

    // try {
    //   const newMessage = {
    //     senderId: userId,
    //     receiverId: selectedMatch,
    //     message: messageInput,
    //     createdAt: new Date().toISOString(),
    //   };

    //   await sendMessageMutation(newMessage).unwrap();

    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     {
    //       senderId: userId,
    //       message: messageInput,
    //       createdAt: new Date().toISOString(),
    //     },
    //   ]);

    e.preventDefault();
    if (!messageInput.trim() || !selectedMatch) return;

    try {
      const newMessage = {
        senderId:userId as string,
        receiverId: (selectedMatch as string) || '',
        message: messageInput,
        createdAt: new Date().toISOString(),
      };
      await sendMessageMutation(newMessage).unwrap();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId:  userId as string,
          receiverId: selectedMatch,
          message: messageInput,
          createdAt: new Date().toISOString(),
        },
      ]);

      socket?.emit("notifyMessage", {
        name,
        // likerId: userId,
        likedUserId: selectedMatch,
      });

      setMessageInput("");
    } catch (err: unknown) {
      const error = err as IApiError
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
        console.error("Error while liking the user:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  const handleMatchSelect = (matchId: string) => {
    setSelectedMatch(matchId);
    refetchChatHistory();
  };

  const handleVideoCall = () => {
    console.log("Starting video call with:", selectedMatchProfile?.id);
    if (selectedMatch && userId) {
      console.log("Initiating video call to:", selectedMatch);
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
      offer:  undefined,
    });
  };

  const handleVoiceCall = () => {
    console.log("Starting voice call with:", selectedMatchProfile?.name);
  };

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
              <div className="flex-1 overflow-y-auto">
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
                            {/* Online status indicator */}
                            {onlineUsers.includes(match.id) && (
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
                        <h2 className="text-sm text-green-500">
                          {onlineUsers.includes(selectedMatchProfile?.id || '')
                            ? "Online"
                            : ""}
                        </h2>
                      </div>
                    </div>
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
                            offer:  undefined,
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
                  </div>

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
                        placeholder="Type a message..."
                        className="flex-1 p-2 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                      />

                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
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
