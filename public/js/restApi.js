import { setRestApiResponse } from './shared.js';

export async function testApi() {
    const url = document.getElementById("url").value;
    const method = document.getElementById("method").value;
    const params = document.getElementById("params").value;

    let response;
    if (method === "GET") {
        const query = params ? `?${params}` : '';
        response = await fetch(url + query, {
            method: 'GET',
        });
    } else {
        response = await fetch(url, {
            method,
        });
    }

    if (response.ok) {
        const apiResponse = await response.json();
        console.log("REST API Response: ", apiResponse);  // Debug: Log the response
        if (!Array.isArray(apiResponse.data)) {
            apiResponse.data = [apiResponse.data];
        }
        setRestApiResponse(apiResponse);
        alert('API Test successful. Response stored.');
    } else {
        alert('API Test failed.');
    }
}
