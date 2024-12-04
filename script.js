const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let ballX, ballY, ballRadius, lineEndX, speed;
let gameRunning = false;
let difficulty = 'easy';

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    lineEndX = canvas.width / 2;
}

let unlockedLevels = ['easy'];
let currentDifficulty = 'easy';
function init() {
    setCanvasSize();
    ballRadius = 50;
    ballX = -ballRadius;
    ballY = canvas.height / 2 - 50;
    gameRunning = true;
    setSpeed();
    updateDifficultyButtons();
}

function updateDifficultyButtons() {
    document.getElementById('easy').disabled = false;
    document.getElementById('medium').disabled = !unlockedLevels.includes('medium');
    document.getElementById('hard').disabled = !unlockedLevels.includes('hard');
}

function setSpeed() {
    switch(currentDifficulty) {
        case 'easy': speed = 2; break;
        case 'medium': speed = 10; break;
        case 'hard': speed = 1; break;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(lineEndX, canvas.height / 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw ball
    ctx.beginPath();
    ctx.rect(ballX, ballY, ballRadius, ballRadius);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function update() {
    if (!gameRunning) return;

    if (difficulty === 'hard') {
        if (ballX < lineEndX / 2) {
            ballX += 1;
        } else if (ballX < lineEndX * 0.75){
            ballX += 1/2;
        } else if (ballX < lineEndX * 0.875) {
            ballX += 1/4;
        } else if (ballX < lineEndX * 0.9375) {
            ballX += 1/8;
        } else if (ballX < lineEndX * 0.96875) {
            ballX += 1/16;
        } else {
            ballX += 1/128
        }
    } else {
        ballX += speed;
    }

    if (ballX > lineEndX) {
        gameRunning = false;
        animateFall();
    } else {
        draw();
        requestAnimationFrame(update);
    }
}

function animateFall() {
    let fallSpeed = 0;
    const gravity = 0.8;

    currentDifficulty = "easy";
    difficulty = "easy";
    unlockedLevels = ['easy'];
    updateDifficultyButtons()

    function fall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();

        ballY += fallSpeed;
        fallSpeed += gravity;

        if (ballY < canvas.height + ballRadius && !gameRunning) {
            ctx.beginPath();
            ctx.rect(ballX, ballY, ballRadius, ballRadius);
            ctx.fillStyle = 'black';
            ctx.fill();
            requestAnimationFrame(fall);
        } else {
            ballX = 0;
            ballY = canvas.height / 2 - 50;
        }
    }

    scoreDisplay.textContent = `Score: 0`;
    scoreDisplay.style.display = 'block';

    fall();
}

function resetGame() {
    ballX = 0;
    ballY = canvas.height / 2 - 50;
    gameRunning = true;
    init();
    update();
}

canvas.addEventListener('click', (e) => {
    if (!gameRunning) {
        resetGame();
        return;
    }

    const distance = lineEndX - ballX;
    const score = Math.round((1 - distance / lineEndX) * 100);

    scoreDisplay.textContent = `Score: ${score}`;
    scoreDisplay.style.display = 'block';

    if (score > 80) {
        unlockNextLevel();
    }
    gameRunning = false;
});

function unlockNextLevel() {
    if (currentDifficulty === 'easy' && !unlockedLevels.includes('medium')) {
        unlockedLevels.push('medium');
        currentDifficulty = 'medium';
        difficulty = 'medium';
    } else if (currentDifficulty === 'medium' && !unlockedLevels.includes('hard')) {
        unlockedLevels.push('hard');
        currentDifficulty = 'hard';
        difficulty = 'hard';
    }
    updateDifficultyButtons();
}

document.getElementById('easy').addEventListener('click', () => {
    currentDifficulty = 'easy';
    difficulty = 'easy';
    resetGame();
    update();
});

document.getElementById('medium').addEventListener('click', () => {
    if (unlockedLevels.includes('medium')) {
        currentDifficulty = 'medium';
        difficulty = 'medium';
        resetGame();
        update();
    }
});

document.getElementById('hard').addEventListener('click', () => {
    if (unlockedLevels.includes('hard')) {
        currentDifficulty = 'hard';
        difficulty = 'hard';
        resetGame();
        update();
    }
});

window.addEventListener('resize', setCanvasSize);

init();
update();