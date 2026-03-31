/* ============================================================
   ANUSHKA'S BIRTHDAY WEBSITE — script.js
   ============================================================ */

/* ── CONFIGURATION ─────────────────────────────────────────── */

// Birthday: April 8, 2026 at midnight IST (UTC+5:30)
const BIRTHDAY = new Date('2026-04-08T00:00:00+05:30');

// ── Love letter ──────────────────────────────────────────────
// Replace the lines inside paragraphs with your actual letter.
// Each string in the array becomes its own paragraph.
const LETTER_PARAGRAPHS = [
  // ✏️  ADD YOUR LETTER HERE — replace this placeholder text
  // Example: "My dearest Anushka, I still remember the first time I saw you..."
  "[ Your letter to Anushka goes here. Edit the LETTER_PARAGRAPHS array in script.js to add your words. ]",
];

// ── Polaroid photos ──────────────────────────────────────────
// Add your photos into an  images/  folder next to index.html.
// Then fill in the entries below:  { src, caption }
// Example: { src: "images/photo1.jpg", caption: "our first day out 🌸" }
const PHOTOS = [
  // { src: "images/photo1.jpg", caption: "caption here" },
  // { src: "images/photo2.jpg", caption: "caption here" },
  // { src: "images/photo3.jpg", caption: "caption here" },
  // { src: "images/photo4.jpg", caption: "caption here" },
  // { src: "images/photo5.jpg", caption: "caption here" },
];

// Number of placeholder polaroid slots shown until real photos are added
const PLACEHOLDER_COUNT = 5;

/* ─────────────────────────────────────────────────────────── */


/* ── ELEMENTS ────────────────────────────────────────────── */
const cdScreen = document.getElementById('countdown-screen');
const bdScreen = document.getElementById('birthday-screen');
const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-minutes');
const cdSecs = document.getElementById('cd-seconds');
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');

/* ── COUNTDOWN TIMER ─────────────────────────────────────── */
function pad(n) { return String(n).padStart(2, '0'); }

function setDigit(el, value) {
  const str = pad(value);
  if (el.textContent !== str) {
    el.textContent = str;
    el.classList.remove('tick-flash');
    void el.offsetWidth; // reflow
    el.classList.add('tick-flash');
  }
}

function tick() {
  const now = new Date();
  const diff = BIRTHDAY - now;

  if (diff <= 0) {
    unlock();
    return;
  }

  const totalSecs = Math.floor(diff / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  setDigit(cdDays, days);
  setDigit(cdHours, hours);
  setDigit(cdMins, mins);
  setDigit(cdSecs, secs);
}

tick();
const countInterval = setInterval(tick, 1000);

/* ── UNLOCK ─────────────────────────────────────────────── */
function unlock() {
  clearInterval(countInterval);
  cdScreen.classList.add('hidden');
  bdScreen.classList.remove('hidden');
  document.title = 'Happy Birthday, Anushka 🌸';

  initHeroName();
  buildLetter();
  buildGallery();
  initScrollReveal();
  launchConfetti();
  tryAutoplay();
  shootHearts(18);
}

/* ── HERO NAME SHIMMER ───────────────────────────────────── */
function initHeroName() {
  const el = document.getElementById('hero-name-text');
  const name = el.textContent;
  el.textContent = '';
  [...name].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    span.style.animationDelay = `${i * 0.12}s`;
    el.appendChild(span);
  });
}

/* ── LOVE LETTER ─────────────────────────────────────────── */
function buildLetter() {
  const body = document.getElementById('letter-body');
  body.innerHTML = '';

  const isPlaceholder = LETTER_PARAGRAPHS.length === 1 &&
    LETTER_PARAGRAPHS[0].startsWith('[');

  if (isPlaceholder) {
    const div = document.createElement('div');
    div.className = 'letter-placeholder';
    div.textContent = LETTER_PARAGRAPHS[0];
    body.appendChild(div);
    return;
  }

  LETTER_PARAGRAPHS.forEach((text, i) => {
    const p = document.createElement('p');
    p.style.marginBottom = i < LETTER_PARAGRAPHS.length - 1 ? '1.2rem' : '0';
    p.textContent = text;
    body.appendChild(p);
  });
}

