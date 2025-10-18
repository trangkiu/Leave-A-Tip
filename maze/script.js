// Get canvas and context
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const payNowBtn = document.getElementById('payNowBtn');

// open Modal 
var payModal = document.getElementById("payModal");
var span = document.getElementsByClassName("close")[0];


const ROWS = 40;
const COLS = 40;
const CELL_SIZE = 20;
canvas.width = ROWS * CELL_SIZE;
canvas.height = COLS * CELL_SIZE;

const WALL_COLOR = "black";
const PATH_COLOR = "white";
const KEY_COLOR = "orange";
const ENTRY_COLOR = "white";
const EXIT_COLOR = "black";
const PLAYER_COLOR = "blue";

let maze = Array(ROWS).fill().map(() => Array(ROWS).fill(1));

// Entry and exit points
let entry = { row: 1, col: 0 };
let exit = { row: ROWS - 2, col: COLS - 1 };

// skip button 
const skipBtn = document.getElementById('skipBtn');
isSkipBtnClick = false;
let skipBtnCol;
let skipBtnRow;
// Player object
let player = {
    row: 1,
    col: 0,
    speed: 2
};

// Key object
let key = {
    row: 0,
    col: 0,
    collected: false
};


// Initialize canvas
function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.fillStyle = maze[row][col] == 1 ? WALL_COLOR : PATH_COLOR;
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        }

    }

    // Draw entry point
    ctx.fillStyle = ENTRY_COLOR;
    ctx.fillRect(entry.col * CELL_SIZE, entry.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Draw exit point
    ctx.fillStyle = EXIT_COLOR;
    ctx.fillRect(exit.col * CELL_SIZE, exit.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Draw key if not collected
    // if (!key.collected) {
    //     drawKey(key.row, key.col);
    // }

    // Draw player
    drawPlayer(player.row, player.col);


}

// Draw pixel Mario-like figure
function drawPlayer(row, col) {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;
    const pixelSize = CELL_SIZE / 11; // Divide cell into 11x11 grid for detailed pixel art

    // Mario-like pixel pattern (11x11 grid)
    // 0 = transparent, 1 = red (hat/shirt), 2 = skin, 3 = blue (overalls), 4 = brown (shoes)
    const playerPattern = [
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],  // hat
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],  // hat
        [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],  // face
        [0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],  // face
        [0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],  // face/mustache
        [0, 0, 1, 1, 3, 3, 3, 1, 1, 0, 0],  // shirt/overalls
        [0, 1, 1, 1, 3, 3, 3, 1, 1, 1, 0],  // shirt/overalls
        [0, 2, 1, 3, 3, 3, 3, 3, 1, 2, 0],  // body/arms
        [0, 0, 2, 3, 3, 3, 3, 3, 2, 0, 0],  // body
        [0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0],  // legs
        [0, 0, 4, 4, 4, 0, 4, 4, 4, 0, 0]   // shoes
    ];

    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if (playerPattern[i][j] !== 0) {
                // Color mapping: 1=red, 2=skin, 3=blue, 4=brown
                switch (playerPattern[i][j]) {
                    case 1:
                        ctx.fillStyle = '#E60012'; // Red (hat/shirt)
                        break;
                    case 2:
                        ctx.fillStyle = '#FFD700'; // Skin tone
                        break;
                    case 3:
                        ctx.fillStyle = '#0066CC'; // Blue (overalls)
                        break;
                    case 4:
                        ctx.fillStyle = '#8B4513'; // Brown (shoes)
                        break;
                }
                ctx.fillRect(
                    x + j * pixelSize,
                    y + i * pixelSize,
                    pixelSize,
                    pixelSize
                );
            }
        }
    }
}

// Draw pixel key figure
function drawKey(row, col) {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;
    const pixelSize = CELL_SIZE / 7; // Divide cell into 7x7 grid for bigger pixel art

    // Pixel pattern for a key (7x7 grid - bigger design)
    const keyPattern = [
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0]
    ];

    ctx.fillStyle = KEY_COLOR;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if (keyPattern[i][j] === 1) {
                ctx.fillRect(
                    x + j * pixelSize,
                    y + i * pixelSize,
                    pixelSize,
                    pixelSize
                );
            }
        }
    }
}

function generateMaze() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            maze[row][col] = 1;

        }
    }



    const startRow = 1;
    const startCol = 1;
    maze[startRow][startCol] = 0;
    // we need to see what are the adjuncion block that can be white
    paveTheWay(startRow, startCol);

    // Create entry and exit openings
    maze[entry.row][entry.col] = 0;
    maze[exit.row][exit.col] = 0;

    // Reset player position to entry
    player.row = entry.row;
    player.col = entry.col;

    // Place key at a random path location
    // placeKey();

    // Place skip button at a random path location
    placeSkipButton();
}

