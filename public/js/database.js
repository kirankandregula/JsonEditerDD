import { getDbDetails, setDbDetails, targetJsonSchema, getFilteredResponse, getRestApiResponse } from './shared.js';
import { updateTargetJson } from './configuration.js';

export function saveDbDetails() {
    console.log("saveDbDetails called");  // Debug: Log function call

    const dbUrl = document.getElementById("dbUrl").value;
    const dbName = document.getElementById("dbName").value;
    const collectionName = document.getElementById("collectionName").value;

    const dbDetails = { dbUrl, dbName, collectionName };
    setDbDetails(dbDetails);
    console.log("DB Details Saved: ", dbDetails);  // Debug: Log DB details

    // Ensure the target JSON is updated
    updateTargetJson();

    // Automatically save the target JSON to MongoDB after DB details are saved
    saveToMongoDB();
}

export async function saveToMongoDB() {
    const dbDetails = getDbDetails();
    if (!dbDetails) {
        alert('Please provide DB details first.');
        return;
    }

    console.log("saveToMongoDB called");  // Debug: Log function call

    const dynamicTargetJsonElement = document.getElementById("dynamicTargetJson");
    if (!dynamicTargetJsonElement) {
        alert('Target JSON element not found.');
        return;
    }

    const targetJson = JSON.parse(dynamicTargetJsonElement.innerText);
    console.log("Saving to MongoDB with details: ", dbDetails);  // Debug: Log saving process

    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ targetJson, dbDetails })
        });

        console.log("Response from /api/save: ", response);  // Debug: Log the response

        if (response.ok) {
            alert('Target JSON saved to MongoDB');
        } else {
            const errorText = await response.text();
            console.error("Error saving Target JSON: ", errorText);  // Debug: Log the error
            alert('Failed to save Target JSON to MongoDB');
        }
    } catch (error) {
        console.error("Error during fetch: ", error);  // Debug: Log the error
        alert('Failed to save Target JSON to MongoDB');
    }
}
