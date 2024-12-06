const container = document.getElementById('game-container');
const button = document.getElementById('light-switch');
const title = document.getElementById('title');

const gameOverDisplay = document.createElement('div');
gameOverDisplay.id = 'game-over';
gameOverDisplay.style.display = 'none';
container.appendChild(gameOverDisplay);

let unlockedLevels = ['easy'];
let goToDarkTimer = [];
let gameOverDisplayTimer = [];

const blackBackground = 'rgb(0, 0, 0)';
const whiteBackground = 'rgb(255, 255, 255)';


container.style.backgroundColor = whiteBackground;

const timerDisplay = document.getElementById('timer');
let startTime = new Date().getTime();
let timerInterval;

// Add this function to update the timer
function updateTimer() {
    if (startTime === undefined) return;
    const currentTime = new Date().getTime();
    // I want you to update the timerDisplay.textContent in 00:00:00 format, where it starts at minutes:seconds:miliseconds
    const elapsedTime = currentTime - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = Math.floor(elapsedTime / 100) % 10;

    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

function unlockNextLevel() {
    if (!unlockedLevels.includes('easy')) {
        unlockedLevels.push('easy');
    } else if (!unlockedLevels.includes('medium')) {
        unlockedLevels.push('medium');
    } else if (!unlockedLevels.includes('hard')) {
        unlockedLevels.push('hard');
    }
    updateDifficultyButtons();
}

function updateDifficultyButtons() {
    document.getElementById('easy').disabled = !unlockedLevels.includes('easy');
    document.getElementById('medium').disabled = !unlockedLevels.includes('medium');
    document.getElementById('hard').disabled = !unlockedLevels.includes('hard');
}

function IsLightsOn() {
    return container.style.backgroundColor == whiteBackground;
}

function toggleLight(to) {
    if (to === blackBackground) {
        container.style.backgroundColor = blackBackground;
        title.style.color = 'white';
    }  else if (to === whiteBackground) {
        container.style.backgroundColor = whiteBackground;
        title.style.color = 'black';
    } else {
        container.style.backgroundColor = IsLightsOn() ? blackBackground : whiteBackground;
        title.style.color = IsLightsOn() ? 'black' : 'white';
        
    }
}

function toggleLightOn() {
    toggleLight(whiteBackground);
}

function toggleLightOff() {
    toggleLight(blackBackground);
}

function hideGameOverDisplay() {
    gameOverDisplay.style.display = 'none';
}
function showGameOverDisplay() {
    gameOverDisplay.textContent = 'Game Over';
    gameOverDisplay.style.display = 'block';
}

function setGoToDarkTimer(time) {
    time = time || 1000
    goToDarkTimer = setTimeout(() => {
        toggleLightOff();
        setGameOverDisplayTimer(1000);
    }, time);
}

function clearGoToDarkTimer() {
    if (goToDarkTimer) {
        goToDarkTimer.forEach((id) => clearTimeout(id));
        goToDarkTimer = [];
    }
}

function setGameOverDisplayTimer(time) {
    time = time || 5000;
    gameOverDisplayTimer = setTimeout(() => {
        showGameOverDisplay();
    }, time);
}

function isGameOverDisplayVisible() {
    return gameOverDisplay.style.display === 'block';
}

function clearGameOverDisplayTimer() {
    if (gameOverDisplayTimer) {
        gameOverDisplayTimer.forEach((id) => clearTimeout(id));
        gameOverDisplayTimer = [];
    }
}

function clearTimeouts() {
    clearGoToDarkTimer();
    clearGameOverDisplayTimer();
}

function resetGame() {
    unlockedLevels = ['easy'];

    hideGameOverDisplay();
    toggleLightOn();
    clearTimeouts();

}

function startGame() {
    if (startTime == undefined) {
        timerDisplay.textContent = '00:00';
        startTime = new Date().getTime();
    }

    clearTimeouts();
    updateDifficultyButtons();
    toggleLightOn();
    hideGameOverDisplay();

    let darkTime;
    let lightTime;

    if (unlockedLevels.includes('hard')) {
        darkTime = Math.floor(Math.random() * (1000000 - 1000 + 1));
        lightTime = Math.floor(Math.random() * (300 + 1)) + 200;

    } else if (unlockedLevels.includes('medium')) {
        darkTime = Math.floor(Math.random() * (8000 - 1000 + 1)) + 1000;
        lightTime = Math.floor(Math.random() * (500 + 1)) + 500;
    } else {
        darkTime = Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
        lightTime = 1000;
    }
    goToDarkTimerID = setTimeout(() => {
        if (!goToDarkTimer) return;
        
        toggleLightOff();
        gameOverDisplayTimerID  = setTimeout(() => {
            if (gameOverDisplayTimer) {
                showGameOverDisplay();
            };
        }, lightTime)
        gameOverDisplayTimer.push(gameOverDisplayTimerID);
    }, darkTime)
    goToDarkTimer.push(goToDarkTimerID);


    timerInterval = setInterval(updateTimer, 100);
}

function endGame() {
    clearTimeouts();
    showGameOverDisplay();
    clearInterval(timerInterval);
}

// Modify the resetGame function to reset the timer display
function resetGame() {
    startTime = new Date().getTime();
    unlockedLevels = ['easy'];
    hideGameOverDisplay();
    clearTimeouts();
    toggleLightOn();
    clearInterval(timerInterval);
}

button.addEventListener('click', (e) => {
    if (IsLightsOn()) {
        clearTimeouts()
        toggleLightOff();
        showGameOverDisplay();
        startTime = undefined;
    } else {
        clearTimeouts();
        unlockNextLevel();
        startGame();
    }
    e.stopPropagation();

})

container.addEventListener('click', (e) => {
    if (IsLightsOn()) {
        if (goToDarkTimer.length > 0 || gameOverDisplayTimer.length > 0) return;
        startGame();
    } else {
        startTime = undefined;
        toggleLightOff();
        if (!isGameOverDisplayVisible()) {
            showGameOverDisplay();
        } else {
            resetGame();
            startGame();
        }
    }
    clearInterval(timerInterval);
});

document.getElementById('easy').addEventListener('click', (e) => {
    resetGame();
    startGame();
    e.stopPropagation();
});

document.getElementById('medium').addEventListener('click', (e) => {
    if (unlockedLevels.includes('medium')) {
        startGame();

    }
    e.stopPropagation();
});

document.getElementById('hard').addEventListener('click', (e) => {
    if (unlockedLevels.includes('hard')) {
        startGame();
    }
    e.stopPropagation();
});

startGame();