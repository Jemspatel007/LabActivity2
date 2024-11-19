const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = getFirestore('labactivity2'); 

const handleCors = (handler) => (req, res) => cors(req, res, () => handler(req, res));

functions.http('getImageUrls', handleCors(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const userDocRef = db.collection('Users').doc(email);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const imageUrls = userDoc.data().imageUrls || [];

        return res.status(200).json({ imageUrls: imageUrls });
    } catch (error) {
        console.error('Error fetching image URLs:', error);
        return res.status(500).json({ message: 'Error fetching image URLs', error: error.message });
    }
}));
