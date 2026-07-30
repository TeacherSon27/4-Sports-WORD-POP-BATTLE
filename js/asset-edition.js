const sports = [
  {
    id: "swimming",
    label: "Swimming",
    gear: ["goggles", "a swim cap", "a swimsuit", "a kickboard", "a life vest", "a float"],
    rules: ["No running!", "No diving!", "No pushing!"],
    assets: [
      { src: "../assets/legacy/swimming-goggles.png", label: "goggles" },
      { src: "../assets/legacy/swimming-cap.png", label: "a swim cap" },
      { src: "../assets/legacy/swimsuit.png", label: "a swimsuit" },
      { src: "../assets/legacy/kickboard.png", label: "a kickboard" },
      { src: "../assets/legacy/swim-vest.png", label: "a life vest" },
      { src: "../assets/legacy/float.png", label: "a float" }
    ],
    ruleAssets: [
      { src: "../assets/legacy/rules/no-running.png", label: "No running!" },
      { src: "../assets/legacy/rules/no-diving.png", label: "No diving!" },
      { src: "../assets/legacy/rules/no-pushing.png", label: "No pushing!" }
    ]
  },
  {
    id: "rock-climbing",
    label: "Rock Climbing",
    gear: ["a helmet", "harnesses", "ropes", "climbing shoes", "chalk"],
    rules: ["No gear, no climb!", "Check your rope every time!", "Don't panic, stay calm!"],
    assets: [
      { src: "../assets/legacy/helmet.png", label: "a helmet" },
      { src: "../assets/legacy/harness.png", label: "harnesses" },
      { src: "../assets/legacy/ropes.png", label: "ropes" },
      { src: "../assets/legacy/climbing-shoes.png", label: "climbing shoes" },
      { src: "../assets/legacy/chalk.png", label: "chalk" }
    ],
    ruleAssets: [
      { src: "../assets/legacy/rules/no-gear-no-climb.png", label: "No gear, no climb!" },
      { src: "../assets/legacy/rules/check-your-rope-every-time.png", label: "Check your rope every time!" },
      { src: "../assets/legacy/rules/dont-panic-stay-calm.png", label: "Don't panic, stay calm!" }
    ]
  },
  {
    id: "snorkeling",
    label: "Snorkeling",
    gear: ["a mask", "a snorkel", "fins", "a rash guard", "a life vest"],
    rules: ["Don't touch it!", "Don't go by yourself!", "Just breathe, don't panic!"],
    assets: [
      { src: "../assets/legacy/mask.png", label: "a mask" },
      { src: "../assets/legacy/snorkel.png", label: "a snorkel" },
      { src: "../assets/legacy/fins.png", label: "fins" },
      { src: "../assets/legacy/rash-guard.png", label: "a rash guard" },
      { src: "../assets/legacy/snorkel-vest.png", label: "a life vest" }
    ],
    ruleAssets: [
      { src: "../assets/legacy/rules/dont-touch-it.png", label: "Don't touch it!" },
      { src: "../assets/legacy/rules/dont-go-by-yourself.png", label: "Don't go by yourself!" },
      { src: "../assets/legacy/rules/just-breathe-dont-panic.png", label: "Just breathe, don't panic!" }
    ]
  },
  {
    id: "sup",
    label: "SUP",
    gear: ["a board", "a paddle", "a leash", "a life vest"],
    rules: ["Don't forget your leash!", "Don't ignore the weather and waves!", "Don't stand up too fast!"],
    assets: [
      { src: "../assets/legacy/sup-board.png", label: "a board" },
      { src: "../assets/legacy/paddle.png", label: "a paddle" },
      { src: "../assets/legacy/leash.png", label: "a leash" },
      { src: "../assets/legacy/sup-vest.png", label: "a life vest" }
    ],
    ruleAssets: [
      { src: "../assets/legacy/rules/dont-forget-your-leash.png", label: "Don't forget your leash!" },
      { src: "../assets/legacy/rules/dont-ignore-the-weather-and-waves.png", label: "Don't ignore the weather and waves!" },
      { src: "../assets/legacy/rules/dont-stand-up-too-fast.png", label: "Don't stand up too fast!" }
    ]
  }
];

