const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = getFirestore('labactivity2');

const handleCors = (handler) => (req, res) => cors(req, res, () => handler(req, res));

functions.http('register', handleCors(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        const userDoc = await db.collection('Users').doc(email).get();
        if (userDoc.exists) {
            return res.status(409).json({ message: 'Email is already registered. Please use a different email.' });
        }

        await db.collection('Users').doc(email).set({
            name: name,
            password: password,
            imageUrls: []
        });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}));