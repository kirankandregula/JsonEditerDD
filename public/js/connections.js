import { droppedElements } from './shared.js';

export function drawConnections() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const workflow = document.getElementById("workflow");
    canvas.width = workflow.clientWidth;
    canvas.height = workflow.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < droppedElements.length - 1; i++) {
        const sourceElem = droppedElements[i];
        const targetElem = droppedElements[i + 1];

        const sourceRect = sourceElem.getBoundingClientRect();
        const targetRect = targetElem.getBoundingClientRect();

        const startX = sourceRect.left + sourceRect.width / 2 - workflow.getBoundingClientRect().left;
        const startY = sourceRect.top + sourceRect.height / 2 - workflow.getBoundingClientRect().top;
        const endX = targetRect.left + targetRect.width / 2 - workflow.getBoundingClientRect().left;
        const endY = targetRect.top + targetRect.height / 2 - workflow.getBoundingClientRect().top;

        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}
