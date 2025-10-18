// Get canvas and context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Get buttons
const clearBtn = document.getElementById('clearBtn');
const drawBtn = document.getElementById('drawBtn');

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize canvas
function init() {
    // Set canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Clear canvas function
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw sample shapes
function drawSample() {
    // Draw a circle
    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    ctx.strokeStyle = '#1E40AF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw a rectangle
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(350, 150, 100, 100);
    ctx.strokeStyle = '#991B1B';
    ctx.strokeRect(350, 150, 100, 100);

    // Draw a line
    ctx.beginPath();
    ctx.moveTo(100, 400);
    ctx.lineTo(400, 500);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw text
    ctx.fillStyle = '#6366F1';
    ctx.font = '30px Arial';
    ctx.fillText('Canvas Drawing!', 500, 400);
}

// Mouse event handlers for drawing
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

// Event listeners
clearBtn.addEventListener('click', clearCanvas);
drawBtn.addEventListener('click', drawSample);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Initialize on load
init();
