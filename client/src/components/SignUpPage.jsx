import React from 'react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div style={{ backgroundColor: '#e4e4e7' }} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">Create an Account</h2>
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
          <div className="mb-4">
            <label htmlFor="email" className="block text-black font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
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
          <div className="mb-4">
            <label htmlFor="country" className="block text-black font-medium mb-2">Country</label>
            <input
              type="text"
              id="country"
              placeholder="Enter your username"
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
