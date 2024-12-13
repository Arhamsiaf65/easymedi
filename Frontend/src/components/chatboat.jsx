import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'; // Corrected import

// Initialize socket connection
const socket = io('http://localhost:4000');

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [userMessage, setUserMessage] = useState(''); // Track user's input

  useEffect(() => {
    // Listen for messages from the server
    socket.on('reply', (reply) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: reply }]);
    });

    // Clean up socket connection
    return () => {
      socket.off('reply');
    };
  }, []);

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      // Add user's message to the chat
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage }]);

      // Send the message to the server
      socket.emit('message', userMessage);

      // Clear the input field
      setUserMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto h-screen bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
      <div className="flex flex-col flex-grow overflow-y-auto p-4 bg-white rounded-t-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-2 rounded-lg max-w-[75%] ${
              message.sender === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-200 text-gray-900'
            }`}
          >
            <strong>{message.sender === 'user' ? 'You: ' : 'Bot: '}</strong>
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex items-center border-t border-gray-300 bg-gray-50 p-2 rounded-b-lg">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
