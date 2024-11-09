import React, { useState } from 'react';
import ChatSidebar from './chatSidebar';
import ChatWindow from './chatWindow';

const ChatPage: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
  
    return (
      <div className="flex h-screen">
        <ChatSidebar onProfileClick={(partnerUserId) => setSelectedChat(partnerUserId)} />
        {selectedChat ? (
          <ChatWindow partnerUserId={selectedChat} />
        ) : (
          <div className="w-3/4 h-full flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    );
  };
  
  export default ChatPage;
