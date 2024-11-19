import React, { useState, useEffect } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";

const Dashboard = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://us-central1-serverless-440117.cloudfunctions.net/getImages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        const imageUrls = data.imageUrls
        setImageUrls(imageUrls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    };

    fetchImages();
  }, [email]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-12">Relive and Download Your Favorite Moments!!</h1>

      {loading && <p>Loading images...</p>}

      {!loading && imageUrls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative w-full h-64 overflow-hidden rounded-lg shadow-md">
              {/* Display the image */}
              <img
                src={url}
                alt="User's file"
                className="w-full h-full object-cover"
              />
              {/* Download icon positioned on top of the image */}
              <a
                href={url}
                download
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg"
                title="Download Image"
              >
                <MdOutlineFileDownload className="text-blue-500 text-xl" /> {/* The download icon */}
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && imageUrls.length === 0 && <p>No images found for this user.</p>}
    </div>
  );
};

export default Dashboard;