const distractorSports = sports.map((sport) => sport.label);
const distractorGear = [...new Set(sports.flatMap((sport) => sport.gear))];
const distractorRules = [...new Set(sports.flatMap((sport) => sport.rules))];
const globalAssetLookup = new Map();
const sportCardLookup = new Map([
  ["Swimming", "../assets/legacy/sport-cards/swimming-card.png"],
  ["Rock Climbing", "../assets/legacy/sport-cards/rock-climbing-card.png"],
  ["Snorkeling", "../assets/legacy/sport-cards/snorkeling-card.png"],
  ["SUP", "../assets/legacy/sport-cards/sup-card.png"]
]);

sports.forEach((sport) => {
  const representativeAsset = sportCardLookup.get(sport.label) || sport.assets[0]?.src || sport.ruleAssets[0]?.src;
  if (representativeAsset) {
    globalAssetLookup.set(sport.label, representativeAsset);
  }
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
  startBtn: document.getElementById("start-btn"),
  nextBtn: document.getElementById("next-btn"),
  resetBtn: document.getElementById("reset-btn"),
  endBtn: document.getElementById("end-btn"),
  fullscreenBtn: document.getElementById("fullscreen-btn"),
  audioBtn: document.getElementById("audio-btn"),
  coverScreen: document.getElementById("cover-screen"),
  coverStartBtn: document.getElementById("cover-start-btn"),
  hint: document.getElementById("hint"),
  winnerTeam: document.getElementById("winner-team"),
  winnerResult: document.getElementById("winner-result"),
  winnerBanner: document.getElementById("winner-banner"),
  winnerConfetti: document.querySelector(".winner-confetti"),
  winnerStars: document.querySelector(".winner-stars"),
  endPanel: document.getElementById("end-panel"),
  endCodeInput: document.getElementById("end-code-input"),
  endStatus: document.getElementById("end-status"),
  endCancelBtn: document.getElementById("end-cancel-btn"),
  endConfirmBtn: document.getElementById("end-confirm-btn")
};

const state = {
  currentTaskIndex: 0,
  running: false,
  lastTick: 0,
  timerLimit: 18,
  timeLeft: 18,
  leftScore: 0,
  rightScore: 0,
  ended: false,
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
  musicGain: null,
  fxGain: null,
  initialized: false,
  musicInterval: null,
  musicStep: 0
};

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(items, count) {
  return shuffle(items).slice(0, count);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomSigned(min, max) {
  return randomBetween(min, max) * (Math.random() > 0.5 ? 1 : -1);
}

function clampBubbleSpeed(bubble) {
  const speed = Math.hypot(bubble.vx, bubble.vy) || 1;
  const clampedSpeed = clamp(speed, bubble.minSpeed, bubble.maxSpeed);
  bubble.vx = (bubble.vx / speed) * clampedSpeed;
  bubble.vy = (bubble.vy / speed) * clampedSpeed;
}

function burstBubbleCourse(bubble, intensity = 1) {
  const heading = Math.atan2(bubble.vy, bubble.vx) + randomBetween(-1.2, 1.2);
  const burst = randomBetween(bubble.burstStrength * 0.55, bubble.burstStrength) * intensity;
  bubble.vx += Math.cos(heading) * burst;
  bubble.vy += Math.sin(heading) * burst;
  clampBubbleSpeed(bubble);
}

function updateBubbleStyle(bubble) {
  const speedRange = Math.max(1, bubble.maxSpeed - bubble.minSpeed);
  const speed = Math.hypot(bubble.vx, bubble.vy);
  const energy = clamp((speed - bubble.minSpeed) / speedRange, 0, 1);
  const tilt = clamp(bubble.vx * 0.09, -16, 16);
  const scale = 1 + energy * 0.08;
  bubble.element.style.setProperty("--motion-tilt", `${tilt.toFixed(2)}deg`);
  bubble.element.style.setProperty("--motion-scale", scale.toFixed(3));
}

function ensureAudio() {
  if (audio.initialized) {
    if (audio.ctx.state === "suspended") {
      audio.ctx.resume();
    }
    updateAudioButton();
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
  audio.musicGain = audio.ctx.createGain();
  audio.fxGain = audio.ctx.createGain();
  audio.master.gain.value = state.audioEnabled ? 0.22 : 0;
  audio.musicGain.gain.value = 0.22;
  audio.fxGain.gain.value = 0.45;
  audio.musicGain.connect(audio.master);
  audio.fxGain.connect(audio.master);
  audio.master.connect(audio.ctx.destination);
  audio.initialized = true;
  if (audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }
  startMusicLoop();
  updateAudioButton();
}

function updateAudioButton() {
  ui.audioBtn.textContent = `Sound: ${state.audioEnabled ? "On" : "Off"}`;
  ui.audioBtn.setAttribute("aria-pressed", String(state.audioEnabled));
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

function setAudioEnabled(enabled) {
  state.audioEnabled = enabled;
  ensureAudio();
  if (!audio.initialized) {
    updateAudioButton();
    return;
  }
  audio.master.gain.cancelScheduledValues(audio.ctx.currentTime);
  audio.master.gain.setTargetAtTime(enabled ? 0.22 : 0, audio.ctx.currentTime, 0.03);
  updateAudioButton();
}

function tone({ frequency, type = "sine", duration = 0.2, when = 0, gain = 0.15, slideTo = null }) {
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

function seedWinnerConfetti() {
  if (!ui.winnerConfetti) {
    return;
  }
  ui.winnerConfetti.querySelectorAll(".generated-confetti").forEach((piece) => piece.remove());
  const colors = ["#ffd166", "#74f6ff", "#ff8f6b", "#80ed99", "#ff7aa8", "#fff0a7", "#7ef5ff", "#ffca6b", "#b06cff", "#ff8f72"];
  const totalPieces = 620;
  for (let i = 0; i < totalPieces; i += 1) {
    const piece = document.createElement("span");
    const width = Math.round(8 + Math.random() * 8);
    const height = Math.round(14 + Math.random() * 13);
    const left = (Math.random() * 100).toFixed(2);
    const duration = (4.8 + Math.random() * 2.8).toFixed(2);
    const delay = (-Math.random() * 6).toFixed(2);
    const drift = ((Math.random() * 240) - 120).toFixed(0);
    const color = colors[Math.floor(Math.random() * colors.length)];
    piece.className = "confetti generated-confetti";
    piece.style.cssText = `--left:${left}%;--color:${color};--w:${width}px;--h:${height}px;--duration:${duration}s;--delay:${delay}s;--drift:${drift}px;`;
    ui.winnerConfetti.appendChild(piece);
  }
}

function seedWinnerStars() {
  if (!ui.winnerStars) {
    return;
  }
  ui.winnerStars.querySelectorAll(".generated-star").forEach((star) => star.remove());
  const totalStars = 180;
  for (let i = 0; i < totalStars; i += 1) {
    const star = document.createElement("span");
    const size = Math.round(12 + Math.random() * 28);
    const left = (Math.random() * 100).toFixed(2);
    const top = (Math.random() * 100).toFixed(2);
    const duration = (2.1 + Math.random() * 2.6).toFixed(2);
    const delay = (-Math.random() * 4.5).toFixed(2);
    star.className = "starburst generated-star";
    star.style.cssText = `--left:${left}%;--top:${top}%;--size:${size}px;--duration:${duration}s;--delay:${delay}s;`;
    ui.winnerStars.appendChild(star);
  }
}

function playPulseKick(when, freq = 95) {
  if (!audio.initialized || !state.audioEnabled) {
    return;
  }
  const start = audio.ctx.currentTime + when;
  const oscillator = audio.ctx.createOscillator();
  const envelope = audio.ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, start);
  oscillator.frequency.exponentialRampToValueAtTime(55, start + 0.22);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(0.16, start + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);
  oscillator.connect(envelope);
  envelope.connect(audio.musicGain);
  oscillator.start(start);
  oscillator.stop(start + 0.26);
}

function playMusicStep() {
  if (!audio.initialized) {
    return;
  }
  const notes = [261.63, 329.63, 392, 329.63, 293.66, 392, 440, 392];
  const step = audio.musicStep % notes.length;
  const start = audio.ctx.currentTime + 0.01;
  const oscillator = audio.ctx.createOscillator();
  const envelope = audio.ctx.createGain();
  oscillator.type = step % 2 === 0 ? "triangle" : "square";
  oscillator.frequency.setValueAtTime(notes[step], start);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(0.038, start + 0.03);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.36);
  oscillator.connect(envelope);
  envelope.connect(audio.musicGain);
  oscillator.start(start);
  oscillator.stop(start + 0.4);

  if (step % 2 === 0) {
    playPulseKick(0, 92);
  }
  audio.musicStep += 1;
}

function startMusicLoop() {
  if (audio.musicInterval || !audio.initialized) {
    return;
  }
  playMusicStep();
  audio.musicInterval = window.setInterval(playMusicStep, 420);
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

function createBubbleMarkup(text, assetSrc, type) {
  const sportCardAsset = isSportCardAsset(assetSrc);
  const hasAsset = Boolean(assetSrc);
  const assetClass = [
    "bubble-asset",
    type === "rule" ? "rule-asset" : "",
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
    hasAsset && type !== "rule" && !sportCardAsset ? "gear-bubble" : "",
    type === "rule" ? "rule-bubble" : "",
    sportCardAsset ? "sport-bubble" : ""
  ].filter(Boolean).join(" ");
  return `<span class="${coreClass}">${image}<span class="bubble-text">${text}</span></span>`;
}

function isSportCardAsset(assetSrc) {
  return Boolean(assetSrc && assetSrc.includes("../assets/legacy/sport-cards/"));
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
      assetSrc,
      popped: false,
      element: button
    };

    updateBubbleStyle(bubble);

    button.addEventListener("click", () => popBubble(laneKey, bubble));
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
      : "The correct safety rules came straight from the PPT.";
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

function showFeedback(side, text, mode) {
  const node = side === "left" ? ui.leftFeedback : ui.rightFeedback;
  node.textContent = text;
  node.style.color = mode === "good" ? "var(--good)" : "var(--bad)";
  node.classList.remove("show");
  void node.offsetWidth;
  node.classList.add("show");
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
  seedWinnerStars();
  seedWinnerConfetti();
  ui.winnerBanner.classList.remove("hidden");
  ui.hint.textContent = endedEarly
    ? "The game was ended early. Reset Match to play all 12 PPT rounds again."
    : "Reset Match to play all 12 PPT rounds again.";
  playWinnerSound();
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
  if (!ui.endPanel || ui.endPanel.classList.contains("hidden")) {
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

function nextRound() {
  if (state.currentTaskIndex < tasks.length - 1) {
    state.currentTaskIndex += 1;
    setupTask(state.currentTaskIndex);
  }
}

function resetMatch() {
  closeEndPanel({ resume: false, returnFocus: false });
  state.currentTaskIndex = 0;
  state.leftScore = 0;
  state.rightScore = 0;
  state.ended = false;
  state.running = false;
  updateScores();
  if (ui.winnerStars) {
    ui.winnerStars.querySelectorAll(".generated-star").forEach((star) => star.remove());
  }
  if (ui.winnerConfetti) {
    ui.winnerConfetti.querySelectorAll(".generated-confetti").forEach((piece) => piece.remove());
  }
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

ui.coverStartBtn.addEventListener("click", () => {
  ui.coverScreen.classList.add("hidden");
  ui.startBtn.focus();
});

ui.nextBtn.addEventListener("click", () => {
  if (state.ended) {
    return;
  }
  nextRound();
});

ui.resetBtn.addEventListener("click", () => {
  ensureAudio();
  resetMatch();
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

document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

window.addEventListener("resize", () => {
  if (!state.ended) {
    setupTask(state.currentTaskIndex);
    ui.leftStatus.textContent = "Screen resized. Tap Start Battle again.";
    ui.rightStatus.textContent = "Screen resized. Tap Start Battle again.";
  }
});

resetMatch();
updateAudioButton();
updateFullscreenButton();
state.lastTick = performance.now();
requestAnimationFrame(animate);
