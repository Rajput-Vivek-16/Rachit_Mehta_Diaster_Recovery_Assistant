import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Handle form submission (send input to backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send the user input to the Flask backend using Axios
      const res = await axios.post('http://127.0.0.1:5000/chat', {
        text: userInput,
      });
      // Display the response from the backend
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Disaster Assistance Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask about disaster help..."
        />
        <button type="submit" disabled={loading}>Get Response</button>
      </form>

      {loading && <p>Loading...</p>}
      
      {response && (
        <div>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default Chatbot;