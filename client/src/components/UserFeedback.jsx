import React, { useState } from 'react';

const UserFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback form submission here (e.g., send to API)
    console.log('Feedback submitted:', { name, email, feedback });
    // Clear form after submission
    setName('');
    setEmail('');
    setFeedback('');
  };

  return (
    <div className="bg-white text-black min-h-screen flex items-center justify-center py-8">
      <div className="bg-gray-100 rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">User Feedback</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-black font-medium mb-2">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:border-red-700"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-black font-medium mb-2">Your Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:border-red-700"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="feedback" className="block text-black font-medium mb-2">Your Feedback</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback"
              rows="4"
              className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:border-red-700"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
          >
            Submit Feedback
          </button>
        </form>
        
        <p className="text-center text-black mt-6">
          <span className="text-gray-600">Thank you for your feedback!</span>
        </p>
      </div>
    </div>
  );
};

export default UserFeedback;
