import React, { useState } from "react";

const MessagePage: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<{
    id: number;
    name: string;
    profilePic: string;
    messages: { sender: string; message: string; time: string }[];
  } | null>(null);

  const contacts = [
    {
      id: 1,
      name: "John Doe",
      profilePic: "https://via.placeholder.com/50",
      messages: [
        { sender: "John Doe", message: "Hi there!", time: "10:30 AM" },
        { sender: "You", message: "Hello! How are you?", time: "10:32 AM" },
        { sender: "John Doe", message: "I'm good, thanks for asking!", time: "10:35 AM" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePic: "https://via.placeholder.com/50",
      messages: [
        { sender: "Jane Smith", message: "Hey! Are you free today?", time: "9:15 AM" },
        { sender: "You", message: "Yes, what's up?", time: "9:17 AM" },
        { sender: "Jane Smith", message: "Can we meet for coffee?", time: "9:20 AM" },
      ],
    },
    {
      id: 3,
      name: "Alice Johnson",
      profilePic: "https://via.placeholder.com/50",
      messages: [
        { sender: "Alice Johnson", message: "Good morning!", time: "7:00 AM" },
        { sender: "You", message: "Morning! How are you?", time: "7:05 AM" },
        { sender: "Alice Johnson", message: "Great! Let's catch up soon.", time: "7:10 AM" },
      ],
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Contacts</h2>
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-200 rounded-md"
            >
              <img
                src={contact.profilePic}
                alt={contact.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{contact.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between bg-white p-4 shadow-md">
              <div className="flex items-center gap-3">
                <img
                  src={selectedContact.profilePic}
                  alt={selectedContact.name}
                  className="w-12 h-12 rounded-full"
                />
                <h2 className="font-semibold">{selectedContact.name}</h2>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Video Call
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {selectedContact.messages.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-4 flex items-end ${
                    chat.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  {chat.sender !== "You" && (
                    <img
                      src={selectedContact.profilePic}
                      alt={chat.sender}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <div
                    className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                      chat.sender === "You"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    <p>{chat.message}</p>
                    <span className="block text-xs text-gray-500 text-right">
                      {chat.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Typing Area */}
            <div className="flex items-center gap-3 p-4 bg-white shadow-md">
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Click a contact to start chatting!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
