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

const gameArea = document.getElementById("game-area");
const target = document.getElementById("target");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const missesDisplay = document.getElementById("misses");
const accuracyDisplay = document.getElementById("accuracy");

const views = [homeView, configView, gameView, resultsView, historyView];


function showView(view) {
    views.forEach(currentPage => {
        currentPage.classList.remove("active")
    });

    view.classList.add("active");
};

startButton.addEventListener('click', () => {
    showView(configView);
})
playButton.addEventListener('click', () => {
    showView(gameView);
})
historyButton.addEventListener('click', () => {
    showView(historyView);
})
backHomeButton.addEventListener('click', () => {
    showView(homeView);
})
replayButton.addEventListener('click', () => {
    showView(gameView);
})
homeButton.addEventListener('click', () => {
    showView(homeView);
})
historyHomeButton.addEventListener('click', () => {
    showView(homeView);
})

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
let timeLeft = 0;

function startGame() {
    score = 0;
    misses = 0;
    timeLeft = Number(selectedDuration);

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    missesDisplay.textContent = misses;
    accuracyDisplay.textContent = "100%";
}
function moveTarget() {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;
    const targetSize = 60;
}