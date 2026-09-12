const homeView = document.getElementById("view-home");
const configView = document.getElementById("view-config");
const gameView = document.getElementById("view-game");
const resultsView = document.getElementById("view-results");
const historyView = document.getElementById("view-history");

const startButton = document.getElementById("btn-start");
const playButton = document.getElementById("btn-play");
const historyButton = document.getElementById("btn-history");
const backHomeButton = document.getElementById("btn-back-home");
const replayButton = document.getElementById("btn-replay");
const homeButton = document.getElementById("btn-home");
const historyHomeButton = document.getElementById("btn-history-home");
const clearHistoryButton = document.getElementById("btn-clear-history");

const gameArea = document.getElementById("game-area");
const target = document.getElementById("target");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const missesDisplay = document.getElementById("misses");
const accuracyDisplay = document.getElementById("accuracy");

const finalScore = document.getElementById("final-score");
const finalMisses = document.getElementById("final-misses");
const finalAccuracy = document.getElementById("final-accuracy");

const usernameInput = document.getElementById("username");

const historyList = document.getElementById("history-list");

const views = [homeView, configView, gameView, resultsView, historyView];


function showView(view) {
    views.forEach(currentPage => {
        currentPage.classList.remove("active");
    });

    view.classList.add("active");
};


startButton.addEventListener("click", () => {
    showView(configView);
});

playButton.addEventListener("click", () => {
    username = usernameInput.value.trim();

    if (username.length < 2 || username.length > 20) {
        alert("Username must be between 2 and 20 characters.");
        return;
    }

    saveSettings();

    showView(gameView);
    startGame();
});

historyButton.addEventListener("click", () => {
    showView(historyView);
    showHistory();
});

backHomeButton.addEventListener("click", () => {
    showView(homeView);
});

replayButton.addEventListener("click", () => {
    showView(gameView);
    startGame();
});

homeButton.addEventListener("click", () => {
    showView(homeView);
});

historyHomeButton.addEventListener("click", () => {
    showView(homeView);
});


let selectedMode = "classic";

const modeButtons = document.querySelectorAll("[data-mode]");

modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedMode = button.dataset.mode;

        modeButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
});


let selectedDuration = "10";

const durationButtons = document.querySelectorAll("[data-duration]");

durationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedDuration = button.dataset.duration;

        durationButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
});


let selectedDifficulty = "medium";

const difficultyButtons = document.querySelectorAll("[data-difficulty]");

difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedDifficulty = button.dataset.difficulty;

        difficultyButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
});


let score = 0;
let misses = 0;
let timeLeft = selectedDuration;
let username = "";

let timer;
let challengeTimer;

let endTime;
let gameEnded = false;


function startGame() {
    score = 0;
    misses = 0;
    gameEnded = false;

    clearInterval(timer);
    clearTimeout(challengeTimer);

    timeLeft = Number(selectedDuration);

   
    endTime = Date.now() + Number(selectedDuration) * 1000;

    scoreDisplay.textContent = score;
    missesDisplay.textContent = misses;
    timeDisplay.textContent = timeLeft;

    if (selectedMode === "classic") {
        accuracyDisplay.textContent = "Not measured";
        missesDisplay.textContent = "Not measured";
    } else {
        accuracyDisplay.textContent = "100%";
        missesDisplay.textContent = misses;
    }

    setTargetSize();
    moveTarget();

    timer = setInterval(() => {

        const remainingTime = endTime - Date.now();

        if (remainingTime <= 0) {
            timeLeft = 0;
            timeDisplay.textContent = 0;

            clearInterval(timer);
            clearTimeout(challengeTimer);

            endGame();
            return;
        }

        timeLeft = Math.ceil(remainingTime / 1000);
        timeDisplay.textContent = timeLeft;

    }, 100);

    if (selectedMode === "challenge") {
        startChallengeTimer();
    }
}


