import { getCurrentDraggable, setCurrentDraggable, droppedElements, mappings } from './shared.js';
import { showConfig, updateTargetJson } from './configuration.js';
import { drawConnections } from './connections.js';

export function allowDrop(event) {
    event.preventDefault();
}

export function drag(event) {
    setCurrentDraggable(event.target.closest(".icon"));
    console.log("Dragging:", getCurrentDraggable().id);
}

export function drop(event) {
    event.preventDefault();
    const currentDraggable = getCurrentDraggable();
    if (!currentDraggable) return; // Ensure currentDraggable is not null
    const iconId = currentDraggable.id;
    console.log("Dropping:", iconId);
    const icon = currentDraggable.cloneNode(true);
    icon.removeAttribute("id");
    icon.setAttribute("draggable", "false");
    icon.style.position = "absolute";
    icon.style.left = `${event.clientX - event.target.getBoundingClientRect().left}px`;
    icon.style.top = `${event.clientY - event.target.getBoundingClientRect().top}px`;
    icon.onclick = () => showConfig(iconId);

    const workflow = document.getElementById("workflow");
    workflow.appendChild(icon);

    droppedElements.push(icon);
    drawConnections();
    showConfig(iconId);
}

export function dragField(event) {
    event.dataTransfer.setData("text", event.target.id);
}

export function dropField(event) {
    event.preventDefault();
    const sourceFieldId = event.dataTransfer.getData("text");
    const targetFieldId = event.target.id;

    mappings[targetFieldId] = sourceFieldId;

    event.target.innerHTML = `${event.target.innerText} ← ${document.getElementById(sourceFieldId).innerText}`;
    console.log("Mappings: ", mappings);  // Debug: Log mappings
    updateTargetJson();
}
