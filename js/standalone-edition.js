function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function svgUrl(markup) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup.replace(/\s+/g, " ").trim())}`;
}

function makeSportScene(id) {
  if (id === "swimming") {
    return `
      <path d="M0 118 C56 96 106 138 160 118 C214 98 264 140 320 118 L320 210 L0 210 Z" fill="rgba(255,255,255,0.12)"/>
      <path d="M0 136 C56 116 106 158 160 136 C214 116 264 158 320 136" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="8" stroke-linecap="round"/>
      <circle cx="130" cy="92" r="15" fill="#ffd8b5"/>
      <path d="M110 113 C138 96 172 98 206 126" fill="none" stroke="#0f335f" stroke-width="12" stroke-linecap="round"/>
      <path d="M172 96 L206 80" fill="none" stroke="#0f335f" stroke-width="11" stroke-linecap="round"/>
    `;
  }
  if (id === "rock-climbing") {
    return `
      <path d="M0 210 L0 42 C40 64 72 36 112 56 C168 82 212 24 320 80 L320 210 Z" fill="rgba(255,255,255,0.08)"/>
      <path d="M186 0 L320 0 L320 210 L154 210 Z" fill="rgba(66,40,22,0.34)"/>
      <circle cx="196" cy="94" r="14" fill="#ffd8b5"/>
      <path d="M196 110 L214 134 L206 164" fill="none" stroke="#162740" stroke-width="11" stroke-linecap="round"/>
      <path d="M214 132 L244 106" fill="none" stroke="#162740" stroke-width="10" stroke-linecap="round"/>
      <path d="M208 150 L236 174" fill="none" stroke="#162740" stroke-width="10" stroke-linecap="round"/>
    `;
  }
  if (id === "snorkeling") {
    return `
      <path d="M0 136 C40 110 86 160 136 132 C192 100 232 160 320 128 L320 210 L0 210 Z" fill="rgba(255,255,255,0.1)"/>
      <circle cx="94" cy="102" r="16" fill="#ffd8b5"/>
      <path d="M78 104 C92 88 114 88 126 104" fill="none" stroke="#203b6b" stroke-width="12" stroke-linecap="round"/>
      <path d="M126 104 L146 82" fill="none" stroke="#ff8a52" stroke-width="10" stroke-linecap="round"/>
      <path d="M148 82 L160 82" fill="none" stroke="#ff8a52" stroke-width="10" stroke-linecap="round"/>
      <circle cx="244" cy="154" r="16" fill="rgba(255, 205, 116, 0.88)"/>
      <circle cx="260" cy="150" r="10" fill="rgba(255, 147, 102, 0.88)"/>
    `;
  }
  return `
    <path d="M0 160 C58 122 98 174 160 150 C210 132 250 174 320 142 L320 210 L0 210 Z" fill="rgba(255,255,255,0.1)"/>
    <ellipse cx="120" cy="132" rx="52" ry="18" fill="#ffffff" opacity="0.84"/>
    <ellipse cx="120" cy="132" rx="42" ry="11" fill="#5ab7ff"/>
    <path d="M120 88 L148 132" fill="none" stroke="#16395f" stroke-width="10" stroke-linecap="round"/>
    <path d="M144 106 L162 128" fill="none" stroke="#16395f" stroke-width="7" stroke-linecap="round"/>
    <circle cx="102" cy="92" r="13" fill="#ffd8b5"/>
  `;
}

function makeSportCard(def) {
  const title = escapeXml(def.label.toUpperCase());
  const short = escapeXml(def.short);
  return svgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 210">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${def.colors[0]}"/>
          <stop offset="55%" stop-color="${def.colors[1]}"/>
          <stop offset="100%" stop-color="${def.colors[2]}"/>
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.64)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      <rect width="320" height="210" rx="28" fill="url(#bg)"/>
      <rect x="8" y="8" width="304" height="194" rx="22" fill="none" stroke="rgba(255, 245, 201, 0.9)" stroke-width="6"/>
      <path d="M20 22 H300" stroke="rgba(255,255,255,0.22)" stroke-width="8" stroke-linecap="round"/>
      <circle cx="54" cy="40" r="24" fill="url(#shine)" opacity="0.44"/>
      ${makeSportScene(def.id)}
      <rect x="34" y="150" width="112" height="40" rx="20" fill="rgba(7, 28, 71, 0.34)"/>
      <text x="90" y="177" font-family="Trebuchet MS, sans-serif" font-size="28" font-weight="900" fill="#fff8da" text-anchor="middle">${short}</text>
      <text x="160" y="42" font-family="Trebuchet MS, sans-serif" font-size="18" font-weight="900" letter-spacing="2" fill="rgba(255,255,255,0.92)" text-anchor="middle">${title}</text>
    </svg>
  `);
}

