require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const upload = multer();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});

app.use(express.static('public'));

// Connection pool to manage multiple MongoDB connections
const connectionPool = {};

async function getDbConnection(dbUrl, dbName) {
    const connectionKey = `${dbUrl}_${dbName}`;
    if (!connectionPool[connectionKey]) {
        const connection = await mongoose.createConnection(`${dbUrl}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        connectionPool[connectionKey] = connection;
    }
    return connectionPool[connectionKey];
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/save', async (req, res) => {
    try {
        const { targetJson, dbDetails } = req.body;
        console.log('Received data for saving:', targetJson, dbDetails);

        const dbConnection = await getDbConnection(dbDetails.dbUrl, dbDetails.dbName);
        const collection = dbConnection.collection(dbDetails.collectionName);
        await collection.insertMany(targetJson);

        res.status(200).send('Target JSON saved to MongoDB');
    } catch (error) {
        console.error('Error saving to MongoDB:', error.message);
        res.status(500).send('Failed to save Target JSON to MongoDB');
    }
});

app.post('/api/sendMail', upload.single('attachment'), async (req, res) => {
    const { from, to, subject, body } = req.body;
    const attachment = req.file;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: body,
        attachments: attachment ? [{
            filename: attachment.originalname,
            content: attachment.buffer
        }] : []
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Mail sent successfully.');
    } catch (error) {
        console.error('Error sending mail:', error);
        res.status(500).send('Failed to send mail.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
