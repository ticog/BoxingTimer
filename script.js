// Sound Player using StartSound.mp3
const SoundPlayer = {
    audio: new Audio('StartSound.mp3'),
    play() {
        console.log("🔊 Playing Sound");
        this.audio.currentTime = 0;
        this.audio.play().catch(e => console.log("Audio play deferred:", e));
    }
};

// Configurable settings
let config = { prep: 10, work: 180, rest: 60, totalRounds: 7 };

let timeLeft = config.work;
let round = 1;
let isRunning = false;
let phase = 'idle'; // idle, prep, work, rest
let interval;

const body = document.body;
const timerTxt = document.getElementById('timer');
const statusTxt = document.getElementById('status-text');
const roundTxt = document.getElementById('round-display');
const btnIcon = document.getElementById('btnIcon');

function updateDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    timerTxt.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    roundTxt.innerText = `Round ${round}/${config.totalRounds}`;
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(interval);
        btnIcon.className = "play-icon";
    } else {
        if (phase === 'idle') startWorkout();
        btnIcon.className = "pause-icon";
        interval = setInterval(tick, 1000);
    }
    isRunning = !isRunning;
}

function startWorkout() {
    phase = 'prep';
    timeLeft = config.prep;
    body.className = 'prep';
    statusTxt.innerText = "Prepare";
    updateDisplay();
}

function tick() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
    } else {
        nextPhase();
    }
}

function nextPhase() {
    if (phase === 'prep' || phase === 'rest') {
        SoundPlayer.play();
        phase = 'work';
        timeLeft = config.work;
        body.className = 'work';
        statusTxt.innerText = "Fight";
    } else if (phase === 'work') {
        SoundPlayer.play();
        if (round >= config.totalRounds) {
            resetTimer();
            statusTxt.innerText = "Finished!";
            return;
        }
        phase = 'rest';
        timeLeft = config.rest;
        body.className = 'rest';
        statusTxt.innerText = "Rest";
        round++;
    }
    updateDisplay();
}

function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    phase = 'idle';
    round = 1;
    timeLeft = config.work;
    body.className = '';
    statusTxt.innerText = "Ready";
    btnIcon.className = "play-icon";
    updateDisplay();
}

function toggleSettings() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    if (isRunning) toggleTimer(); // Pause if opening settings
}

function saveSettings() {
    config.prep = parseInt(document.getElementById('input-prep').value);
    config.work = parseInt(document.getElementById('input-work').value);
    config.rest = parseInt(document.getElementById('input-rest').value);
    config.totalRounds = parseInt(document.getElementById('input-rounds').value);
    toggleSettings();
    resetTimer();
}

updateDisplay();