function saveSettings() {
    const settings = {
        pseudo: username,
        mode: selectedMode,
        duration: selectedDuration,
        difficulty: selectedDifficulty
    };

    localStorage.setItem("clickFast.settings", JSON.stringify(settings));
}


function getRecordKey() {
    return `${selectedMode}_${selectedDifficulty}_${selectedDuration}`;
}


function saveRecord() {
    const records = JSON.parse(localStorage.getItem("clickFast.records")) || {};

    const key = getRecordKey();

    if (!records[key] || score > records[key]) {
        records[key] = score;
        localStorage.setItem("clickFast.records", JSON.stringify(records));
        return true;
    }

    return false;
}


function endGame() {

    if (gameEnded) {
        return;
    }

    gameEnded = true;

    clearInterval(timer);
    clearTimeout(challengeTimer);

    showView(resultsView);

    finalScore.textContent = score;

    saveRecord();

    if (selectedMode === "classic") {
        finalMisses.textContent = "Not measured";
        finalAccuracy.textContent = "Not measured";
    } else {
        finalMisses.textContent = misses;
        finalAccuracy.textContent = calculateAccuracy();
    }

    saveHistory();
}


function calculateAccuracy() {
    const totalClicks = score + misses;

    if (totalClicks === 0) {
        return "100%";
    }

    const accuracy = (score / totalClicks) * 100;

    return Math.round(accuracy) + "%";
}


function setTargetSize() {
    let targetSize;

    if (selectedDifficulty === "easy") {
        targetSize = 80;
    } else if (selectedDifficulty === "medium") {
        targetSize = 60;
    } else {
        targetSize = 40;
    }

    target.style.width = `${targetSize}px`;
    target.style.height = `${targetSize}px`;
}


function moveTarget() {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    const targetSize = target.offsetWidth;

    const randomX = Math.random() * (areaWidth - targetSize);
    const randomY = Math.random() * (areaHeight - targetSize);

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}


target.addEventListener("click", (event) => {

    event.stopPropagation();

    if (Date.now() >= endTime || gameEnded) {
        endGame();
        return;
    }

    score++;

    scoreDisplay.textContent = score;

    if (selectedMode !== "classic") {
        accuracyDisplay.textContent = calculateAccuracy();
    }

    moveTarget();

    if (selectedMode === "challenge") {
        startChallengeTimer();
    }
});


gameArea.addEventListener("click", () => {

    if (Date.now() >= endTime || gameEnded) {
        endGame();
        return;
    }

    if (selectedMode === "precision") {
        misses++;

        missesDisplay.textContent = misses;
        accuracyDisplay.textContent = calculateAccuracy();
    }

});


function startChallengeTimer() {
    clearTimeout(challengeTimer);

    challengeTimer = setTimeout(() => {

        if (Date.now() >= endTime || gameEnded) {
            return;
        }

        moveTarget();
        startChallengeTimer();

    }, 1000);
}


function saveHistory() {
    const history = JSON.parse(localStorage.getItem("clickFast.history")) || [];

    const game = {
        score: score,
        misses: selectedMode === "classic" ? "Not measured" : misses,
        accuracy: selectedMode === "classic"
            ? "Not measured"
            : calculateAccuracy(),
        mode: selectedMode,
        difficulty: selectedDifficulty,
        duration: selectedDuration
    };

    history.unshift(game);

    if (history.length > 20) {
        history.pop();
    }

    localStorage.setItem("clickFast.history", JSON.stringify(history));
}


function showHistory() {
    const history = JSON.parse(localStorage.getItem("clickFast.history")) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.textContent = "No games played yet.";
        return;
    }

    history.forEach(game => {
        const item = document.createElement("p");

        item.textContent =
            `${game.mode} | ${game.difficulty} | ${game.duration}s | Score: ${game.score} | Misses: ${game.misses} | Accuracy: ${game.accuracy}`;

        historyList.appendChild(item);
    });
}


clearHistoryButton.addEventListener("click", () => {
    localStorage.removeItem("clickFast.history");
    showHistory();
});
