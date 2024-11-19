const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = getFirestore('labactivity2');

const handleCors = (handler) => (req, res) => cors(req, res, () => handler(req, res));

functions.http('login', handleCors(async (req, res) => {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const userDoc = await db.collection('Users').doc(email).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();

        if (userData.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({ message: 'Login successful', user: { name: userData.name, email: userData.email } });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
}));