function makeSportBadge(def) {
  const short = escapeXml(def.short);
  return svgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${def.colors[0]}"/>
          <stop offset="58%" stop-color="${def.colors[1]}"/>
          <stop offset="100%" stop-color="${def.colors[2]}"/>
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="104" fill="url(#g)"/>
      <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.76)" stroke-width="8"/>
      <circle cx="110" cy="110" r="58" fill="rgba(5, 31, 70, 0.28)"/>
      <text x="110" y="122" font-family="Trebuchet MS, sans-serif" font-size="42" font-weight="900" fill="#fff8da" text-anchor="middle">${short}</text>
    </svg>
  `);
}

const gearMeta = {
  "goggles": { short: "GG", icon: "OO", colors: ["#68e6ff", "#1f86ff", "#125cc3"] },
  "a swim cap": { short: "CAP", icon: "C", colors: ["#ffd36c", "#ff8d4c", "#ff5d53"] },
  "a swimsuit": { short: "SUIT", icon: "S", colors: ["#8cf0ff", "#3cb2ff", "#2054bc"] },
  "a kickboard": { short: "KICK", icon: "KB", colors: ["#fff08c", "#ffc861", "#ff8b3f"] },
  "a life vest": { short: "VEST", icon: "LV", colors: ["#ffe08a", "#ff9a54", "#ff5d53"] },
  "a float": { short: "FLOAT", icon: "O", colors: ["#ffd36c", "#ff8d4c", "#ff5d53"] },
  "a helmet": { short: "HELM", icon: "H", colors: ["#ffe08a", "#ff9a54", "#ff5d53"] },
  "harnesses": { short: "HAR", icon: "HX", colors: ["#70efff", "#35b4ff", "#2f5ee4"] },
  "ropes": { short: "ROPE", icon: "R", colors: ["#ffdf84", "#ffb75c", "#ff7a52"] },
  "climbing shoes": { short: "SHOE", icon: "CS", colors: ["#93f6ff", "#49baff", "#2f5ee4"] },
  "chalk": { short: "CHALK", icon: "C", colors: ["#f5f0e2", "#d9d3c8", "#a79d92"] },
  "a mask": { short: "MASK", icon: "M", colors: ["#7af4ff", "#2faeff", "#1b62db"] },
  "a snorkel": { short: "SNRK", icon: "S", colors: ["#ffe18f", "#ff9f56", "#ff6e4f"] },
  "fins": { short: "FINS", icon: "F", colors: ["#76ffdf", "#26c3c8", "#1660c4"] },
  "a rash guard": { short: "RG", icon: "R", colors: ["#91f0ff", "#3cb2ff", "#2859c2"] },
  "a board": { short: "BOARD", icon: "B", colors: ["#ffe08a", "#ffb76e", "#ff8a52"] },
  "a paddle": { short: "PAD", icon: "P", colors: ["#7ff4ff", "#2faeff", "#1b62db"] },
  "a leash": { short: "LEASH", icon: "L", colors: ["#ffe08a", "#ffa465", "#ff6b53"] }
};

function makeGearAsset(label) {
  const meta = gearMeta[label] || { short: label.slice(0, 4).toUpperCase(), icon: label.charAt(0).toUpperCase(), colors: ["#8ce9ff", "#4aa8ff", "#325dd7"] };
  const short = escapeXml(meta.short);
  const icon = escapeXml(meta.icon);
  return svgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 210">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${meta.colors[0]}"/>
          <stop offset="58%" stop-color="${meta.colors[1]}"/>
          <stop offset="100%" stop-color="${meta.colors[2]}"/>
        </linearGradient>
      </defs>
      <rect width="210" height="210" rx="48" fill="url(#g)"/>
      <rect x="10" y="10" width="190" height="190" rx="38" fill="none" stroke="rgba(255,255,255,0.66)" stroke-width="8"/>
      <circle cx="105" cy="82" r="52" fill="rgba(255,255,255,0.16)"/>
      <text x="105" y="100" font-family="Trebuchet MS, sans-serif" font-size="48" font-weight="900" fill="#fff8da" text-anchor="middle">${icon}</text>
      <rect x="28" y="146" width="154" height="36" rx="18" fill="rgba(8, 32, 70, 0.26)"/>
      <text x="105" y="170" font-family="Trebuchet MS, sans-serif" font-size="24" font-weight="900" fill="#fff8da" text-anchor="middle">${short}</text>
    </svg>
  `);
}

const ruleMeta = {
  "No running!": { short: "NO RUN", colors: ["#ff9f9f", "#ff5b5b", "#e42240"], mode: "ban" },
  "No diving!": { short: "NO DIVE", colors: ["#ffb58f", "#ff825c", "#e44739"], mode: "ban" },
  "No pushing!": { short: "NO PUSH", colors: ["#ffb58f", "#ff825c", "#e44739"], mode: "ban" },
  "No gear, no climb!": { short: "GEAR", colors: ["#fff08c", "#ffca61", "#ff8f3f"], mode: "warn" },
  "Check your rope every time!": { short: "ROPE", colors: ["#76f0ff", "#29b7ff", "#1c62d6"], mode: "check" },
  "Don't panic, stay calm!": { short: "CALM", colors: ["#8df4ff", "#42bbff", "#275bc2"], mode: "check" },
  "Don't touch it!": { short: "TOUCH", colors: ["#ffb58f", "#ff825c", "#e44739"], mode: "ban" },
  "Don't go by yourself!": { short: "BUDDY", colors: ["#ffe08a", "#ffb862", "#ff8b3f"], mode: "warn" },
  "Just breathe, don't panic!": { short: "BREATHE", colors: ["#83f6ff", "#2fb6ff", "#1b62db"], mode: "check" },
  "Don't forget your leash!": { short: "LEASH", colors: ["#ffe08a", "#ffb862", "#ff8b3f"], mode: "warn" },
  "Don't ignore the weather and waves!": { short: "WEATHER", colors: ["#8ef2ff", "#42baff", "#275bc2"], mode: "warn" },
  "Don't stand up too fast!": { short: "SLOW", colors: ["#8ef2ff", "#42baff", "#275bc2"], mode: "check" }
};

