const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const hitSound = document.getElementById('hitSound');
const winSound = document.getElementById('winSound');
const loseSound = document.getElementById('loseSound');

const blockWidth = 100, blockHeight = 20, ballDiameter = 20;
const boardWidth = 560, boardHeight = 300;
let xDirection = -2, yDirection = 2;
let score = 0;

// User & Ball Start Positions
const userStart = [230, 10];
let currentPosition = [...userStart];
const ballStart = [270, 40];
let ballCurrentPosition = [...ballStart];

let timerId;

// Block Class
class Block {
    constructor(x, y) {
        this.bottomLeft = [x, y];
        this.bottomRight = [x + blockWidth, y];
        this.topRight = [x + blockWidth, y + blockHeight];
        this.topLeft = [x, y + blockHeight];
    }
}

// Create Blocks
const blocks = [];
for (let y = 270; y >= 210; y -= 30) {
    for (let x = 10; x <= 450; x += 110) {
        blocks.push(new Block(x, y));
    }
}

// Draw Blocks
function addBlocks() {
    blocks.forEach(block => {
        const div = document.createElement('div');
        div.classList.add('block');
        div.style.left = `${block.bottomLeft[0]}px`;
        div.style.bottom = `${block.bottomLeft[1]}px`;
        grid.appendChild(div);
    });
}

// Draw User
function drawUser() {
    user.style.left = `${currentPosition[0]}px`;
    user.style.bottom = `${currentPosition[1]}px`;
}

// Draw Ball
function drawBall() {
    ball.style.left = `${ballCurrentPosition[0]}px`;
    ball.style.bottom = `${ballCurrentPosition[1]}px`;
}

// Move User
function moveUser(e) {
    if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
        currentPosition[0] -= 10;
    } else if (e.key === 'ArrowRight' && currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
    }
    drawUser();
}

// Move Ball
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}

// Check for Collisions
function checkForCollisions() {
    // Block Collision
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (
            ballCurrentPosition[0] > block.bottomLeft[0] &&
            ballCurrentPosition[0] < block.bottomRight[0] &&
            ballCurrentPosition[1] + ballDiameter > block.bottomLeft[1] &&
            ballCurrentPosition[1] < block.topLeft[1]
        ) {
            document.querySelectorAll('.block')[i].remove();
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.innerText = `Score: ${score}`;
            hitSound.play();
            
            if (blocks.length === 0) {
                winGame();
            }
        }
    }

    // Wall Collision
    if (ballCurrentPosition[0] >= boardWidth - ballDiameter || ballCurrentPosition[0] <= 0) {
        xDirection *= -1;
    }
    if (ballCurrentPosition[1] >= boardHeight - ballDiameter) {
        yDirection *= -1;
    }

    // User Collision
    if (
        ballCurrentPosition[0] > currentPosition[0] &&
        ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
        ballCurrentPosition[1] > currentPosition[1] &&
        ballCurrentPosition[1] < currentPosition[1] + blockHeight
    ) {
        yDirection *= -1;
    }

    // Game Over
    if (ballCurrentPosition[1] <= 0) {
        loseGame();
    }
}

// Change Ball Direction
function changeDirection() {
    yDirection *= -1;
}

// Game Over
function loseGame() {
    clearInterval(timerId);
    scoreDisplay.innerText = 'Game Over!';
    loseSound.play();
    document.removeEventListener('keydown', moveUser);
}

// Win Game
function winGame() {
    clearInterval(timerId);
    scoreDisplay.innerText = 'You Win!';
    winSound.play();
    document.removeEventListener('keydown', moveUser);
}

// Initialize Game
addBlocks();

// Add User
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

// Add Ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();

// Event Listeners
document.addEventListener('keydown', moveUser);
timerId = setInterval(moveBall, 30);
