// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleHeight = 80;
const paddleWidth = 10;
const ballRadius = 8;

let player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6,
    score: 0
};

let player2 = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6,
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    radius: ballRadius,
    speed: 5
};

let gameRunning = false;
let gameStarted = false;

// Keyboard input
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ') {
        e.preventDefault();
        if (!gameStarted) {
            gameRunning = true;
            gameStarted = true;
        } else {
            gameRunning = !gameRunning;
        }
    }

    if (e.key === 'r' || e.key === 'R') {
        resetGame();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game functions
function resetGame() {
    gameRunning = false;
    gameStarted = false;
    player1.score = 0;
    player2.score = 0;
    player1.y = canvas.height / 2 - paddleHeight / 2;
    player2.y = canvas.height / 2 - paddleHeight / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 8;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById('player1Score').textContent = player1.score;
    document.getElementById('player2Score').textContent = player2.score;
}

function updatePaddles() {
    // Player 1 controls (UP/DOWN arrows)
    if (keys['ArrowUp'] && player1.y > 0) {
        player1.y -= player1.speed;
    }
    if (keys['ArrowDown'] && player1.y + player1.height < canvas.height) {
        player1.y += player1.speed;
    }

    // Player 2 controls (UP/DOWN arrows)
    if (keys['ArrowUp'] && player2.y > 0) {
        player2.y -= player2.speed;
    }
    if (keys['ArrowDown'] && player2.y + player2.height < canvas.height) {
        player2.y += player2.speed;
    }
}

function updateBall() {
    if (!gameRunning) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }

    // Paddle collision - Player 1
    if (
        ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height
    ) {
        ball.dx = Math.abs(ball.dx) * 1.05;
        ball.dy += (ball.y - (player1.y + player1.height / 2)) * 0.2;
        ball.x = player1.x + player1.width + ball.radius;
    }

    // Paddle collision - Player 2
    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height
    ) {
        ball.dx = -Math.abs(ball.dx) * 1.05;
        ball.dy += (ball.y - (player2.y + player2.height / 2)) * 0.2;
        ball.x = player2.x - ball.radius;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        player2.score++;
        updateScoreDisplay();
        resetBallPosition();
    }

    if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        updateScoreDisplay();
        resetBallPosition();
    }
}

function resetBallPosition() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 8;
    gameRunning = false;
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawMiddleLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    // Draw middle line
    drawMiddleLine();

    // Draw paddles
    drawRect(player1.x, player1.y, player1.width, player1.height, '#0f0');
    drawRect(player2.x, player2.y, player2.width, player2.height, '#0f0');

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#fff');

    // Draw status text
    ctx.fillStyle = '#0f0';
    ctx.font = '16px Arial';
    if (!gameStarted) {
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to Start', canvas.width / 2, 50);
    } else if (!gameRunning) {
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED - Press SPACE to Resume', canvas.width / 2, 50);
    }
}

function update() {
    updatePaddles();
    updateBall();
    draw();
    requestAnimationFrame(update);
}

// Start the game loop
update();
