import { sendMail } from './email.js';
import { applyFilter } from './filter.js';
import { saveDbDetails } from './database.js';
import { testApi } from './restApi.js';
import { getRestApiResponse, getFilteredResponse, targetJsonSchema, mappings } from './shared.js';

export function showConfig(iconId) {
    console.log("showConfig called with iconId:", iconId); // Debug log
    const configContent = document.getElementById("configContent");
    configContent.innerHTML = ""; // Clear existing content

    if (iconId === "restApiIcon") {
        configContent.innerHTML = `
            <label for="url">URL:</label><br>
            <input type="text" id="url"><br>
            <label for="method">Method:</label><br>
            <select id="method" onchange="toggleQueryParams(this.value)">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
            </select><br>
            <div id="queryParams" class="hidden">
                <label for="params">Query Parameters:</label><br>
                <input type="text" id="params"><br>
            </div>
            <button id="testApiBtn">TEST</button>
        `;
        document.getElementById('testApiBtn').addEventListener('click', testApi);
    } else if (iconId === "jsonMapperIcon") {
        const restApiResponse = getRestApiResponse();
        if (!restApiResponse) {
            alert('Please test the REST API and store the response first.');
            return;
        }
        configContent.innerHTML = `
            <h4>Source JSON</h4>
            <div id="sourceFields">
                ${generateFieldsHTML(restApiResponse.data[0])}
            </div>
            <h4>Target JSON</h4>
            <div id="targetFields">
                ${Object.keys(targetJsonSchema).map(field => `<div class="json-field" id="target_${field}" ondrop="dropField(event)" ondragover="allowDrop(event)">${field}</div>`).join('')}
            </div>
            <h4>Dynamic Target JSON</h4>
            <pre id="dynamicTargetJson"></pre>
        `;
        updateTargetJson();
    } else if (iconId === "dbConnectorIcon") {
        configContent.innerHTML = `
            <label for="dbUrl">MongoDB URL:</label><br>
            <input type="text" id="dbUrl"><br>
            <label for="dbName">Database Name:</label><br>
            <input type="text" id="dbName"><br>
            <label for="collectionName">Collection Name:</label><br>
            <input type="text" id="collectionName"><br>
            <button id="saveDbDetailsBtn">Save DB Details</button>
        `;
        document.getElementById('saveDbDetailsBtn').addEventListener('click', saveDbDetails);
    } else if (iconId === "filterIcon") {
        const restApiResponse = getRestApiResponse();
        const filteredResponse = getFilteredResponse();
        if (!restApiResponse && !filteredResponse) {
            alert('Please test the REST API and store the response first.');
            return;
        }
        configContent.innerHTML = `
            <label for="filterExpression">Filter Expression:</label><br>
            <input type="text" id="filterExpression" placeholder="e.g., item.age > 30"><br>
            <button id="applyFilterBtn">Apply Filter</button>
        `;
        document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);
    } else if (iconId === "mailIcon") {
        configContent.innerHTML = `
            <label for="from">From:</label><br>
            <input type="text" id="from"><br>
            <label for="to">To:</label><br>
            <input type="text" id="to"><br>
            <label for="subject">Subject:</label><br>
            <input type="text" id="subject"><br>
            <label for="body">Body:</label><br>
            <textarea id="body"></textarea><br>
            <label for="attachment">Attachment:</label><br>
            <input type="file" id="attachment"><br>
            <button id="sendMailBtn">Send Mail</button>
        `;
        document.getElementById('sendMailBtn').addEventListener('click', sendMail);
    } else {
        console.log("No configuration found for iconId:", iconId); // Debug log
    }
}

function toggleQueryParams(method) {
    const queryParamsDiv = document.getElementById("queryParams");
    if (method === "GET") {
        queryParamsDiv.classList.remove("hidden");
    } else {
        queryParamsDiv.classList.add("hidden");
    }
}

export function generateFieldsHTML(json, parentKey = "") {
    let html = "";
    for (const key in json) {
        const fullKey = parentKey ? `${parentKey}_${key}` : key;
        if (typeof json[key] === "object" && json[key] !== null) {
            html += `<div>${key}:</div>`;
            html += `<div style="margin-left: 20px">${generateFieldsHTML(json[key], fullKey)}</div>`;
        } else {
            html += `<div class="json-field" draggable="true" ondragstart="dragField(event)" id="source_${fullKey}">${key}</div>`;
        }
    }
    return html;
}

export function updateTargetJson() {
    const restApiResponse = getRestApiResponse();
    const filteredResponse = getFilteredResponse();

    if (!restApiResponse && !filteredResponse) return;

    const responseData = filteredResponse || restApiResponse.data;

    const getFieldValue = (obj, path) => {
        return path.split('.').reduce((o, p) => {
            return o ? o[p] : undefined;
        }, obj);
    };

    const targetJsonArray = responseData.map(item => {
        const targetItem = {};
        Object.keys(targetJsonSchema).forEach(targetField => {
            const sourceFieldId = mappings[`target_${targetField}`];
            if (sourceFieldId) {
                const sourceFieldPath = sourceFieldId.replace("source_", "").replace(/_/g, "_"); // Adjusted for correct field path
                targetItem[targetField] = getFieldValue(item, sourceFieldPath);
                console.log(`Mapping ${targetField} to ${sourceFieldPath}:`, getFieldValue(item, sourceFieldPath)); // Debug: Log field values
            } else {
                targetItem[targetField] = null; // Not mapped
            }
        });
        return targetItem;
    });

    console.log("Generated Target JSON Array: ", targetJsonArray);
    const dynamicTargetJsonElement = document.getElementById("dynamicTargetJson");
    if (dynamicTargetJsonElement) {
        dynamicTargetJsonElement.innerText = JSON.stringify(targetJsonArray, null, 2);
    } else {
        console.error("Element with ID 'dynamicTargetJson' not found.");
    }
}

export { toggleQueryParams };
