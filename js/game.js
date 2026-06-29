const ICONS = ['🎮', '🎯', '🎪', '🎨', '🎵', '🎸', '🎲', '🚀', '🌈', '🦄', '🍕', '🎬', '🏆', '🧩', '💎', '🌺'];

const TOTAL_PAIRS = 8;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isLocked = false;

const board = document.getElementById('gameBoard');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const resetBtn = document.getElementById('resetBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const victoryOverlay = document.getElementById('victoryOverlay');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initGame() {
  const chosenIcons = shuffle([...ICONS]).slice(0, TOTAL_PAIRS);
  const deck = shuffle([...chosenIcons, ...chosenIcons]);

  cards = deck.map((icon, index) => ({
    id: index,
    icon,
    isFlipped: false,
    isMatched: false,
  }));

  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  isLocked = false;
  stopTimer();
  resetTimer();
  if (typeof resetAnim === 'function') resetAnim();

  renderBoard();
  updateStats();
  victoryOverlay.classList.add('hidden');
}

function renderBoard() {
  board.innerHTML = '';

  cards.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.index = index;

    const backFace = document.createElement('div');
    backFace.className = 'card-face card-back';

    const frontFace = document.createElement('div');
    frontFace.className = 'card-face card-front';
    frontFace.textContent = card.icon;

    cardEl.appendChild(backFace);
    cardEl.appendChild(frontFace);
    cardEl.addEventListener('click', () => handleCardClick(cardEl, index));

    board.appendChild(cardEl);
  });
}

function handleCardClick(cardEl, index) {
  const card = cards[index];

  if (isLocked || card.isFlipped || card.isMatched) return;

  card.isFlipped = true;
  cardEl.classList.add('flipped');
  flippedCards.push({ el: cardEl, index });
  if (typeof playFlip === 'function') playFlip();

  if (flippedCards.length === 1) {
    startTimer();
  }

  if (flippedCards.length === 2) {
    moves++;
    updateStats();
    isLocked = true;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;
  const cardA = cards[first.index];
  const cardB = cards[second.index];

  if (cardA.icon === cardB.icon) {
    cardA.isMatched = true;
    cardB.isMatched = true;
    first.el.classList.add('matched');
    second.el.classList.add('matched');
    matchedPairs++;
    flippedCards = [];
    isLocked = false;

    updateStats();
    checkWin();
    if (typeof playMatch === 'function') playMatch();
  } else {
    if (typeof playMismatch === 'function') playMismatch();
    setTimeout(() => {
      cardA.isFlipped = false;
      cardB.isFlipped = false;
      first.el.classList.remove('flipped');
      second.el.classList.remove('flipped');
      flippedCards = [];
      isLocked = false;
    }, 400);
  }
}

function updateStats() {
  movesEl.textContent = moves;
  matchesEl.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
}

function checkWin() {
  if (matchedPairs === TOTAL_PAIRS) {
    stopTimer();
    finalMoves.textContent = moves;
    finalTime.textContent = timerEl.textContent;
    victoryOverlay.classList.remove('hidden');
    startVictoryAnim();
    if (typeof playVictory === 'function') playVictory();
  }
}

let timerInterval = null;
let seconds = 0;
const timerEl = document.getElementById('timer');

function startTimer() {
  if (timerInterval !== null) return;
  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  seconds = 0;
  timerEl.textContent = '00:00';
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

resetBtn.addEventListener('click', () => { if (typeof playClick === 'function') playClick(); initGame(); });
playAgainBtn.addEventListener('click', () => { if (typeof playClick === 'function') playClick(); initGame(); });

initGame();