function makeRuleSymbol(mode) {
  if (mode === "warn") {
    return `
      <path d="M110 44 L176 164 H44 Z" fill="#ffd166"/>
      <text x="110" y="138" font-family="Trebuchet MS, sans-serif" font-size="64" font-weight="900" fill="#17315a" text-anchor="middle">!</text>
    `;
  }
  if (mode === "check") {
    return `
      <circle cx="110" cy="110" r="62" fill="#ffffff" opacity="0.88"/>
      <path d="M82 110 L104 132 L142 84" fill="none" stroke="#1f75d8" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }
  return `
    <circle cx="110" cy="110" r="70" fill="#ffffff" opacity="0.9"/>
    <circle cx="110" cy="110" r="60" fill="none" stroke="#ff3d4a" stroke-width="16"/>
    <path d="M64 156 L156 64" fill="none" stroke="#ff3d4a" stroke-width="16" stroke-linecap="round"/>
  `;
}

function makeRuleAsset(label) {
  const meta = ruleMeta[label] || { short: label.slice(0, 6).toUpperCase(), colors: ["#ffe08a", "#ffb862", "#ff8b3f"], mode: "warn" };
  const short = escapeXml(meta.short);
  return svgUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${meta.colors[0]}"/>
          <stop offset="58%" stop-color="${meta.colors[1]}"/>
          <stop offset="100%" stop-color="${meta.colors[2]}"/>
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="104" fill="url(#g)"/>
      <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.78)" stroke-width="8"/>
      ${makeRuleSymbol(meta.mode)}
      <rect x="32" y="168" width="156" height="28" rx="14" fill="rgba(8, 32, 70, 0.22)"/>
      <text x="110" y="188" font-family="Trebuchet MS, sans-serif" font-size="18" font-weight="900" fill="#fff8da" text-anchor="middle">${short}</text>
    </svg>
  `);
}

const sports = [
  {
    id: "swimming",
    label: "Swimming",
    short: "SWIM",
    colors: ["#7af4ff", "#2faeff", "#1b62db"],
    gear: ["goggles", "a swim cap", "a swimsuit", "a kickboard", "a life vest", "a float"],
    rules: ["No running!", "No diving!", "No pushing!"]
  },
  {
    id: "rock-climbing",
    label: "Rock Climbing",
    short: "CLIMB",
    colors: ["#ffe08a", "#ffb862", "#ff8b3f"],
    gear: ["a helmet", "harnesses", "ropes", "climbing shoes", "chalk"],
    rules: ["No gear, no climb!", "Check your rope every time!", "Don't panic, stay calm!"]
  },
  {
    id: "snorkeling",
    label: "Snorkeling",
    short: "SNORK",
    colors: ["#82ffe0", "#26c3c8", "#1660c4"],
    gear: ["a mask", "a snorkel", "fins", "a rash guard", "a life vest"],
    rules: ["Don't touch it!", "Don't go by yourself!", "Just breathe, don't panic!"]
  },
  {
    id: "sup",
    label: "SUP",
    short: "SUP",
    colors: ["#ffe18f", "#ff9f56", "#ff6e4f"],
    gear: ["a board", "a paddle", "a leash", "a life vest"],
    rules: ["Don't forget your leash!", "Don't ignore the weather and waves!", "Don't stand up too fast!"]
  }
].map((sport) => {
  const assets = sport.gear.map((label) => ({ label, src: makeGearAsset(label) }));
  const ruleAssets = sport.rules.map((label) => ({ label, src: makeRuleAsset(label) }));
  return {
    ...sport,
    cardSrc: makeSportCard(sport),
    badgeSrc: makeSportBadge(sport),
    assets,
    ruleAssets
  };
});

function sample(list, count) {
  return shuffle([...list]).slice(0, count);
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomSigned(min, max) {
  return randomBetween(min, max) * (Math.random() > 0.5 ? 1 : -1);
}

const distractorSports = sports.map((sport) => sport.label);
const distractorGear = [...new Set(sports.flatMap((sport) => sport.gear))];
const distractorRules = [...new Set(sports.flatMap((sport) => sport.rules))];
const globalAssetLookup = new Map();

sports.forEach((sport) => {
  globalAssetLookup.set(sport.label, sport.cardSrc);
  globalAssetLookup.set(`${sport.label}__badge`, sport.badgeSrc);
  sport.assets.forEach((asset) => globalAssetLookup.set(asset.label, asset.src));
  sport.ruleAssets.forEach((asset) => globalAssetLookup.set(asset.label, asset.src));
});

const tasks = sports.flatMap((sport) => {
  const otherSports = distractorSports.filter((item) => item !== sport.label);
  const otherGear = distractorGear.filter((item) => !sport.gear.includes(item));
  const otherRules = distractorRules.filter((item) => !sport.rules.includes(item));

  return [
    {
      type: "sport",
      sport,
      prompt: `What sport is it? Pop <span class="accent">${sport.label}</span>.`,
      target: [sport.label],
      options: shuffle([sport.label, ...sample(otherSports, 5)])
    },
    {
      type: "gear",
      sport,
      prompt: `What do we need for <span class="accent">${sport.label}</span>? Pop every correct item.`,
      target: sport.gear,
      options: shuffle([...sport.gear, ...sample(otherGear, Math.min(5, otherGear.length))])
    },
    {
      type: "rule",
      sport,
      prompt: `RULES! Pop the safe rules for <span class="accent">${sport.label}</span>.`,
      target: sport.rules,
      options: shuffle([...sport.rules, ...sample(otherRules, Math.min(5, otherRules.length))])
    }
  ];
});

const ui = {
  gameRoot: document.getElementById("game-root"),
  leftField: document.getElementById("field-left"),
  rightField: document.getElementById("field-right"),
  leftScore: document.getElementById("score-left"),
  rightScore: document.getElementById("score-right"),
  leftStatus: document.getElementById("left-status"),
  rightStatus: document.getElementById("right-status"),
  leftFeedback: document.getElementById("feedback-left"),
  rightFeedback: document.getElementById("feedback-right"),
  prompt: document.getElementById("prompt"),
  roundPill: document.getElementById("round-pill"),
  timer: document.getElementById("timer"),
  progressBar: document.getElementById("progress-bar"),
  hint: document.getElementById("hint"),
  startBtn: document.getElementById("start-btn"),
  nextBtn: document.getElementById("next-btn"),
  resetBtn: document.getElementById("reset-btn"),
  fullscreenBtn: document.getElementById("fullscreen-btn"),
  audioBtn: document.getElementById("audio-btn"),
  endBtn: document.getElementById("end-btn"),
  winnerBanner: document.getElementById("winner-banner"),
  winnerTeam: document.getElementById("winner-team"),
  winnerResult: document.getElementById("winner-result"),
  winnerStars: document.getElementById("winner-stars"),
  winnerConfetti: document.getElementById("winner-confetti"),
  floaterA: document.getElementById("floater-a"),
  floaterB: document.getElementById("floater-b"),
  floaterC: document.getElementById("floater-c"),
  floaterD: document.getElementById("floater-d"),
  endPanel: document.getElementById("end-panel"),
  endCodeInput: document.getElementById("end-code-input"),
  endStatus: document.getElementById("end-status"),
  endCancelBtn: document.getElementById("end-cancel-btn"),
  endConfirmBtn: document.getElementById("end-confirm-btn")
};

const state = {
  currentTaskIndex: 0,
  running: false,
  ended: false,
  lastTick: 0,
  timerLimit: 18,
  timeLeft: 18,
  leftScore: 0,
  rightScore: 0,
  audioEnabled: true,
  endPanelResume: false,
  lanes: {
    left: { bubbles: [], drifters: [], finished: false },
    right: { bubbles: [], drifters: [], finished: false }
  }
};

const audio = {
  ctx: null,
  master: null,
  fxGain: null,
  initialized: false
};

function ensureAudio() {
  if (audio.initialized) {
    if (audio.ctx.state === "suspended") {
      audio.ctx.resume();
    }
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    state.audioEnabled = false;
    updateAudioButton();
    return;
  }

  audio.ctx = new AudioContextClass();
  audio.master = audio.ctx.createGain();
  audio.fxGain = audio.ctx.createGain();
  audio.master.gain.value = state.audioEnabled ? 0.22 : 0;
  audio.fxGain.gain.value = 0.48;
  audio.fxGain.connect(audio.master);
  audio.master.connect(audio.ctx.destination);
  audio.initialized = true;
  if (audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }
}

function tone({ frequency, type = "sine", duration = 0.18, when = 0, gain = 0.16, slideTo = null }) {
  if (!audio.initialized || !state.audioEnabled) {
    return;
  }

  const start = audio.ctx.currentTime + when;
  const oscillator = audio.ctx.createOscillator();
  const envelope = audio.ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  }
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + 0.02);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(audio.fxGain);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playCorrectSound() {
  tone({ frequency: 660, type: "triangle", duration: 0.12, gain: 0.12 });
  tone({ frequency: 880, type: "triangle", duration: 0.18, when: 0.08, gain: 0.1 });
}