/* ── POLAROID GALLERY ────────────────────────────────────── */
function buildGallery() {
  const grid = document.getElementById('polaroid-grid');
  const source = PHOTOS.length > 0 ? PHOTOS : null;
  const count = source ? source.length : PLACEHOLDER_COUNT;

  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'polaroid reveal';

    // Random tilt for a natural scattered look
    const tilt = (Math.random() * 10 - 5).toFixed(2);
    card.style.transform = `rotate(${tilt}deg)`;
    card.style.transitionDelay = `${i * 0.08}s`;

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'rotate(0deg) scale(1.07)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `rotate(${tilt}deg) scale(1)`;
    });

    let inner = '';
    if (source) {
      const { src, caption } = source[i];
      inner = `
        <img src="${src}" alt="${caption}" loading="lazy" />
        <p class="polaroid-caption">${caption}</p>
      `;
    } else {
      inner = `
        <div class="polaroid-placeholder">
          <span class="ph-icon">📷</span>
          <span class="ph-text">add your photo here</span>
        </div>
        <p class="polaroid-caption">memory ${i + 1} 💕</p>
      `;
    }

    card.innerHTML = inner;
    grid.appendChild(card);
  }
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Add reveal class to wish items and letter card
  document.querySelectorAll('.wishes-list li, .letter-card, .wishes-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ── FLOATING HEARTS ─────────────────────────────────────── */
const heartEmojis = ['❤️', '🩷', '💕', '💖', '💗', '💓', '🌸', '✨', '💝', '🫀'];
const heartsContainer = document.getElementById('hearts-container');

function spawnHeart() {
  const el = document.createElement('div');
  el.className = 'heart';
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  el.style.left = `${Math.random() * 100}vw`;
  el.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
  const dur = Math.random() * 5 + 6;
  el.style.animationDuration = `${dur}s`;
  heartsContainer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}

function shootHearts(n) {
  for (let i = 0; i < n; i++) {
    setTimeout(spawnHeart, i * 120);
  }
}

// Gentle periodic hearts on the birthday screen
setInterval(() => {
  if (!bdScreen.classList.contains('hidden')) spawnHeart();
}, 2200);

// Subtle hearts on countdown screen
setInterval(() => {
  if (!cdScreen.classList.contains('hidden')) spawnHeart();
}, 4000);

/* ── CONFETTI ────────────────────────────────────────────── */
const confCanvas = document.getElementById('confetti-canvas');
const confCtx = confCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function launchConfetti() {
  confCanvas.width = window.innerWidth;
  confCanvas.height = window.innerHeight;
  confettiActive = true;

  const colors = ['#f472b6', '#c4b5fd', '#f5c6a0', '#fb7185', '#a78bfa', '#fde68a', '#ffffff'];
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * confCanvas.width,
      y: Math.random() * confCanvas.height - confCanvas.height,
      r: Math.random() * 7 + 3,
      d: Math.random() * 200,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncr: Math.random() * 0.07 + 0.05,
    });
  }
  animateConfetti();
  setTimeout(() => { confettiActive = false; }, 6000);
}

function animateConfetti() {
  if (!confettiActive) {
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    return;
  }
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  confettiPieces.forEach(p => {
    confCtx.beginPath();
    confCtx.lineWidth = p.r / 2;
    confCtx.strokeStyle = p.color;
    confCtx.moveTo(p.x + p.tilt + p.r / 4, p.y);
    confCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
    confCtx.stroke();

    p.tiltAngle += p.tiltAngleIncr;
    p.y += (Math.cos(p.d++) + 2) * 1.2;
    p.x += Math.sin(p.d) * 0.8;
    p.tilt = Math.sin(p.tiltAngle - p.d / 3) * 12;
  });
  requestAnimationFrame(animateConfetti);
}

/* ── STARFIELD (PARTICLES CANVAS) ────────────────────────── */
const pCanvas = document.getElementById('particles-canvas');
const pCtx = pCanvas.getContext('2d');
let stars = [];

function initStars() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 130; i++) {
    stars.push({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      da: (Math.random() * 0.005 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
    });
  }
}

