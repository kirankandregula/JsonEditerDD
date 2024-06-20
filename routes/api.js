const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Save Target JSON to MongoDB
router.post('/save', async (req, res) => {
    const { targetJson, dbDetails } = req.body;
    const { dbUrl, dbName, collectionName } = dbDetails;

    try {
        console.log("Connecting to MongoDB with details: ", dbDetails);  // Debug: Log connection details

        // Connect to the specific MongoDB database and collection
        const dbConnection = mongoose.createConnection(`${dbUrl}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        dbConnection.on('error', (err) => {
            console.error("MongoDB connection error: ", err);  // Debug: Log connection error
            res.status(500).send('Error connecting to MongoDB');
        });

        dbConnection.once('open', async () => {
            console.log("MongoDB connection established");  // Debug: Log connection success

            const TargetJsonSchema = new mongoose.Schema({
                json: { type: Object, required: true }
            });

            const TargetJson = dbConnection.model(collectionName, TargetJsonSchema);

            try {
                const newTargetJson = new TargetJson({ json: targetJson });
                await newTargetJson.save();
                console.log("Target JSON saved successfully");  // Debug: Log save success
                res.status(200).send('Target JSON saved to MongoDB');
            } catch (saveError) {
                console.error("Error saving Target JSON: ", saveError);  // Debug: Log save error
                res.status(500).send('Error saving Target JSON');
            } finally {
                dbConnection.close();
            }
        });
    } catch (error) {
        console.error("Unexpected error: ", error);  // Debug: Log unexpected error
        res.status(500).send('Unexpected error occurred');
    }
});

module.exports = router;
