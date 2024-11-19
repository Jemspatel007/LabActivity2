const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid'); 
const cors = require('cors')({ origin: true });

const storage = new Storage();

const BUCKET_NAME = 'daldrive';

const handleCors = (handler) => (req, res) => cors(req, res, () => handler(req, res));

functions.http('upload', handleCors(async (req, res) => {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { file, email } = req.body;
        if (!file || !email) {
            return res.status(400).json({ message: 'File and email are required' });
        }

        const fileBuffer = Buffer.from(file, 'base64');
        
        const fileName = `${email}/${uuidv4()}.jpg`;

        const bucket = storage.bucket(BUCKET_NAME);
        const fileUpload = bucket.file(fileName);

        await fileUpload.save(fileBuffer, {
            metadata: {
                contentType: 'image/jpeg',
            }
        });

        await fileUpload.makePublic();

        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;

        return res.status(200).json({ message: 'Image uploaded successfully', url: publicUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
}));