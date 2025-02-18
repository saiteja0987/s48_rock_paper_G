const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const shootSound = document.getElementById("shoot-sound");
const winSound = document.getElementById("win-sound");
const gameOverSound = document.getElementById("game-over-sound");

let currentShooterIndex = 202;
const width = 16;
const aliensRemoved = [];
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;
let isGameRunning = false;
let gameEnded = false;

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}
const squares = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41
];

function draw() {
    alienInvaders.forEach((invader, i) => {
        if (!aliensRemoved.includes(i)) {
            squares[invader].classList.add("invader");
        }
    });
}

function remove() {
    alienInvaders.forEach(invader => squares[invader].classList.remove("invader"));
}

draw();
squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
    if (gameEnded) return; // Prevent movement after game ends

    squares[currentShooterIndex].classList.remove("shooter");
    if (e.key === "ArrowLeft" && currentShooterIndex % width !== 0) {
        currentShooterIndex -= 1;
    } else if (e.key === "ArrowRight" && currentShooterIndex % width < width - 1) {
        currentShooterIndex += 1;
    }
    squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && isGoingRight) {
        alienInvaders.forEach((_, i) => alienInvaders[i] += width + 1);
        direction = -1;
        isGoingRight = false;
    }

    if (leftEdge && !isGoingRight) {
        alienInvaders.forEach((_, i) => alienInvaders[i] += width - 1);
        direction = 1;
        isGoingRight = true;
    }

    alienInvaders.forEach((_, i) => alienInvaders[i] += direction);
    draw();

    // Check for game over
    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER";
        if (!gameEnded) {
            gameOverSound.play(); // Play sound only once
            gameEnded = true;
        }
        clearInterval(invadersId);
    }

    // Check for win condition
    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN";
        if (!gameEnded) {
            winSound.play();
            gameEnded = true;
        }
        clearInterval(invadersId);
    }
}

function shoot(e) {
    if (e.key === "ArrowUp" && !gameEnded) {
        shootSound.play();

        let laserId;
        let currentLaserIndex = currentShooterIndex;

        function moveLaser() {
            squares[currentLaserIndex].classList.remove("laser");
            currentLaserIndex -= width;
            if (currentLaserIndex >= 0) squares[currentLaserIndex].classList.add("laser");

            if (squares[currentLaserIndex] && squares[currentLaserIndex].classList.contains("invader")) {
                squares[currentLaserIndex].classList.remove("laser", "invader");
                squares[currentLaserIndex].classList.add("boom");

                setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);
                clearInterval(laserId);

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienRemoved);
                results++;
                resultDisplay.innerHTML = results; // Update score
            }
        }
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener("keydown", shoot);

startBtn.addEventListener("click", () => {
    if (!isGameRunning && !gameEnded) {
        invadersId = setInterval(moveInvaders, 600);
        isGameRunning = true;
    }
});

pauseBtn.addEventListener("click", () => {
    clearInterval(invadersId);
    isGameRunning = false;
});
