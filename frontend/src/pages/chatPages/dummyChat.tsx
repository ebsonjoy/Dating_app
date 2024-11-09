import React from 'react';
import { FiSend, FiSmile, FiVideo, FiPhone } from 'react-icons/fi';

const MessagePage: React.FC = () => {
  return (
    <div className="flex h-screen">

      {/* Left side: Message History */}
      <div className="w-1/4 bg-gray-100 p-4">
        {[1, 2, 3].map((id) => (
          <div key={id} className="flex items-center p-2 hover:bg-gray-200 cursor-pointer">
            <img src="/path/to/profile-photo.jpg" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <span className="font-semibold">User {id}</span>
          </div>
        ))}
      </div>

      {/* Right side: Chat Box */}
      <div className="w-3/4 bg-white flex flex-col">

        {/* Top Bar */}
        <div className="flex items-center p-4 bg-gray-100 border-b">
          <img src="/path/to/profile-photo.jpg" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
          <span className="font-semibold flex-grow">Contact Name</span>
          <button className="p-2 text-gray-600 hover:text-blue-500"><FiPhone size={20} /></button>
          <button className="p-2 text-gray-600 hover:text-blue-500"><FiVideo size={20} /></button>
        </div>

        {/* Message Area */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="text-left bg-gray-200 p-2 rounded mb-2 max-w-xs">Hello!</div>
          <div className="text-right bg-blue-500 text-white p-2 rounded ml-auto max-w-xs">Hi there!</div>
        </div>

        {/* Message Input */}
        <div className="flex items-center p-4 border-t">
          <button className="p-2 text-gray-600 hover:text-blue-500"><FiSmile size={24} /></button>
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-grow p-2 mx-2 border rounded-lg outline-none"
          />
          <button className="p-2 text-blue-500 hover:text-blue-700"><FiSend size={24} /></button>
        </div>
        
      </div>
    </div>
  );
};

export default MessagePage;