function drawStars() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  stars.forEach(s => {
    s.a += s.da;
    if (s.a <= 0 || s.a >= 1) s.da *= -1;
    pCtx.beginPath();
    pCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(255,255,255,${s.a.toFixed(2)})`;
    pCtx.fill();
  });
  requestAnimationFrame(drawStars);
}

initStars();
drawStars();

window.addEventListener('resize', () => {
  initStars();
  confCanvas.width = window.innerWidth;
  confCanvas.height = window.innerHeight;
});

/* ── MUSIC ───────────────────────────────────────────────── */
let musicPlaying = false;

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
    musicPlaying = false;
  } else {
    bgMusic.play().catch(() => { });
    musicBtn.textContent = '🔊';
    musicBtn.classList.add('playing');
    musicPlaying = true;
  }
});

function tryAutoplay() {
  bgMusic.play().then(() => {
    musicPlaying = true;
    musicBtn.textContent = '🔊';
    musicBtn.classList.add('playing');
  }).catch(() => {
    // autoplay blocked — user can click the button manually
  });
}

/* ── DEV HELPER ──────────────────────────────────────────── */
// TESTING: To preview the birthday screen right now, open your browser
// console and type:  previewBirthday()
window.previewBirthday = function () {
  clearInterval(countInterval);
  cdScreen.classList.add('hidden');
  bdScreen.classList.remove('hidden');
  initHeroName();
  buildLetter();
  buildGallery();
  initScrollReveal();
  launchConfetti();
  shootHearts(18);
  console.log('🎉 Birthday screen unlocked for preview!');
};

/* ── BALLOON BACKGROUND ───────────────────────────────────── */
function createBalloons() {
  const container = document.getElementById('balloon-bg');
  if (!container) return;

  const colorClasses = ['bpink-1', 'bpink-2', 'bpink-3', 'bpink-4', 'bpink-5'];
  const allBalloons = [];

  // ── ARCH (semicircle from bottom-left, over top, to bottom-right) ──
  // Arch base ends at ~y=72%, peaks at ~y=10%
  // x spans from ~8% (left) to ~92% (right)
  const archCount = 12;
  for (let i = 0; i <= archCount; i++) {
    const t = (i / archCount) * Math.PI;       // 0 → π
    const xPos = 50 - 43 * Math.cos(t);        // 7% → 93%
    const yPos = 72 - 62 * Math.sin(t);        // peaks at 10%
    const size = 68 + Math.random() * 22;
    const stringLen = 55 + Math.random() * 35;
    allBalloons.push({ x: xPos, y: yPos, size, stringLen, type: 'arch' });
  }

  //  ── LEFT CLUSTER (below the left arch base) ──
  const leftCluster = [
    [5, 74], [13, 79], [3, 83], [9, 89], [18, 85], [5, 94], [14, 93],
  ];
  leftCluster.forEach(([x, y]) => {
    const size = 50 + Math.random() * 32;
    allBalloons.push({ x, y, size, stringLen: 38, type: 'cluster' });
  });

  // ── RIGHT CLUSTER (below the right arch base) ──
  const rightCluster = [
    [95, 74], [87, 79], [97, 83], [91, 89], [82, 85], [95, 94], [86, 93],
  ];
  rightCluster.forEach(([x, y]) => {
    const size = 50 + Math.random() * 32;
    allBalloons.push({ x, y, size, stringLen: 38, type: 'cluster' });
  });

  allBalloons.forEach((b, idx) => {
    const cls = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    const delay = (Math.random() * 2.5).toFixed(2);
    const dur = (3.2 + Math.random() * 1.6).toFixed(2);

    const el = document.createElement('div');
    el.className = `balloon-item ${cls}`;
    el.style.left = `calc(${b.x}% - ${b.size / 2}px)`;
    el.style.top = `calc(${b.y}% - ${b.size * 0.58}px)`;
    el.style.width = `${b.size}px`;
    el.style.height = `${b.size * 1.12}px`;
    el.style.animationDelay = `${delay}s`;
    el.style.animationDuration = `${dur}s`;
    el.style.zIndex = idx;

    // string
    const str = document.createElement('div');
    str.className = 'balloon-string';
    str.style.height = `${b.stringLen}px`;
    el.appendChild(str);

    container.appendChild(el);
  });
}

createBalloons();

