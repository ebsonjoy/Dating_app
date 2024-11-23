// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSocketContext } from '../../context/SocketContext';
// import { useSendMessageMutation, useGetChatHistoryQuery } from '../../slices/apiUserSlice';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store';

// interface Message {
//   senderId: string;
//   message: string;
//   createdAt: string;
// }

// const ChatPage: React.FC = () => {
//   const { partnerUserId } = useParams<{ partnerUserId: string }>();
//   const { socket } = useSocketContext();
//   const [sendMessageMutation] = useSendMessageMutation();
//   const { userInfo } = useSelector((state: RootState) => state.auth);
//   const userId = userInfo?._id;
//   const [messageInput, setMessageInput] = useState('');
//   const [messages, setMessages] = useState<Message[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const { data: chatHistory } = useGetChatHistoryQuery(
//     { userId1: userId, userId2: partnerUserId },
//     { skip: !userId || !partnerUserId }
//   );

  
//   useEffect(() => {
//     if (chatHistory) {
//       setMessages(chatHistory.data);
//     }
//   }, [chatHistory]);


//   useEffect(() => {
//     if (socket) {
//       socket.on('newMessage', (newMessage: Message) => {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       });

//       return () => {
//         socket.off('newMessage');
//       };
//     }
//   }, [socket]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!messageInput.trim()) return;

//     try {
//       const newMessage = {
//         senderId: userId,
//         receiverId: partnerUserId,
//         message: messageInput,
//       };

//       await sendMessageMutation(newMessage).unwrap();


//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           senderId: userId,
//           message: messageInput,
//           createdAt: new Date().toISOString(),
//         },
//       ]);

//       setMessageInput('');
//     } catch (error) {
//       console.error('Failed to send message', error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <div className="flex-grow overflow-y-auto p-4 space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-[70%] px-3 py-2 rounded-lg ${
//                 msg.senderId === userId ? 'bg-pink-500 text-white' : 'bg-gray-200 text-black'
//               }`}
//             >
//               {msg.message}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
//         <div className="flex">
//           <input
//             type="text"
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-grow p-2 border rounded-l-lg"
//           />
//           <button
//             type="submit"
//             className="bg-pink-500 text-white px-4 py-2 rounded-r-lg hover:bg-pink-600"
//           >
//             Send
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatPage;
