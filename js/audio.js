let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type, vol) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(vol || 0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration, vol) {
  const ctx = getCtx();
  const bufSize = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol || 0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

function playFlip() {
  playNoise(0.04, 0.06);
  playTone(600, 0.06, 'sine', 0.1);
}

function playMatch() {
  playTone(523, 0.12, 'sine', 0.2);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.2), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.2), 200);
}

function playMismatch() {
  playTone(300, 0.15, 'square', 0.1);
  setTimeout(() => playTone(200, 0.2, 'square', 0.08), 120);
}

function playVictory() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.3, 'sine', 0.2), i * 150));
  setTimeout(() => {
    playTone(1047, 0.6, 'sine', 0.25);
    playTone(1319, 0.6, 'sine', 0.15);
  }, 600);
}

function playClick() {
  playTone(1000, 0.03, 'sine', 0.08);
}