// shared.js
let currentDraggable = null;
let restApiResponse = null;
let filteredResponse = null;
let dbDetails = null;
export const droppedElements = [];
export const targetJsonSchema = {
    "Eid": 1,
    "name": "Tiger Nixon",
    "salary": 320800,
    "age": 61
};
export const mappings = {};

export function getCurrentDraggable() {
    return currentDraggable;
}

export function setCurrentDraggable(draggable) {
    currentDraggable = draggable;
}

export function getRestApiResponse() {
    return restApiResponse;
}

export function setRestApiResponse(response) {
    restApiResponse = response;
}

export function getFilteredResponse() {
    return filteredResponse;
}

export function setFilteredResponse(response) {
    filteredResponse = response;
}

export function getDbDetails() {
    return dbDetails;
}

export function setDbDetails(details) {
    dbDetails = details;
}