function playWrongSound() {
  tone({ frequency: 240, type: "sawtooth", duration: 0.18, gain: 0.1, slideTo: 160 });
}

function playWinnerSound() {
  [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => {
    tone({ frequency: note, type: "triangle", duration: 0.28, when: index * 0.1, gain: 0.1 });
  });
}

function updateAudioButton() {
  ui.audioBtn.textContent = `Sound: ${state.audioEnabled ? "On" : "Off"}`;
  ui.audioBtn.setAttribute("aria-pressed", String(state.audioEnabled));
}

function setAudioEnabled(enabled) {
  state.audioEnabled = enabled;
  ensureAudio();
  if (audio.initialized) {
    audio.master.gain.cancelScheduledValues(audio.ctx.currentTime);
    audio.master.gain.setTargetAtTime(enabled ? 0.22 : 0, audio.ctx.currentTime, 0.03);
  }
  updateAudioButton();
}

function isFullscreenActive() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}

function updateFullscreenButton() {
  const active = isFullscreenActive();
  ui.fullscreenBtn.textContent = active ? "Exit Fullscreen" : "Fullscreen";
  ui.fullscreenBtn.setAttribute("aria-pressed", String(active));
}

async function toggleFullscreen() {
  const root = ui.gameRoot;
  if (!root) {
    return;
  }
  if (isFullscreenActive()) {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    return;
  }
  if (root.requestFullscreen) {
    await root.requestFullscreen();
  } else if (root.webkitRequestFullscreen) {
    root.webkitRequestFullscreen();
  }
}

function seedWinnerDecor() {
  ui.winnerStars.innerHTML = "";
  ui.winnerConfetti.innerHTML = "";

  for (let i = 0; i < 160; i += 1) {
    const star = document.createElement("span");
    star.className = "starburst";
    star.style.setProperty("--left", `${(Math.random() * 100).toFixed(2)}%`);
    star.style.setProperty("--top", `${(Math.random() * 100).toFixed(2)}%`);
    star.style.setProperty("--size", `${Math.round(12 + Math.random() * 26)}px`);
    star.style.setProperty("--duration", `${(2.2 + Math.random() * 2.4).toFixed(2)}s`);
    star.style.setProperty("--delay", `${(-Math.random() * 4.2).toFixed(2)}s`);
    ui.winnerStars.appendChild(star);
  }

  const colors = ["#ffd166", "#74f6ff", "#ff8f6b", "#80ed99", "#ff7aa8", "#fff0a7", "#7ef5ff", "#ffca6b", "#b06cff", "#ff8f72"];
  for (let i = 0; i < 240; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.setProperty("--left", `${(Math.random() * 100).toFixed(2)}%`);
    piece.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
    piece.style.setProperty("--w", `${Math.round(8 + Math.random() * 8)}px`);
    piece.style.setProperty("--h", `${Math.round(14 + Math.random() * 12)}px`);
    piece.style.setProperty("--duration", `${(5 + Math.random() * 2.6).toFixed(2)}s`);
    piece.style.setProperty("--delay", `${(-Math.random() * 5.2).toFixed(2)}s`);
    piece.style.setProperty("--drift", `${Math.round((Math.random() * 220) - 110)}px`);
    ui.winnerConfetti.appendChild(piece);
  }
}

