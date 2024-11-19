import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onUpload }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const isLoggedIn = localStorage.getItem('userEmail') !== null;

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <nav className="bg-[#032f3c] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white font-bold">DalDrive24</h1>
        <div className="flex items-center">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleUploadClick}
                className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded mr-4"
              >
                Upload Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Hide the file input
              />
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white px-4">Login</Link>
              <Link to="/signup" className="text-white px-4">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;