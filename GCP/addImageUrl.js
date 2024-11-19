const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const cors = require('cors')({ origin: true });
''
admin.initializeApp();
const db = getFirestore('labactivity2');

const handleCors = (handler) => (req, res) => cors(req, res, () => handler(req, res));

functions.http('addImageUrl', handleCors(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { imageUrl, email } = req.body;

        if (!imageUrl || !email) {
            return res.status(400).json({ message: 'Image URL and email are required' });
        }

        const userDocRef = db.collection('Users').doc(email);

        await userDocRef.update({
            imageUrls: admin.firestore.FieldValue.arrayUnion(imageUrl)
        });

        return res.status(200).json({ message: 'Image URL added successfully' });
    } catch (error) {
        console.error('Error adding image URL:', error);
        return res.status(500).json({ message: 'Error adding image URL', error: error.message });
    }
}));