function placeKey() {
    let pathCells = [];
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 0) {
                pathCells.push({ row, col });
            }
        }
    }

    if (pathCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * pathCells.length);
        key.row = pathCells[randomIndex].row;
        key.col = pathCells[randomIndex].col;
        key.collected = false;
    }
}

function placeSkipButton() {
    let pathCells = [];
    // Only collect white cells (path cells where maze value is 0)
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 0 &&
                !(row === player.row && col === player.col) &&
                !(row === key.row && col === key.col)) {
                pathCells.push({ row, col });
            }
        }
    }

    if (pathCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * pathCells.length);
        const skipPosition = pathCells[randomIndex];

        // Position the skip button at the random white cell with padding
        const padding = 3; // Add padding to keep button within cell bounds
        skipBtn.style.left = `${skipPosition.col * CELL_SIZE + padding}px`;
        skipBtn.style.top = `${skipPosition.row * CELL_SIZE + padding}px`;
        skipBtnCol = skipPosition.col;

        skipBtnRow = skipPosition.row;
        console.log("skipBtnCol ", skipBtnCol, " skipBtnRow ", skipBtnRow);
    }
}

function paveTheWay(r, c) {
    // check 4 direction 
    const dir = [
        [-2, 0], // left
        [2, 0], // right
        [0, 2], // down
        [0, -2] // up
    ];
    // we will shuffer the direction
    dir.sort(() => Math.random() - 0.5);
    for (let [dr, dc] of dir) {
        const newR = r + dr;
        const newC = c + dc;

        if (newR > 0 && newR < ROWS - 1 && newC > 0 && newC < COLS - 1 && maze[newR][newC]) {
            maze[newR][newC] = 0;
            maze[r + dr / 2][c + dc / 2] = 0;
            paveTheWay(newR, newC);
        }
    }

}
// Initialize on load

generateMaze();
init();



// WASD key controls for player movement
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    let newRow = player.row;
    let newCol = player.col;



    if (key === 'w') {
        newRow = player.row - 1; // Move up
    } else if (key === 'a') {
        newCol = player.col - 1; // Move left
    } else if (key === 's') {
        newRow = player.row + 1; // Move down
    } else if (key === 'd') {
        newCol = player.col + 1; // Move right
    } else {
        return; // If not WASD, do nothing
    }

    // Check if new position is valid (within bounds and not a wall)
    if (newRow >= 0 && newRow < ROWS &&
        newCol >= 0 && newCol < COLS &&
        maze[newRow][newCol] === 0) {

        // Clear old player cell
        const oldX = player.col * CELL_SIZE;
        const oldY = player.row * CELL_SIZE;
        ctx.fillStyle = maze[player.row][player.col] === 1 ? WALL_COLOR : PATH_COLOR;
        ctx.fillRect(oldX, oldY, CELL_SIZE, CELL_SIZE);

        // Redraw key if it was at the old position and not collected
        if (player.row === key.row && player.col === key.col && !key.collected) {
            drawKey(key.row, key.col);
        }

        // Update player position
        player.row = newRow;
        player.col = newCol;

        // Check if player press the button
        if (player.row === skipBtnRow && player.col === skipBtnCol && !isSkipBtnClick) {
            isSkipBtnClick = true;
            console.log("isSkipBtnClick");
            currentProgress = 0;
            openModal();
        }


        // Draw player at new position
        drawPlayer(player.row, player.col);
    }
});

// Slider
var tipAmount = 0;
var bill = 300;
var currentProgress = 0;
const tipPercentage = document.getElementById('tipPercentage');
const myBar = document.getElementById("myBar");
const interval = setInterval(updateTip, 1000);

function updateTip() {
    if (currentProgress < 100) {
        currentProgress += 1; // Increase by 5% each second
        myBar.style.width = currentProgress + '%';
        tipPercentage.textContent = currentProgress + '%';
    } else {
        openModal();
    }
}

payNowBtn.addEventListener("click", () => {
    openModal();
});



function openModal() {
    clearInterval(interval);

    // Calculate total bill = bill + (bill * percentage / 100)
    const tipPercentageValue = currentProgress;
    const tipAmountValue = bill * (tipPercentageValue / 100);
    const totalBillValue = bill + tipAmountValue;

    // Update the breakdown section
    document.getElementById('originalBill').textContent = '$' + bill.toFixed(2);
    document.getElementById('tipPercent').textContent = tipPercentageValue;
    document.getElementById('tipAmount').textContent = '$' + tipAmountValue.toFixed(2);

    // Update the modal with the total bill
    document.getElementById('totalBill').textContent = '$' + totalBillValue.toFixed(2);

    payModal.style.display = "block";
}



span.onclick = function () {
    payModal.style.display = "none";
}