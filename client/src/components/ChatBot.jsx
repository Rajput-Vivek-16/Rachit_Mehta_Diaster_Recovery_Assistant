import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add a welcome message when the component mounts
  useEffect(() => {
    setConversation([{ role: 'bot', content: 'How can I help you?' }]);
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Handle form submission (send input to backend and update conversation)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return; // Avoid empty input submission

    // Add user input to conversation
    const newMessage = { role: 'user', content: userInput };
    setConversation([...conversation, newMessage]);
    setUserInput('');
    setLoading(true);

    try {
      // Send the user input to the Flask backend using Axios
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
      const res = await axios.post(`${backendUrl}/chat`, { text: newMessage.content });
      
      // Add response from backend to conversation
      const botResponse = { role: 'bot', content: res.data.response };
      setConversation((prevConversation) => [...prevConversation, botResponse]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setConversation((prevConversation) => [
        ...prevConversation,
        { role: 'bot', content: 'An error occurred while processing your request.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-800 rounded-lg shadow-lg mt-10 w-full max-w-full h-screen flex flex-col">
      <h1 className="text-4xl font-semibold text-white text-center mb-4">Disaster Assistance Chatbot</h1>
      
      {/* Scrollable chat history */}
      <div className="flex-grow overflow-y-auto bg-gray-700 p-4 rounded-lg shadow-md mb-4">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-md mb-4 ${msg.role === 'user' ? 'bg-blue-100 text-blue-900 text-right' : 'bg-gray-100 text-gray-900 text-left'}`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-center">Loading...</div>
        )}
      </div>

      {/* Input form for new messages */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="relative flex items-center w-full">
          {/* Chat emoji on the left side */}
          <span className="text-2xl text-white ml-3">💬</span>
          {/* Textarea input field with character limit and auto-scroll */}
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Ask about disaster help..."
            className="w-full p-3 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 text-black pl-10 resize-none h-20 overflow-y-auto"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-black focus:outline-none transition duration-300 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Response'}
        </button>
      </form>
    </div>
  );
}
  
export default ChatBot;
