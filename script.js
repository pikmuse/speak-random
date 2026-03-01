document.addEventListener('DOMContentLoaded', () => {
  const words = [
    'apple','banana','cherry','diamond','eclipse','feather','galaxy','harbor','island','jungle',
    'kettle','lighthouse','meadow','nectar','oasis','pendulum','quartz','ripple','saffron','tundra',
    'umbrella','valley','whisper','xylophone','yonder','zephyr','anchor','bold','compass','dawn',
    'ember','flint','glow','horizon','ivy'
  ];

  const wordEl = document.getElementById('word');
  const timerEl = document.getElementById('timer');
  const btn = document.getElementById('generate-btn');

  let intervalId = null;
  let timeLeft = 60;

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  function updateTimerDisplay(sec) {
    timerEl.textContent = String(sec);
  }

  function startCountdown() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    timeLeft = 60;
    updateTimerDisplay(timeLeft);

    intervalId = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        updateTimerDisplay(0);
        clearInterval(intervalId);
        intervalId = null;
        return;
      }
      updateTimerDisplay(timeLeft);
    }, 1000);
  }

  function generateWord() {
    const w = getRandomWord();
    wordEl.textContent = w;
    startCountdown();
  }

  btn.addEventListener('click', generateWord);
});