function seedWinnerFloaters() {
  const badges = sports.map((sport) => sport.badgeSrc);
  ui.floaterA.src = badges[0];
  ui.floaterB.src = badges[1];
  ui.floaterC.src = badges[2];
  ui.floaterD.src = badges[3];
}

function getDrifterAssets(task) {
  if (task.type === "rule") {
    return task.sport.ruleAssets;
  }
  if (task.type === "sport") {
    return [...task.sport.assets.slice(0, 2), ...task.sport.ruleAssets.slice(0, 2)];
  }
  return task.sport.assets;
}

function isSportCardAsset(assetSrc) {
  return sports.some((sport) => sport.cardSrc === assetSrc);
}

function createBubbleMarkup(text, assetSrc, type) {
  const sportCardAsset = isSportCardAsset(assetSrc);
  const hasAsset = Boolean(assetSrc);
  const assetClass = [
    "bubble-asset",
    hasAsset && type === "rule" ? "rule-asset" : "",
    sportCardAsset ? "sport-card-asset" : ""
  ].filter(Boolean).join(" ");
  const image = assetSrc
    ? sportCardAsset
      ? `<span class="bubble-asset-frame sport-card-frame"><img class="${assetClass}" src="${assetSrc}" alt=""></span>`
      : `<img class="${assetClass}" src="${assetSrc}" alt="">`
    : "";
  const coreClass = [
    "bubble-core",
    hasAsset ? "has-asset" : "",
    hasAsset && type === "gear" ? "gear-bubble" : "",
    hasAsset && type === "rule" ? "rule-bubble" : "",
    sportCardAsset ? "sport-bubble" : ""
  ].filter(Boolean).join(" ");
  return `<span class="${coreClass}">${image}<span class="bubble-text">${text}</span></span>`;
}

function updateBubbleStyle(bubble) {
  const speed = Math.hypot(bubble.vx, bubble.vy);
  const energy = clamp((speed - bubble.minSpeed) / Math.max(bubble.maxSpeed - bubble.minSpeed, 1), 0, 1);
  const tilt = clamp(bubble.vx * 0.06, -16, 16);
  const scale = 1 + energy * 0.08;
  bubble.element.style.setProperty("--motion-tilt", `${tilt.toFixed(2)}deg`);
  bubble.element.style.setProperty("--motion-scale", scale.toFixed(3));
}

function clampBubbleSpeed(bubble) {
  const speed = Math.hypot(bubble.vx, bubble.vy);
  if (!speed) {
    bubble.vx = bubble.minSpeed;
    bubble.vy = 0;
    return;
  }
  if (speed < bubble.minSpeed) {
    const factor = bubble.minSpeed / speed;
    bubble.vx *= factor;
    bubble.vy *= factor;
  } else if (speed > bubble.maxSpeed) {
    const factor = bubble.maxSpeed / speed;
    bubble.vx *= factor;
    bubble.vy *= factor;
  }
}

function burstBubbleCourse(bubble) {
  const angle = Math.atan2(bubble.vy, bubble.vx) + randomBetween(-0.7, 0.7);
  const speed = clamp(Math.hypot(bubble.vx, bubble.vy) + bubble.burstStrength, bubble.minSpeed, bubble.maxSpeed);
  bubble.vx = Math.cos(angle) * speed;
  bubble.vy = Math.sin(angle) * speed;
}

