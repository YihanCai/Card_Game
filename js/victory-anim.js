const canvas = document.getElementById('victoryCanvas');
const ctx = canvas.getContext('2d');

let animId = null;
let frame = 0;

const CX = 150, BASE_Y = 180;
const HR = 12, BL = 26, AL = 20, LL = 22;
const COLORS = ['#f5576c', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'];
let particles = [];
let fired = false;

function resetAnim() {
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  frame = 0; particles = []; fired = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startVictoryAnim() {
  resetAnim(); fired = false;
  animId = requestAnimationFrame(step);
}

function step() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame++;
  const t = frame;

  if (t < 30) {
    drawFig(CX, BASE_Y, 0, -0.3, 0.3, 'idle');
  } else if (t < 80) {
    drawFig(CX, BASE_Y, 0, -0.3, 0.3, 'aim');
  } else if (t < 90) {
    if (!fired) {
      fired = true;
      for (let i = 0; i < 35; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
        const sp = 4 + Math.random() * 6;
        particles.push({ x: CX + 20, y: BASE_Y - 40, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, c: COLORS[Math.floor(Math.random() * COLORS.length)], life: 50 + Math.random() * 50, sz: 3 + Math.random() * 4 });
      }
    }
    drawFig(CX, BASE_Y, 0, -0.3, 0.3, 'fire');
  } else if (t < 160) {
    const ft = (t - 90) / 70;
    const jy = Math.sin(ft * Math.PI) * 55;
    const rot = ft * Math.PI * 2;
    const arm = Math.sin(ft * Math.PI * 4) * 0.8;
    drawFig(CX, BASE_Y - jy, rot, arm, 0.3 + Math.cos(ft * Math.PI * 2) * 0.4, 'flip');
  } else {
    const w = (t - 160) * 0.05;
    drawFig(CX, BASE_Y, Math.sin(w) * 0.1, -1.5, 0.5, 'win');
  }

  updateParticles();
  animId = requestAnimationFrame(step);
}

function drawFig(x, y, rot, aL, gL, pose) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(0, -BL - HR, HR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -BL); ctx.lineTo(0, 0);
  ctx.stroke();

  const sy = -BL * 0.75;

  if (pose === 'win') {
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(-AL - 5, sy - 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(AL + 5, sy - 18); ctx.stroke();
  } else if (pose === 'idle') {
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(Math.cos(aL) * AL, sy + Math.sin(aL) * AL); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(Math.cos(-aL) * AL, sy + Math.sin(-aL) * AL); ctx.stroke();
  } else if (pose === 'aim') {
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(-AL, sy - 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(AL * 0.6, sy + 5); ctx.stroke();
  } else if (pose === 'fire') {
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(-AL - 5, sy - 15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(AL * 0.6, sy + 5); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(Math.cos(aL) * AL, sy + Math.sin(aL) * AL); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(Math.cos(-aL) * AL, sy + Math.sin(-aL) * AL); ctx.stroke();
  }

  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(gL) * LL, Math.sin(gL) * LL); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(-gL) * LL, Math.sin(-gL) * LL); ctx.stroke();

  ctx.restore();

  if (pose === 'aim' || pose === 'fire') {
    drawCannon(x + 12, y - BL - 6, rot, pose === 'fire');
  }
}

function drawCannon(cx, cy, rot, firing) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot - 0.2);
  ctx.strokeStyle = '#ff6b6b'; ctx.lineWidth = 3;
  ctx.strokeRect(-3, -5, 18, 10);
  ctx.fillStyle = '#ff6b6b'; ctx.fillRect(-3, -5, 18, 10);
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.arc(15, 0, 3, 0, Math.PI * 2); ctx.fill();
  if (firing) {
    ctx.fillStyle = 'rgba(255,200,50,0.6)';
    ctx.beginPath(); ctx.arc(20, 0, 8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = Math.min(1, p.life / 30);
    ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * (p.life / 80), 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}