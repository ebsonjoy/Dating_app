import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
import { useGetChatHistoryQuery, useSendMessageMutation } from '../../slices/messageApiSlice';

interface ChatWindowProps {
    partnerUserId: string;
  }
  
  const ChatWindow: React.FC<ChatWindowProps> = ({ partnerUserId }) => {
    const { data: chatHistory } = useGetChatHistoryQuery({ userId1: partnerUserId, userId2: partnerUserId });
    const [sendMessage] = useSendMessageMutation();
    const [newMessage, setNewMessage] = useState<string>("");
  
    const handleSendMessage = async () => {
      if (newMessage.trim()) {
        await sendMessage({ senderId: partnerUserId, content: newMessage });
        setNewMessage("");
      }
    };
  
    return (
      <div className="w-3/4 h-full flex flex-col bg-white p-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{partnerUserId}</h2>
          <button className="p-2 text-gray-500 hover:text-gray-700">📹 Video Call</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {chatHistory?.map((message, index) => (
            <div key={index} className="mb-4">
              <span className={message.senderId === partnerUserId ? 'text-blue-500' : 'text-green-500'}>
                {message.content}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex items-center">
          <button className="text-gray-500 text-xl">😊</button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1 border rounded-lg p-2 mx-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            Send
          </button>
        </div>
      </div>
    );
  };
  
  export default ChatWindow;