function cancelSyntheticInput(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

function activateBubble(event, laneKey, bubble) {
  if (event.type === "pointerdown" && event.pointerType === "mouse" && event.button !== 0) {
    return;
  }

  cancelSyntheticInput(event);
  popBubble(laneKey, bubble);
}

function bindBubbleInput(button, laneKey, bubble) {
  if (window.PointerEvent) {
    button.addEventListener("pointerdown", (event) => {
      activateBubble(event, laneKey, bubble);
    });
    button.addEventListener("click", (event) => {
      if (event.detail === 0) {
        popBubble(laneKey, bubble);
        return;
      }
      cancelSyntheticInput(event);
    });
    return;
  }

  button.addEventListener("touchstart", (event) => {
    activateBubble(event, laneKey, bubble);
  }, { passive: false });
  button.addEventListener("click", () => popBubble(laneKey, bubble));
}

function isAggressiveBubbleRound(roundIndex) {
  return [2, 5, 8, 11].includes(roundIndex);
}

function makeBubbles(laneKey, options, targets, type, roundIndex) {
  const field = laneKey === "left" ? ui.leftField : ui.rightField;
  const rect = field.getBoundingClientRect();
  const bubbles = [];
  const correctSet = new Set(targets);
  const aggressiveRound = isAggressiveBubbleRound(roundIndex);
  const roundSpeedBoost = aggressiveRound ? 1.34 : 1;
  const roundSteerBoost = aggressiveRound ? 1.55 : 1;
  const roundBurstBoost = aggressiveRound ? 1.65 : 1;
  const roundCooldownScale = aggressiveRound ? 0.62 : 1;
  const roundKickBoost = aggressiveRound ? 1.18 : 1;
  const speedScale = (type === "rule" ? 0.9 : 1) * roundSpeedBoost * (rect.width < 520 ? 0.88 : 1);

  options.forEach((text, index) => {
    const assetSrc = globalAssetLookup.get(text) || null;
    const hasAsset = Boolean(assetSrc);
    const sportCardAsset = isSportCardAsset(assetSrc);
    const textScale = type === "rule" ? 3.45 : sportCardAsset ? 3.15 : hasAsset ? 3.8 : 3.6;
    const radiusBoost = type === "rule" && hasAsset ? 56 : sportCardAsset ? 42 : hasAsset ? 34 : 0;
    const radiusCap = type === "rule" ? 164 : sportCardAsset ? 146 : hasAsset ? 134 : 112;
    const minRadius = type === "rule" ? 82 : sportCardAsset ? 76 : hasAsset ? 74 : 60;
    const radius = clamp(54 + text.length * textScale + radiusBoost, minRadius, radiusCap);
    const cols = rect.width < 520 ? 2 : 3;
    const rowGap = rect.height < 420 ? 94 : 108;
    const x = 76 + (index % cols) * ((rect.width - 152) / Math.max(cols - 1, 1)) + Math.random() * 24;
    const y = 84 + Math.floor(index / cols) * rowGap + Math.random() * 24;
    const minSpeed = (type === "rule" ? 84 : 104) * speedScale;
    const maxSpeed = (type === "rule" ? 158 : 214) * speedScale;
    const startSpeed = randomBetween(minSpeed * 0.96, minSpeed * 1.22);
    const angle = randomBetween(0, Math.PI * 2);
    const vx = Math.cos(angle) * startSpeed;
    const vy = Math.sin(angle) * startSpeed;
    const button = document.createElement("button");
    button.className = "bubble";
    button.type = "button";
    button.style.width = `${radius * 2}px`;
    button.style.height = `${radius * 2}px`;
    button.innerHTML = createBubbleMarkup(text, assetSrc, type);
    button.setAttribute("aria-label", text);

    const bubble = {
      id: `${laneKey}-${index}-${text}`,
      text,
      correct: correctSet.has(text),
      x,
      y,
      vx,
      vy,
      minSpeed,
      maxSpeed,
      steerForceMin: 34 * speedScale * roundSteerBoost,
      steerForceMax: 68 * speedScale * roundSteerBoost,
      steerForceMinY: 28 * speedScale * roundSteerBoost,
      steerForceMaxY: 58 * speedScale * roundSteerBoost,
      steerX: randomSigned(34, 68) * speedScale * roundSteerBoost,
      steerY: randomSigned(28, 58) * speedScale * roundSteerBoost,
      steerCooldown: randomBetween(0.22, 0.56) * roundCooldownScale,
      burstCooldown: randomBetween(0.48, 0.98) * roundCooldownScale,
      burstStrength: randomBetween(34, 62) * speedScale * roundBurstBoost,
      wallKick: randomBetween(1.05, 1.13) * roundKickBoost,
      radius,
      popped: false,
      element: button
    };

    updateBubbleStyle(bubble);
    bindBubbleInput(button, laneKey, bubble);
    field.appendChild(button);
    bubbles.push(bubble);
  });

  return bubbles;
}

function makeDrifters(laneKey, assets) {
  const field = laneKey === "left" ? ui.leftField : ui.rightField;
  const rect = field.getBoundingClientRect();
  const drifters = assets.slice(0, Math.min(4, assets.length)).map((asset, index) => {
    const node = document.createElement("div");
    node.className = "drifter";
    node.innerHTML = `<img src="${asset.src}" alt="${asset.label}">`;
    const drifter = {
      x: 86 + (index % 2) * ((rect.width - 172) || 120) + Math.random() * 18,
      y: rect.height * 0.6 + Math.floor(index / 2) * 92 + Math.random() * 18,
      vx: (Math.random() * 22 + 12) * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() * 18 + 10) * (Math.random() > 0.5 ? 1 : -1),
      radius: rect.width < 420 ? 39 : 55,
      element: node
    };
    field.appendChild(node);
    return drifter;
  });

  return drifters;
}

function clearField(field) {
  [...field.querySelectorAll(".bubble, .drifter")].forEach((node) => node.remove());
}

function positionAllBubbles() {
  ["left", "right"].forEach((laneKey) => {
    state.lanes[laneKey].bubbles.forEach((bubble) => {
      bubble.element.style.left = `${bubble.x}px`;
      bubble.element.style.top = `${bubble.y}px`;
      updateBubbleStyle(bubble);
    });
    state.lanes[laneKey].drifters.forEach((drifter) => {
      drifter.element.style.left = `${drifter.x}px`;
      drifter.element.style.top = `${drifter.y}px`;
    });
  });
}

function setupTask(index) {
  const task = tasks[index];
  const drifterAssets = getDrifterAssets(task);
  state.timeLeft = state.timerLimit;
  state.running = false;
  state.lanes.left.finished = false;
  state.lanes.right.finished = false;
  ui.leftStatus.textContent = "New wave incoming.";
  ui.rightStatus.textContent = "New wave incoming.";
  ui.prompt.innerHTML = task.prompt;
  ui.roundPill.textContent = `Round ${index + 1} / ${tasks.length} · ${task.type}`;
  ui.timer.textContent = String(state.timerLimit);
  ui.progressBar.style.transform = "scaleX(1)";
  ui.hint.textContent = task.type === "sport"
    ? "Only one sport name is correct in each lane."
    : task.type === "gear"
      ? "There can be several correct gear words. Pop them all."
      : "The correct safety rules came straight from the lesson.";
  clearField(ui.leftField);
  clearField(ui.rightField);
  ui.leftField.appendChild(ui.leftFeedback);
  ui.rightField.appendChild(ui.rightFeedback);
  state.lanes.left.drifters = makeDrifters("left", drifterAssets);
  state.lanes.right.drifters = makeDrifters("right", drifterAssets);
  state.lanes.left.bubbles = makeBubbles("left", task.options, task.target, task.type, index);
  state.lanes.right.bubbles = makeBubbles("right", task.options, task.target, task.type, index);
  positionAllBubbles();
  ui.nextBtn.disabled = true;
}

function showFeedback(side, text, mode) {
  const node = side === "left" ? ui.leftFeedback : ui.rightFeedback;
  node.textContent = text;
  node.style.color = mode === "good" ? "var(--good)" : "var(--bad)";
  node.classList.remove("show");
  void node.offsetWidth;
  node.classList.add("show");
}

