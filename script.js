const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const GRAVITY = 0.5;
const FLAP = -8;
const SPAWN_RATE = 90;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 150;

// Bird settings
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdWidth = 20;
let birdHeight = 20;

// Pipe settings
let pipes = [];
let frame = 0;

// Event listener for bird flapping
document.addEventListener("keydown", flap);

// Game loop
function gameLoop() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    birdVelocity += GRAVITY;
    birdY += birdVelocity;
    ctx.fillStyle = "yellow";
    ctx.fillRect(50, birdY, birdWidth, birdHeight);

    // Draw pipes
    if (frame % SPAWN_RATE === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - PIPE_SPACING));
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
            bottom: pipeHeight + PIPE_SPACING
        });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 2;

        // Draw top pipe
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);

        // Draw bottom pipe
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);

        // Remove pipes that go off-screen
        if (pipe.x + PIPE_WIDTH < 0) {
            pipes.splice(index, 1);
        }

        // Collision detection
        if (50 + birdWidth > pipe.x && 50 < pipe.x + PIPE_WIDTH && (birdY < pipe.top || birdY + birdHeight > pipe.bottom)) {
            gameOver();
        }
    });

    // Ground collision
    if (birdY + birdHeight >= canvas.height) {
        gameOver();
    }

    // Bird cannot go off the top
    if (birdY < 0) {
        birdY = 0;
        birdVelocity = 0;
    }

    // Score and update
    requestAnimationFrame(gameLoop);
}

// Flap the bird
function flap(event) {
    if (event.keyCode === 32) {
        birdVelocity = FLAP;
    }
}

// Game Over
function gameOver() {
    alert("Game Over!");
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    frame = 0;
}

// Start game loop
gameLoop();
