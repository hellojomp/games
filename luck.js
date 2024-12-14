const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const difficultyElement = document.getElementById('difficulty');
const timerElement = document.getElementById('timer');
const clicksElement = document.getElementById('clicks');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let difficulty = 'EASY';
let startTime;
let clicks = 0;
let obj = {};

function startGame() {
    startTime = new Date();
    clicks = 0;
    updateClicksDisplay();
    setDifficulty(difficulty);
    drawGame();
    requestAnimationFrame(updateTimer);
}

function setDifficulty(newDifficulty) {
    difficulty = newDifficulty;
    difficultyElement.textContent = `DIFFICULTY: ${difficulty}`;
    obj = {...obj, ...getRandomPosition(), size: getSizeFromDifficulty(newDifficulty) };

}

function getSizeFromDifficulty(difficulty) {
    if (difficulty === 'EASY') {
        return 5;
    } else if (difficulty === 'MEDIUM') {
        return 10;
    } else if (difficulty === 'HARD') {
        return 1;
    }
}

function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height)
    };
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (difficulty === 'EASY') {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
    } else if (difficulty === 'MEDIUM') {
        drawClovers();
    } else if (difficulty === 'HARD') {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
    }
}

function drawClovers() {
    // This is a simplified version. In a real game, you'd want to use actual clover images.
    for (let i = 0; i < 10000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        drawThreeLeafClover(x, y);
    }
    drawFourLeafClover(obj.x, obj.y);
}

function drawThreeLeafClover(x, y) {
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.arc(x + 10, y, 10, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 10, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
}

function drawFourLeafClover(x, y) {
    const leafRadius = 8;
    const offset = 7;

    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;

    // Draw four distinct leaves
    for (let i of [0, 1, 3, 2]) {
        ctx.beginPath();
        const angle = (Math.PI / 2) * i;
        const leafX = x + Math.cos(angle) * offset;
        const leafY = y + Math.sin(angle) * offset;
        ctx.arc(leafX, leafY, leafRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    // Add a stem
    ctx.beginPath();
    ctx.moveTo(x, y + offset + leafRadius);
    ctx.lineTo(x, y + offset + leafRadius + 10);
    ctx.stroke();

    // Add a small red circle in the center to distinguish it
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = new Date(currentTime - startTime);
    const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
    timerElement.textContent = `${minutes}:${seconds}`;
    requestAnimationFrame(updateTimer);
}

function updateClicksDisplay() {
    clicksElement.textContent = `Clicks: ${clicks}`;
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    clicks++;
    updateClicksDisplay();

    if (Math.abs(x - obj.x) <= obj.size && Math.abs(y - obj.y) <= obj.size) {
        if (difficulty === 'EASY') {
            setDifficulty('MEDIUM');
        } else if (difficulty === 'MEDIUM') {
            setDifficulty('HARD');
        } else {
            alert('Congratulations! You\'ve completed all levels!');
            setDifficulty('EASY');
        }
        startGame();
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startGame();
});

startGame();