function updateScores() {
  ui.leftScore.textContent = state.leftScore;
  ui.rightScore.textContent = state.rightScore;
}

function checkLaneCompletion(side) {
  const lane = state.lanes[side];
  if (lane.finished) {
    return;
  }
  const remainingCorrect = lane.bubbles.some((bubble) => bubble.correct && !bubble.popped);
  if (!remainingCorrect) {
    lane.finished = true;
    const bonus = Math.ceil(state.timeLeft) * 2;
    if (side === "left") {
      state.leftScore += bonus;
      ui.leftStatus.textContent = `Lane clear! Bonus +${bonus}`;
    } else {
      state.rightScore += bonus;
      ui.rightStatus.textContent = `Lane clear! Bonus +${bonus}`;
    }
    updateScores();
    showFeedback(side, `Clear +${bonus}`, "good");
  }

  if (state.lanes.left.finished && state.lanes.right.finished) {
    finishRound();
  }
}

function popBubble(side, bubble) {
  if (!state.running || bubble.popped || state.ended || state.lanes[side].finished) {
    return;
  }

  bubble.popped = true;
  bubble.element.classList.add("is-popped");

  if (bubble.correct) {
    playCorrectSound();
    if (side === "left") {
      state.leftScore += 10;
      ui.leftStatus.textContent = `Great hit: ${bubble.text}`;
    } else {
      state.rightScore += 10;
      ui.rightStatus.textContent = `Great hit: ${bubble.text}`;
    }
    showFeedback(side, "+10", "good");
  } else {
    playWrongSound();
    if (side === "left") {
      state.leftScore = Math.max(0, state.leftScore - 5);
      ui.leftStatus.textContent = `Oops: ${bubble.text}`;
    } else {
      state.rightScore = Math.max(0, state.rightScore - 5);
      ui.rightStatus.textContent = `Oops: ${bubble.text}`;
    }
    showFeedback(side, "-5", "bad");
  }

  updateScores();
  checkLaneCompletion(side);
}

function startRound() {
  if (state.ended || state.running) {
    return;
  }
  ensureAudio();
  state.running = true;
  state.lastTick = performance.now();
  ui.leftStatus.textContent = "Pop the right words!";
  ui.rightStatus.textContent = "Pop the right words!";
  ui.nextBtn.disabled = true;
}

function finishRound() {
  if (!state.running) {
    return;
  }

  state.running = false;
  ui.nextBtn.disabled = false;
  ui.leftStatus.textContent = state.lanes.left.finished ? ui.leftStatus.textContent : "Round over.";
  ui.rightStatus.textContent = state.lanes.right.finished ? ui.rightStatus.textContent : "Round over.";

  if (state.currentTaskIndex === tasks.length - 1) {
    finishMatch();
  }
}

function finishMatch(options = {}) {
  const endedEarly = Boolean(options.endedEarly);
  closeEndPanel({ resume: false, returnFocus: false });
  state.running = false;
  state.ended = true;
  const left = state.leftScore;
  const right = state.rightScore;
  const winnerName = left === right ? "Teams Tied" : left > right ? "Team A" : "Team B";
  const result = left === right
    ? `Final score ${left} - ${right}. It's a tie battle.`
    : left > right
      ? `Team A wins ${left} - ${right}!`
      : `Team B wins ${right} - ${left}!`;
  ui.nextBtn.disabled = true;
  ui.leftStatus.textContent = endedEarly ? "Game ended early." : "Match complete.";
  ui.rightStatus.textContent = endedEarly ? "Game ended early." : "Match complete.";
  ui.winnerTeam.textContent = winnerName;
  ui.winnerResult.textContent = endedEarly ? `${result} Game ended early.` : result;
  ui.winnerBanner.classList.remove("hidden");
  ui.hint.textContent = endedEarly
    ? "The game was ended early. Reset Match to play all 12 rounds again."
    : "Reset Match to play all 12 rounds again.";
  seedWinnerDecor();
  playWinnerSound();
}

function nextRound() {
  if (state.currentTaskIndex < tasks.length - 1) {
    state.currentTaskIndex += 1;
    setupTask(state.currentTaskIndex);
  }
}

function openEndPanel() {
  if (state.ended || !ui.endPanel) {
    return;
  }
  state.endPanelResume = state.running;
  state.running = false;
  ui.endPanel.classList.remove("hidden");
  ui.endPanel.setAttribute("aria-hidden", "false");
  ui.endStatus.textContent = "";
  ui.endCodeInput.value = "";
  window.setTimeout(() => {
    ui.endCodeInput.focus();
    ui.endCodeInput.select();
  }, 20);
}

function closeEndPanel(options = {}) {
  const { resume = true, returnFocus = true } = options;
  if (ui.endPanel.classList.contains("hidden")) {
    state.endPanelResume = false;
    return;
  }

  ui.endPanel.classList.add("hidden");
  ui.endPanel.setAttribute("aria-hidden", "true");
  ui.endCodeInput.value = "";
  ui.endStatus.textContent = "";

  if (resume && !state.ended && state.endPanelResume) {
    state.running = true;
    state.lastTick = performance.now();
    ui.leftStatus.textContent = "Pop the right words!";
    ui.rightStatus.textContent = "Pop the right words!";
  }

  state.endPanelResume = false;
  if (returnFocus) {
    ui.endBtn.focus();
  }
}

function confirmEndPanel() {
  const enteredCode = ui.endCodeInput.value.trim();
  if (enteredCode !== "143") {
    ui.endStatus.textContent = "Wrong code. The game is still on.";
    ui.endCodeInput.focus();
    ui.endCodeInput.select();
    return;
  }
  finishMatch({ endedEarly: true });
}

