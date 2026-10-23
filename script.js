/* ===== Khushi's birthday scrapbook — easy-to-edit settings ===== */

// Birthday wishes shown by the "Click for a Birthday Wish" button. Add or edit freely.
const WISHES = [
  "May this year wrap you in the kind of happiness that stays. 💗",
  "I hope every little thing you wish for today comes true. ✨",
  "May your day be as lovely and bright as your smile. 🌷",
  "Here's to a year full of soft mornings, big dreams and sweet surprises. 🎀",
  "You deserve all the cake, all the love, and all the joy today. 🎂",
  "May this new chapter be your most beautiful one yet. 📖",
  "Wishing you endless reasons to smile this year. ☀️",
  "Happy Birthday to the girl who makes the world a little softer. 🤍"
];

// Optional: put your own song at audio/music.mp3 and set this to "audio/music.mp3".
// Leave it empty to use the built-in soft music-box melody.
const MUSIC_FILE = "";

/* ================================================================ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);

/* ---- floating hearts & sparkles ---- */
(function makeFloaties() {
  if (reduceMotion) return;
  const box = $("floaties");
  const icons = ["💗", "✨", "🤍", "🌸", "💖", "⭐", "🎀"];
  const count = window.innerWidth < 600 ? 14 : 24;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "floaty";
    s.textContent = icons[i % icons.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = 12 + Math.random() * 18 + "px";
    s.style.animationDuration = 12 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    box.appendChild(s);
  }
})();

/* ---- confetti burst (hearts, sparkles, bits) ---- */
function burst(amount) {
  if (reduceMotion) return;
  const layer = $("confetti");
  const bits = ["💗", "✨", "🎀", "💖", "🌸", "⭐", "🎉"];
  for (let i = 0; i < amount; i++) {
    const c = document.createElement("span");
    c.className = "confetto";
    c.textContent = bits[Math.floor(Math.random() * bits.length)];
    c.style.left = Math.random() * 100 + "%";
    c.style.fontSize = 14 + Math.random() * 18 + "px";
    c.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
    c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    const dur = 2.6 + Math.random() * 2.4;
    c.style.animationDuration = dur + "s";
    c.style.animationDelay = Math.random() * 0.6 + "s";
    layer.appendChild(c);
    setTimeout(() => c.remove(), (dur + 0.8) * 1000);
  }
}

/* ---- welcome screen -> main site ---- */
let opened = false;
function openSite() {
  if (opened) return;
  opened = true;
  $("giftBtn").classList.add("open");
  burst(40);
  const welcome = $("welcome");
  const site = $("site");
  setTimeout(() => {
    site.hidden = false;
    welcome.classList.add("leaving");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    requestAnimationFrame(() => requestAnimationFrame(() => site.classList.add("show")));
    observeReveals();
    setTimeout(() => { welcome.hidden = true; }, 1100);
  }, 650);
}
$("openBtn").addEventListener("click", openSite);
$("giftBtn").addEventListener("click", openSite);

/* ---- scroll reveal ---- */
function observeReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach((el, i) => {
    el.style.transitionDelay = (i % 2) * 0.12 + "s";
    io.observe(el);
  });
}

/* ---- letter open / close ---- */
const envelope = $("envelope");
const letter = $("letter");
function setLetter(open) {
  envelope.classList.toggle("open", open);
  letter.classList.toggle("open", open);
  envelope.setAttribute("aria-expanded", String(open));
  letter.setAttribute("aria-hidden", String(!open));
  if (open) {
    setTimeout(() => letter.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }), 250);
  } else {
    $("letter-section").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
}
envelope.addEventListener("click", () => setLetter(!letter.classList.contains("open")));
$("closeLetter").addEventListener("click", () => setLetter(false));

/* ---- birthday wish ---- */
let lastWish = -1;
$("wishBtn").addEventListener("click", () => {
  let i;
  do { i = Math.floor(Math.random() * WISHES.length); } while (i === lastWish && WISHES.length > 1);
  lastWish = i;
  const card = $("wishText");
  card.textContent = WISHES[i];
  card.classList.remove("pop");
  void card.offsetWidth; // restart animation
  card.classList.add("pop");
  burst(36);
});

/* ---- lightbox for photos ---- */
const lightbox = $("lightbox");
function closeLightbox() { lightbox.hidden = true; }
document.addEventListener("click", (e) => {
  const fig = e.target.closest(".polaroid");
  if (!fig || fig.closest(".lightbox")) return;
  const img = fig.querySelector("img");
  if (!img) return;
  $("lbImg").src = img.src;
  $("lbImg").alt = img.alt;
  const cap = fig.querySelector("figcaption");
  $("lbCap").textContent = cap ? cap.textContent : "";
  lightbox.hidden = false;
});
$("lbClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

/* ---- music: starts only when she taps the button (never autoplays) ---- */
(function music() {
  const btn = $("musicBtn");
  const text = $("musicText");
  let playing = false;

  // Option A: your own audio file
  let audio = null;
  if (MUSIC_FILE) {
    audio = new Audio(MUSIC_FILE);
    audio.loop = true;
    audio.volume = 0.5;
  }

  // Option B: built-in soft music-box melody (no files needed)
  let ctx = null, master = null, timer = null, step = 0;
  const notes = [523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 587.33,
                 493.88, 587.33, 783.99, 587.33, 659.25, 587.33, 523.25, 392.0,
                 440.0, 523.25, 659.25, 523.25, 587.33, 523.25, 440.0, 392.0,
                 392.0, 493.88, 587.33, 783.99, 659.25, 587.33, 523.25, 523.25];

  function setupSynth() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.38;
    const fb = ctx.createGain();
    fb.gain.value = 0.35;
    delay.connect(fb); fb.connect(delay);
    master.connect(ctx.destination);
    master.connect(delay); delay.connect(ctx.destination);
    return true;
  }

  function ping(freq) {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + 1.5);
  }

  function tick() {
    ping(notes[step % notes.length]);
    if (step % 8 === 0) ping(notes[step % notes.length] / 2); // soft bass note
    step++;
    timer = setTimeout(tick, 520);
  }

  function ui() {
    btn.classList.toggle("playing", playing);
    text.textContent = playing ? "Pause music" : "Play music";
    btn.setAttribute("aria-label", playing ? "Pause music" : "Play soft music");
    $("musicIcon").textContent = playing ? "♫" : "♪";
  }

  btn.addEventListener("click", () => {
    if (!playing) {
      if (audio) {
        audio.play().then(() => { playing = true; ui(); }).catch(() => {});
        return;
      }
      if (!ctx && !setupSynth()) { text.textContent = "No audio here"; return; }
      if (ctx.state === "suspended") ctx.resume();
      playing = true;
      tick();
    } else {
      playing = false;
      if (audio) audio.pause();
      clearTimeout(timer);
    }
    ui();
  });
})();
