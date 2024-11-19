import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Navbar from './components/navbar';
import Dashboard from './components/dashboard';
import HomePage  from './components/homepage';
import { toast, ToastContainer } from 'react-toastify'; 

function App() {
  const handleImageUpload = async (file) => {
    const email = localStorage.getItem('userEmail');

    const reader = new FileReader();
    
    reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];

        try {
            const response = await fetch('https://us-central1-serverless-440117.cloudfunctions.net/uploadImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  file: base64String,   
                  email: email   
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Image Uploaded successfully!");
                console.log('Image uploaded successfully:', data);
                const imageUrl = data.url;

                const secondResponse = await fetch('https://us-central1-serverless-440117.cloudfunctions.net/saveUrls', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      email: email,
                      imageUrl: imageUrl,
                  }),
              });

              if (secondResponse.ok) {
                toast.success("Image Uploaded successfully!");
                console.log('Second API call successful');
            } else {
                console.error('Second API call failed:', secondResponse.statusText);
            }
            } else {
                console.error('Image upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during image upload:', error);
        }
    };

    reader.readAsDataURL(file);
};


  return (
    <Router>
      <div>
        <Navbar onUpload={handleImageUpload} /> {}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;