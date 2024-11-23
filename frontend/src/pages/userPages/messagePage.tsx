import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Navbar from '../../components/user/Navbar';
import { useSocketContext } from '../../context/SocketContext';
import { useSendMessageMutation, useGetChatHistoryQuery, useGetMatchProfilesQuery } from '../../slices/apiUserSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Search, Phone, Video, Smile } from 'lucide-react';
import { useLocation } from "react-router-dom";
import type { EmojiClickData } from 'emoji-picker-react';

interface Message {
  senderId: string;
  message: string;
  createdAt: string;
}

interface MatchProfile {
  id: string;
  name: string;
  image: string[];
  age: string | number | Date;
  place: string;
}

const MatchesAndChat: React.FC = () => {
  const { socket } = useSocketContext();
  const [sendMessageMutation] = useSendMessageMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const location = useLocation();
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add skip and refetch to the query
  const { data: chatHistory, refetch: refetchChatHistory } = useGetChatHistoryQuery(
    { userId1: userId, userId2: selectedMatch },
    { 
      skip: !userId || !selectedMatch,
      pollingInterval: 0 // Disable polling as we'll handle updates manually
    }
  );

  const { data: matchProfiles = [] } = useGetMatchProfilesQuery(userId);

  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter matches based on search query
  const filteredMatches = matchProfiles.filter((match: MatchProfile) =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMatchProfile = matchProfiles.find(
    (match: MatchProfile) => match.id === selectedMatch
  );

  // Add focus detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && selectedMatch) {
        refetchChatHistory();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedMatch, refetchChatHistory]);

  // Update when returning to the page
  useEffect(() => {
    if (location.state && location.state.partnerUserId) {
      setSelectedMatch(location.state.partnerUserId);
    //   refetchChatHistory();
    }
  }, [location.state]);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory.data);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

    try {
      const newMessage = {
        senderId: userId,
        receiverId: selectedMatch,
        message: messageInput,
        createdAt: new Date().toISOString(), // Add timestamp when sending
      };

      await sendMessageMutation(newMessage).unwrap();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: userId,
          message: messageInput,
          createdAt: new Date().toISOString(),
        },
      ]);

      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  // Handle match selection
  const handleMatchSelect = (matchId: string) => {
    setSelectedMatch(matchId);
    refetchChatHistory(); // Fetch latest messages when selecting a match
  };

  const handleVideoCall = () => {
    console.log('Starting video call with:', selectedMatchProfile?.name);
  };

  const handleVoiceCall = () => {
    console.log('Starting voice call with:', selectedMatchProfile?.name);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-pink-50 to-white">
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
                    filteredMatches.map((match: MatchProfile, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleMatchSelect(match.id)}
                        className={`flex items-center p-2 rounded-lg hover:bg-pink-50 transition-all cursor-pointer ${
                          selectedMatch === match.id ? 'bg-pink-100' : ''
                        }`}
                      >
                        <img
                          src={match.image[0]}
                          alt={match.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                        />
                        <div className="ml-3 overflow-hidden">
                          <h3 className="font-semibold text-gray-800 truncate">{match.name}</h3>
                          <p className="text-xs text-gray-600 truncate">
                            {calculateAge(match.age)} years • {match.place}
                          </p>
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
                  <p className="text-gray-500 text-lg">Select a person to start chatting...</p>
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
                          {calculateAge(selectedMatchProfile?.age || '')} years • {selectedMatchProfile?.place}
                        </p>
                      </div>
                    </div>
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
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="space-y-2">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex flex-col">
                            <div
                              className={`max-w-[70%] px-3 py-2 rounded-lg ${
                                msg.senderId === userId
                                  ? 'bg-pink-500 text-white'
                                  : 'bg-gray-200 text-black'
                              }`}
                            >
                              {msg.message}
                            </div>
                            <span className="text-xs text-gray-500 mt-1 px-1">
                              {formatMessageTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-white border-t relative">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          ref={emojiButtonRef}
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-2 text-gray-500 hover:text-pink-500 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                        
                        {showEmojiPicker && (
                          <div 
                            ref={emojiPickerRef}
                            className="absolute bottom-12 left-0 z-50 shadow-lg rounded-lg"
                            style={{ backgroundColor: 'white' }}
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
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      
                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
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