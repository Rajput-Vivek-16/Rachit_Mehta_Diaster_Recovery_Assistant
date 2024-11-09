import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
      role: 'community_user', // Default role
      Country : country
    };

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        // On successful signup, navigate to the login page
        navigate('/');
      } else {
        // Handle error response from the backend
        setErrorMessage(result.message || 'Error signing up');
      }
    } catch (error) {
      setErrorMessage('Failed to connect to the server');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div style={{ backgroundColor: '#e4e4e7' }} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-black font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:border-red-700"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-black font-medium mb-2">Email</label>
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
            <label htmlFor="password" className="block text-black font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:border-red-700"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-black font-medium mb-2">Country</label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter your country"
              className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:border-red-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        {errorMessage && (
          <p className="text-center text-red-600 mt-4">{errorMessage}</p>
        )}
        <p className="text-center text-black mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