function resetMatch() {
  closeEndPanel({ resume: false, returnFocus: false });
  state.currentTaskIndex = 0;
  state.leftScore = 0;
  state.rightScore = 0;
  state.ended = false;
  state.running = false;
  updateScores();
  ui.winnerBanner.classList.add("hidden");
  setupTask(0);
  ui.hint.textContent = "Both teams play at the same time. Pop the correct words in your half only.";
}

function updateMotion(dt) {
  ["left", "right"].forEach((laneKey) => {
    const field = laneKey === "left" ? ui.leftField : ui.rightField;
    const width = field.clientWidth;
    const height = field.clientHeight;
    const lane = state.lanes[laneKey];

    lane.bubbles.forEach((bubble) => {
      if (bubble.popped) {
        return;
      }

      bubble.steerCooldown -= dt;
      bubble.burstCooldown -= dt;

      if (bubble.steerCooldown <= 0) {
        bubble.steerX = randomSigned(bubble.steerForceMin, bubble.steerForceMax);
        bubble.steerY = randomSigned(bubble.steerForceMinY, bubble.steerForceMaxY);
        bubble.steerCooldown = randomBetween(0.18, 0.48);
      }

      if (bubble.burstCooldown <= 0) {
        burstBubbleCourse(bubble);
        bubble.burstCooldown = randomBetween(0.4, 0.86);
      }

      bubble.vx += bubble.steerX * dt;
      bubble.vy += bubble.steerY * dt;
      clampBubbleSpeed(bubble);

      bubble.x += bubble.vx * dt;
      bubble.y += bubble.vy * dt;

      if (bubble.x - bubble.radius < 10) {
        bubble.x = bubble.radius + 10;
        bubble.vx = Math.abs(bubble.vx) * bubble.wallKick;
        bubble.vy += randomSigned(10, 28);
        clampBubbleSpeed(bubble);
      }
      if (bubble.x + bubble.radius > width - 10) {
        bubble.x = width - bubble.radius - 10;
        bubble.vx = -Math.abs(bubble.vx) * bubble.wallKick;
        bubble.vy += randomSigned(10, 28);
        clampBubbleSpeed(bubble);
      }
      if (bubble.y - bubble.radius < 10) {
        bubble.y = bubble.radius + 10;
        bubble.vy = Math.abs(bubble.vy) * bubble.wallKick;
        bubble.vx += randomSigned(10, 28);
        clampBubbleSpeed(bubble);
      }
      if (bubble.y + bubble.radius > height - 10) {
        bubble.y = height - bubble.radius - 10;
        bubble.vy = -Math.abs(bubble.vy) * bubble.wallKick;
        bubble.vx += randomSigned(10, 28);
        clampBubbleSpeed(bubble);
      }

      bubble.element.style.left = `${bubble.x}px`;
      bubble.element.style.top = `${bubble.y}px`;
      updateBubbleStyle(bubble);
    });

    lane.drifters.forEach((drifter) => {
      drifter.x += drifter.vx * dt;
      drifter.y += drifter.vy * dt;

      if (drifter.x - drifter.radius < 8) {
        drifter.x = drifter.radius + 8;
        drifter.vx *= -1;
      }
      if (drifter.x + drifter.radius > width - 8) {
        drifter.x = width - drifter.radius - 8;
        drifter.vx *= -1;
      }
      if (drifter.y - drifter.radius < 72) {
        drifter.y = drifter.radius + 72;
        drifter.vy *= -1;
      }
      if (drifter.y + drifter.radius > height - 8) {
        drifter.y = height - drifter.radius - 8;
        drifter.vy *= -1;
      }

      drifter.element.style.left = `${drifter.x}px`;
      drifter.element.style.top = `${drifter.y}px`;
    });
  });
}

function animate(now) {
  const dt = Math.min((now - state.lastTick) / 1000, 0.033);
  state.lastTick = now;

  if (state.running) {
    state.timeLeft = Math.max(0, state.timeLeft - dt);
    ui.timer.textContent = Math.ceil(state.timeLeft);
    ui.progressBar.style.transform = `scaleX(${state.timeLeft / state.timerLimit})`;
    updateMotion(dt);

    if (state.timeLeft <= 0) {
      finishRound();
    }
  }

  requestAnimationFrame(animate);
}

ui.startBtn.addEventListener("click", () => {
  if (state.ended) {
    resetMatch();
  }
  ensureAudio();
  startRound();
});

ui.nextBtn.addEventListener("click", () => {
  if (!state.ended) {
    nextRound();
  }
});

ui.resetBtn.addEventListener("click", () => {
  ensureAudio();
  resetMatch();
});

ui.audioBtn.addEventListener("click", () => {
  ensureAudio();
  setAudioEnabled(!state.audioEnabled);
});

ui.fullscreenBtn.addEventListener("click", async () => {
  try {
    await toggleFullscreen();
  } catch (error) {
    console.warn("Fullscreen toggle failed.", error);
  }
  updateFullscreenButton();
});

ui.endBtn.addEventListener("click", () => {
  openEndPanel();
});

ui.endCancelBtn.addEventListener("click", () => {
  closeEndPanel();
});

ui.endConfirmBtn.addEventListener("click", () => {
  confirmEndPanel();
});

ui.endCodeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmEndPanel();
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeEndPanel();
  }
});

document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

window.addEventListener("resize", () => {
  if (!state.ended) {
    setupTask(state.currentTaskIndex);
    ui.leftStatus.textContent = "Screen resized. Tap Start Battle again.";
    ui.rightStatus.textContent = "Screen resized. Tap Start Battle again.";
  }
});

seedWinnerFloaters();
resetMatch();
updateAudioButton();
updateFullscreenButton();
state.lastTick = performance.now();
requestAnimationFrame(animate);
