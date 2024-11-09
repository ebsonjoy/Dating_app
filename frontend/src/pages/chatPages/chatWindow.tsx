import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  useGetChatHistoryQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} from '../../slices/messageApiSlice';

interface ChatWindowProps {
  chatPartnerId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatPartnerId }) => {
  const [message, setMessage] = useState('');
  const { userInfo } = useSelector((state: RootState) => state.auth);

  
  const {
    data: messages,
    isLoading,
    error,
  } = useGetChatHistoryQuery({
    userId1: userInfo?._id || '',
    userId2: chatPartnerId,
  }, {
    pollingInterval: 3000, 
  });

  const [sendMessage] = useSendMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();

  useEffect(() => {
    if (userInfo?._id && chatPartnerId) {
      markAsRead({ userId: userInfo._id, chatPartnerId });
    }
  }, [messages, userInfo?._id, chatPartnerId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userInfo?._id) return;

    try {
      await sendMessage({
        senderId: userInfo._id,
        receiverId: chatPartnerId,
        content: message.trim(),
      }).unwrap();
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading messages</div>;

  return (
    <div className="flex flex-col h-[500px] w-full max-w-2xl border rounded-lg p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.senderId === userInfo?._id
                ? 'ml-auto bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            <p>{msg.content}</p>
            <span className="text-xs opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};
