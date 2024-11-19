import React from 'react';
import backgroundImage from "../assets/1.png";
const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="text-white text-center p-8">
          <h1 className="text-5xl font-bold mb-4">Welcome to DalDrive24 Photo Gallery</h1>
          <p className="mb-6">Capture and cherish your beautiful moments in one place.</p>
          <a href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;