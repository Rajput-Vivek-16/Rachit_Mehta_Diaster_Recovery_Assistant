import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="bg-white flex items-center justify-center min-h-screen">
      <div className="rounded-lg shadow-lg p-8 w-full max-w-md" style={{ backgroundColor: '#e4e4e7' }}>
        <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">Disaster Recovery Assistant</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-black font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:border-red-700"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-black font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:border-red-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-black mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-red-600 hover:underline">
            Sign-up
          </Link>
        </p>
        <p className="text-center text-black mt-4">
          <Link to="/" className="text-red-600 hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
