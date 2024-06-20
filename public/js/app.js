import { allowDrop, drag, drop, dragField, dropField } from './dragDrop.js';
import { showConfig } from './configuration.js';
import { drawConnections } from './connections.js';

document.addEventListener('DOMContentLoaded', () => {
    const workflow = document.getElementById("workflow");
    workflow.addEventListener('dragover', allowDrop);
    workflow.addEventListener('drop', drop);

    // Event listeners for showing configuration when icon is clicked
    workflow.addEventListener('click', event => {
        const icon = event.target.closest('.icon');
        if (icon) {
            const iconId = icon.getAttribute('data-id');
            showConfig(iconId);
        }
    });

    drawConnections();
});
