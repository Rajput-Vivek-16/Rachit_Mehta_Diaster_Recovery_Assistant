import React from 'react';
import { Link } from 'react-router-dom';
function HeroSection() {
  return (
    <div className="relative h-[85vh] bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url('https://searchengineland.com/wp-content/seloads/2024/05/How-to-avoid-an-SEO-disaster-during-a-website-redesign-A-comprehensive-guide.png')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to <p className='text-red-500 inline'>Disaster Nexus</p></h1>
          <p className="text-xl mb-6">Your real-time crisis communication platform</p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup" className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition transform hover:scale-105">
              Get Started
            </Link>
            <Link to="/accessibility-feature" className="px-6 py-2 border border-white text-white rounded hover:bg-white hover:text-black transition transform hover:scale-105">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
