import { getRestApiResponse, setFilteredResponse } from './shared.js';
import { updateTargetJson } from './configuration.js';

export function applyFilter() {
    const expression = document.getElementById("filterExpression").value;
    if (!expression) {
        alert("Please provide a filter expression.");
        return;
    }

    try {
        const restApiResponse = getRestApiResponse();
        console.log("Applying filter on restApiResponse.data:", restApiResponse.data);
        
        if (!Array.isArray(restApiResponse.data)) {
            console.error("restApiResponse.data is not an array:", restApiResponse.data);
            alert("Unexpected data structure. Please check the API response.");
            return;
        }
        
        const filteredResponse = restApiResponse.data.filter(item => {
            console.log("Item being evaluated:", item); // Log each item being evaluated
            return eval(expression);
        });
        
        console.log("Filtered Response: ", filteredResponse);  // Debug: Log the filtered response

        setFilteredResponse(filteredResponse);

        const dynamicTargetJsonElement = document.getElementById("dynamicTargetJson");
        if (dynamicTargetJsonElement) {
            dynamicTargetJsonElement.innerText = JSON.stringify(filteredResponse, null, 2);
        } else {
            console.error("Element with ID 'dynamicTargetJson' not found.");
        }

        alert('Filter applied successfully.');
    } catch (error) {
        console.error("Error applying filter: ", error);  // Debug: Log the error
        alert('Error applying filter. Please check the expression.');
    }
}
