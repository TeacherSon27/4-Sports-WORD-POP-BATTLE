const sports = [
  {
    id: "swimming",
    label: "Swimming",
    gear: ["goggles", "a swim cap", "a swimsuit", "a kickboard", "a life vest", "a float"],
    rules: ["No running!", "No diving!", "No pushing!"],
    assets: [
      { src: "./assets/current/game-asset-06-b4128b831c.png", label: "goggles" },
      { src: "./assets/current/game-asset-07-1f9d627e9b.png", label: "a swim cap" },
      { src: "./assets/current/game-asset-08-157278ef08.png", label: "a swimsuit" },
      { src: "./assets/current/game-asset-09-a5c31d44a0.png", label: "a kickboard" },
      { src: "./assets/current/game-asset-10-76813e9f10.png", label: "a life vest" },
      { src: "./assets/current/game-asset-11-1ab3be8234.png", label: "a float" }
    ],
    ruleAssets: [
      { src: "./assets/current/game-asset-12-a2ce246c40.png", label: "No running!" },
      { src: "./assets/current/game-asset-13-548dddb626.png", label: "No diving!" },
      { src: "./assets/current/game-asset-14-d34e7f0474.png", label: "No pushing!" }
    ]
  },
  {
    id: "rock-climbing",
    label: "Rock Climbing",
    gear: ["a helmet", "harnesses", "ropes", "climbing shoes", "chalk"],
    rules: ["No gear, no climb!", "Check your rope every time!", "Don't panic, stay calm!"],
    assets: [
      { src: "./assets/current/game-asset-15-f9d100f3d1.png", label: "a helmet" },
      { src: "./assets/current/game-asset-16-c1221e81ad.png", label: "harnesses" },
      { src: "./assets/current/game-asset-17-14fa9be9ff.png", label: "ropes" },
      { src: "./assets/current/game-asset-18-ccc7d9e522.png", label: "climbing shoes" },
      { src: "./assets/current/game-asset-19-be3e4e7a61.png", label: "chalk" }
    ],
    ruleAssets: [
      { src: "./assets/current/game-asset-20-d8a25f1378.png", label: "No gear, no climb!" },
      { src: "./assets/current/game-asset-21-c8a5474630.png", label: "Check your rope every time!" },
      { src: "./assets/current/game-asset-22-913e12b56c.png", label: "Don't panic, stay calm!" }
    ]
  },
  {
    id: "snorkeling",
    label: "Snorkeling",
    gear: ["a mask", "a snorkel", "fins", "a rash guard", "a life vest"],
    rules: ["Don't touch it!", "Don't go by yourself!", "Just breathe, don't panic!"],
    assets: [
      { src: "./assets/current/game-asset-23-426d100ee6.png", label: "a mask" },
      { src: "./assets/current/game-asset-24-742d8235e1.png", label: "a snorkel" },
      { src: "./assets/current/game-asset-25-1ad8f03bb2.png", label: "fins" },
      { src: "./assets/current/game-asset-26-6edd18d517.png", label: "a rash guard" },
      { src: "./assets/current/game-asset-27-fda340277f.png", label: "a life vest" }
    ],
    ruleAssets: [
      { src: "./assets/current/game-asset-28-51afb0193d.png", label: "Don't touch it!" },
      { src: "./assets/current/game-asset-29-ac2491c236.png", label: "Don't go by yourself!" },
      { src: "./assets/current/game-asset-30-8a8c92328e.png", label: "Just breathe, don't panic!" }
    ]
  },
  {
    id: "sup",
    label: "SUP",
    gear: ["a board", "a paddle", "a leash", "a life vest"],
    rules: ["Don't forget your leash!", "Don't ignore the weather and waves!", "Don't stand up too fast!"],
    assets: [
      { src: "./assets/current/game-asset-31-c2097c2983.png", label: "a board" },
      { src: "./assets/current/game-asset-32-fd06e3e87e.png", label: "a paddle" },
      { src: "./assets/current/game-asset-33-445d463fec.png", label: "a leash" },
      { src: "./assets/current/game-asset-34-3dde713ca1.png", label: "a life vest" }
    ],
    ruleAssets: [
      { src: "./assets/current/game-asset-35-13f5b74040.png", label: "Don't forget your leash!" },
      { src: "./assets/current/game-asset-36-7e8340002d.png", label: "Don't ignore the weather and waves!" },
      { src: "./assets/current/game-asset-37-f1a8c5b34e.png", label: "Don't stand up too fast!" }
    ]
  }
];

const distractorSports = sports.map((sport) => sport.label);
const distractorGear = [...new Set(sports.flatMap((sport) => sport.gear))];
const distractorRules = [...new Set(sports.flatMap((sport) => sport.rules))];
const globalAssetLookup = new Map();
const sportCardLookup = new Map([
  ["Swimming", "./assets/current/game-asset-38-515274e3f4.png"],
  ["Rock Climbing", "./assets/current/game-asset-39-91da05f1cb.png"],
  ["Snorkeling", "./assets/current/game-asset-40-1d6d988b32.png"],
  ["SUP", "./assets/current/game-asset-41-d627a5037f.png"]
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
  leftLane: document.getElementById("lane-left"),
  rightLane: document.getElementById("lane-right"),
  leftField: document.getElementById("field-left"),
  rightField: document.getElementById("field-right"),
  leftTitle: document.getElementById("title-left"),
  rightTitle: document.getElementById("title-right"),
  leftScoreLabel: document.getElementById("score-label-left"),
  rightScoreLabel: document.getElementById("score-label-right"),
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
  onePlayerBtn: document.getElementById("one-player-btn"),
  fullscreenBtn: document.getElementById("fullscreen-btn"),
  audioBtn: document.getElementById("audio-btn"),
  bottomTouchGuard: document.getElementById("ios-bottom-touch-guard"),
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
  endConfirmBtn: document.getElementById("end-confirm-btn"),
  onePlayerPanel: document.getElementById("one-player-panel"),
  onePlayerCodeInput: document.getElementById("one-player-code-input"),
  onePlayerStatus: document.getElementById("one-player-status"),
  onePlayerCancelBtn: document.getElementById("one-player-cancel-btn"),
  onePlayerConfirmBtn: document.getElementById("one-player-confirm-btn"),
  resultPanel: document.getElementById("result-panel"),
  resultTitle: document.getElementById("result-title"),
  resultCopy: document.getElementById("result-copy"),
  resultCloseBtn: document.getElementById("result-close-btn")
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
  onePlayerMode: false,
  audioEnabled: true,
  endPanelResume: false,
  onePlayerPanelResume: false,
  fullscreenLocked: false,
  fullscreenRetryTimer: 0,
  touchBoardMode: false,
  leanMotion: false,
  motionFrame: 0,
  lanes: {
    left: { bubbles: [], drifters: [], finished: false },
    right: { bubbles: [], drifters: [], finished: false }
  }
};

const bubbleByElement = new WeakMap();
const activeBoardPointers = new Map();

const ONE_PLAYER_PASSCODE = "143";
const ONE_PLAYER_SCORE_TARGET = 300;

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

function getActiveLaneKeys() {
  return state.onePlayerMode ? ["left"] : ["left", "right"];
}

function getScoreRules() {
  return state.onePlayerMode
    ? { correct: 15, wrong: 12, clearMultiplier: 3 }
    : { correct: 10, wrong: 5, clearMultiplier: 2 };
}

function getLaneScore(side) {
  return side === "left" ? state.leftScore : state.rightScore;
}

function setLaneScore(side, value) {
  if (side === "left") {
    state.leftScore = value;
  } else {
    state.rightScore = value;
  }
}

function addLaneScore(side, delta) {
  setLaneScore(side, Math.max(0, getLaneScore(side) + delta));
}

function getModeOptions(task) {
  if (!state.onePlayerMode) {
    return task.options;
  }
  if (task.type === "sport") {
    return shuffle([...distractorSports]);
  }
  if (task.type === "gear") {
    return shuffle([...distractorGear]);
  }
  return shuffle([...distractorRules]);
}

function updateOnePlayerButton() {
  ui.onePlayerBtn.textContent = state.onePlayerMode ? "Two Player Mode" : "One Player Mode";
  ui.onePlayerBtn.setAttribute("aria-pressed", String(state.onePlayerMode));
  ui.onePlayerBtn.classList.toggle("is-active", state.onePlayerMode);
}

function applyModeLayout() {
  ui.gameRoot.classList.toggle("one-player-mode", state.onePlayerMode);
  ui.leftTitle.textContent = state.onePlayerMode ? "One Player" : "Team A";
  ui.leftScoreLabel.textContent = state.onePlayerMode ? "Points" : "Score";
  ui.rightTitle.textContent = "Team B";
  ui.rightScoreLabel.textContent = "Score";
  updateOnePlayerButton();
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
  if (state.leanMotion) {
    return;
  }

  const speedRange = Math.max(1, bubble.maxSpeed - bubble.minSpeed);
  const speed = Math.hypot(bubble.vx, bubble.vy);
  const energy = clamp((speed - bubble.minSpeed) / speedRange, 0, 1);
  const tilt = clamp(bubble.vx * 0.09, -16, 16);
  const scale = 1 + energy * 0.08;
  bubble.element.style.setProperty("--motion-tilt", `${tilt.toFixed(2)}deg`);
  bubble.element.style.setProperty("--motion-scale", scale.toFixed(3));
}

function setMoverPosition(element, x, y) {
  const motionX = state.leanMotion ? Math.round(x) : x.toFixed(2);
  const motionY = state.leanMotion ? Math.round(y) : y.toFixed(2);
  const transform = `translate3d(${motionX}px, ${motionY}px, 0) translate(-50%, -50%)`;
  if (element._motionTransform !== transform) {
    element._motionTransform = transform;
    element.style.transform = transform;
  }
}

function setBubblePosition(bubble) {
  setMoverPosition(bubble.element, bubble.x, bubble.y);
}

function setDrifterPosition(drifter) {
  setMoverPosition(drifter.element, drifter.x, drifter.y);
}

function cancelSyntheticInput(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

function getBubbleButton(node, field) {
  const button = node && typeof node.closest === "function" ? node.closest(".bubble") : null;
  return button && field.contains(button) ? button : null;
}

function hitBubbleButton(button, laneKey, session) {
  if (!button || session.hitButtons.has(button)) {
    return;
  }

  const bubble = bubbleByElement.get(button);
  if (!bubble || bubble.popped) {
    return;
  }

  session.hitButtons.add(button);
  popBubble(laneKey, bubble);
}

function hitBubbleAtPoint(clientX, clientY, laneKey, field, session) {
  const node = document.elementFromPoint(clientX, clientY);
  hitBubbleButton(getBubbleButton(node, field), laneKey, session);
}

function releaseBoardPointer(pointerKey) {
  activeBoardPointers.delete(pointerKey);
}

function resetBoardPointerSessions() {
  activeBoardPointers.forEach((session, pointerKey) => {
    if (typeof pointerKey !== "number" || !session.field.releasePointerCapture) {
      return;
    }

    try {
      if (!session.field.hasPointerCapture || session.field.hasPointerCapture(pointerKey)) {
        session.field.releasePointerCapture(pointerKey);
      }
    } catch (error) {
      // Pointer capture may already have ended during a round transition.
    }
  });
  activeBoardPointers.clear();
}

function bindPointerLane(field, laneKey) {
  field.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    cancelSyntheticInput(event);
    const session = {
      laneKey,
      field,
      hitButtons: new Set()
    };
    activeBoardPointers.set(event.pointerId, session);

    try {
      field.setPointerCapture(event.pointerId);
    } catch (error) {
      // Some embedded smart-board browsers do not expose pointer capture.
    }

    hitBubbleButton(getBubbleButton(event.target, field), laneKey, session);
    hitBubbleAtPoint(event.clientX, event.clientY, laneKey, field, session);
  }, { passive: false });

  field.addEventListener("pointermove", (event) => {
    const session = activeBoardPointers.get(event.pointerId);
    if (!session || session.laneKey !== laneKey) {
      return;
    }

    cancelSyntheticInput(event);
    const samples = typeof event.getCoalescedEvents === "function"
      ? event.getCoalescedEvents()
      : [event];
    const points = samples.length ? samples : [event];
    points.forEach((point) => {
      hitBubbleAtPoint(point.clientX, point.clientY, laneKey, field, session);
    });
  }, { passive: false });

  ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => {
    field.addEventListener(eventName, (event) => {
      releaseBoardPointer(event.pointerId);
    });
  });

  field.addEventListener("click", (event) => {
    const button = getBubbleButton(event.target, field);
    if (!button) {
      return;
    }

    if (event.detail === 0) {
      const bubble = bubbleByElement.get(button);
      if (bubble) {
        popBubble(laneKey, bubble);
      }
      return;
    }

    cancelSyntheticInput(event);
  });
}

function bindLegacyTouchLane(field, laneKey) {
  const beginOrMoveTouches = (event, isStart) => {
    cancelSyntheticInput(event);
    [...event.changedTouches].forEach((touch) => {
      const pointerKey = `touch-${touch.identifier}`;
      let session = activeBoardPointers.get(pointerKey);
      if (!session && isStart) {
        session = {
          laneKey,
          field,
          hitButtons: new Set()
        };
        activeBoardPointers.set(pointerKey, session);
      }
      if (!session || session.laneKey !== laneKey) {
        return;
      }
      hitBubbleAtPoint(touch.clientX, touch.clientY, laneKey, field, session);
    });
  };

  field.addEventListener("touchstart", (event) => {
    beginOrMoveTouches(event, true);
  }, { passive: false });
  field.addEventListener("touchmove", (event) => {
    beginOrMoveTouches(event, false);
  }, { passive: false });
  ["touchend", "touchcancel"].forEach((eventName) => {
    field.addEventListener(eventName, (event) => {
      cancelSyntheticInput(event);
      [...event.changedTouches].forEach((touch) => {
        releaseBoardPointer(`touch-${touch.identifier}`);
      });
    }, { passive: false });
  });

  field.addEventListener("click", (event) => {
    const button = getBubbleButton(event.target, field);
    if (!button) {
      return;
    }
    const bubble = bubbleByElement.get(button);
    if (bubble) {
      popBubble(laneKey, bubble);
    }
  });
}

function setupSplitScreenInput() {
  const lanes = [
    [ui.leftField, "left"],
    [ui.rightField, "right"]
  ];

  lanes.forEach(([field, laneKey]) => {
    if (window.PointerEvent) {
      bindPointerLane(field, laneKey);
      return;
    }
    bindLegacyTouchLane(field, laneKey);
  });
}

function usesTouchBoardProfile() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("touchBoard") || params.get("input") === "touch") {
    return true;
  }

  const hasCoarsePointer = window.matchMedia
    ? window.matchMedia("(any-pointer: coarse)").matches
    : false;
  return navigator.maxTouchPoints > 1 || hasCoarsePointer;
}

function applyTouchBoardProfile() {
  state.touchBoardMode = usesTouchBoardProfile();
  ui.gameRoot.classList.toggle("touch-board-mode", state.touchBoardMode);
}

function getTouchBoardInstruction() {
  return state.touchBoardMode
    ? "Both teams can tap or swipe at the same time. Each finger stays locked to its team's half."
    : "Both teams play at the same time. Pop the correct words in your half only.";
}

function getRoundTouchInstruction() {
  if (!state.touchBoardMode) {
    return "";
  }
  return "Tap or swipe together. ";
}

function getModeHint(task) {
  if (state.onePlayerMode) {
    return `One Player Mode: pop only the correct ${task.type === "sport" ? "sport picture" : "pictures"}. Wrong pictures deduct points.`;
  }
  const touchInstruction = getRoundTouchInstruction();
  return task.type === "sport"
    ? `${touchInstruction}Only one sport name is correct in each lane.`
    : task.type === "gear"
      ? `${touchInstruction}There can be several correct gear words. Pop them all.`
      : `${touchInstruction}The correct safety rules came straight from the PPT.`;
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

function isIosLikeDevice() {
  const userAgent = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function usesLeanMotionProfile() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("leanMotion") || params.get("motion") === "lean") {
    return true;
  }

  const cores = Number(navigator.hardwareConcurrency) || 8;
  const shortestScreenSide = Math.min(window.screen.width || window.innerWidth, window.screen.height || window.innerHeight);
  return isIosLikeDevice()
    && navigator.maxTouchPoints > 1
    && shortestScreenSide >= 700
    && cores <= 4;
}

function applyMotionProfile() {
  state.leanMotion = usesLeanMotionProfile();
  document.documentElement.classList.toggle("lean-motion", state.leanMotion);
  document.body.classList.toggle("lean-motion", state.leanMotion);
  ui.gameRoot.classList.toggle("lean-motion", state.leanMotion);
}

function isStandaloneDisplay() {
  const standaloneMode = window.matchMedia ? window.matchMedia("(display-mode: standalone)").matches : false;
  const fullscreenMode = window.matchMedia ? window.matchMedia("(display-mode: fullscreen)").matches : false;
  return window.navigator.standalone === true
    || standaloneMode
    || fullscreenMode;
}

function hasFullscreenElement() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}

function isFullscreenActive() {
  return hasFullscreenElement() || isStandaloneDisplay();
}

function updateFullscreenLockClass() {
  const locked = state.fullscreenLocked || isStandaloneDisplay();
  ui.gameRoot.classList.toggle("is-fullscreen-locked", locked);
  document.body.classList.toggle("is-fullscreen-locked", locked);
}

function updateFullscreenButton() {
  const elementActive = hasFullscreenElement();
  const active = elementActive || isStandaloneDisplay();
  ui.fullscreenBtn.textContent = active ? (elementActive ? "Exit Fullscreen" : "Fullscreen On") : "Fullscreen";
  ui.fullscreenBtn.setAttribute("aria-pressed", String(active));
  updateFullscreenLockClass();
}

async function requestGameFullscreen() {
  const root = ui.gameRoot;
  if (!root || hasFullscreenElement() || isStandaloneDisplay()) {
    return;
  }

  if (root.requestFullscreen) {
    try {
      await root.requestFullscreen({ navigationUI: "hide" });
    } catch (error) {
      await root.requestFullscreen();
    }
    return;
  }

  const webkitRequestFullscreen = root.webkitRequestFullscreen || root.webkitRequestFullScreen;
  if (webkitRequestFullscreen) {
    webkitRequestFullscreen.call(root);
  }
}

function unlockFullscreen() {
  state.fullscreenLocked = false;
  if (state.fullscreenRetryTimer) {
    window.clearTimeout(state.fullscreenRetryTimer);
    state.fullscreenRetryTimer = 0;
  }
  updateFullscreenLockClass();
}

async function enterFullscreenLockFromGesture() {
  state.fullscreenLocked = true;
  updateFullscreenLockClass();
  try {
    await requestGameFullscreen();
  } catch (error) {
    if (!isIosLikeDevice() && !isStandaloneDisplay()) {
      unlockFullscreen();
    }
  }
  updateFullscreenButton();
}

function scheduleFullscreenRestore() {
  if (state.fullscreenRetryTimer) {
    window.clearTimeout(state.fullscreenRetryTimer);
  }

  if (!state.fullscreenLocked || isFullscreenActive()) {
    state.fullscreenRetryTimer = 0;
    return;
  }

  state.fullscreenRetryTimer = window.setTimeout(async () => {
    state.fullscreenRetryTimer = 0;
    try {
      await requestGameFullscreen();
    } catch (error) {
      if (!isIosLikeDevice() && !isStandaloneDisplay()) {
        unlockFullscreen();
      }
    }
    updateFullscreenButton();
  }, 120);
}

async function toggleFullscreen() {
  if (!ui.gameRoot) {
    return;
  }

  if (hasFullscreenElement()) {
    unlockFullscreen();
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
    return;
  }

  await enterFullscreenLockFromGesture();
}

function maybeAutoLockFullscreen() {
  if (isIosLikeDevice() && !isStandaloneDisplay()) {
    enterFullscreenLockFromGesture();
  }
}

function absorbBottomEdgeTouch(event) {
  if (!state.fullscreenLocked && !isStandaloneDisplay()) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  if (event.stopImmediatePropagation) {
    event.stopImmediatePropagation();
  }

  if (!isFullscreenActive()) {
    enterFullscreenLockFromGesture();
  }
}

function preventFullscreenGestures(event) {
  if (event.type === "gesturestart" || event.type === "gesturechange") {
    event.preventDefault();
    return;
  }

  if (event.type === "touchmove" && (state.fullscreenLocked || isStandaloneDisplay())) {
    event.preventDefault();
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
  return Boolean(assetSrc && [...sportCardLookup.values()].includes(assetSrc));
}

function isAggressiveBubbleRound(roundIndex) {
  return [2, 5, 8, 11].includes(roundIndex);
}

function makeBubbles(laneKey, options, targets, type, roundIndex) {
  const field = laneKey === "left" ? ui.leftField : ui.rightField;
  const rect = field.getBoundingClientRect();
  const bubbles = [];
  const correctSet = new Set(targets);
  const phoneLane = rect.width < 520;
  const iPadLane = rect.width >= 520 && rect.width < 760;
  const fullLane = rect.width >= 760;
  const denseRound = state.onePlayerMode && options.length > 8;
  const veryDenseRound = state.onePlayerMode && options.length > 14;
  const aggressiveRound = isAggressiveBubbleRound(roundIndex);
  const leanMotion = state.leanMotion;
  const roundSpeedBoost = aggressiveRound ? (leanMotion ? 1.24 : 1.52) : (leanMotion ? 1 : 1.12);
  const roundSteerBoost = aggressiveRound ? (leanMotion ? 1.34 : 1.96) : (leanMotion ? 0.92 : 1.24);
  const roundBurstBoost = aggressiveRound ? (leanMotion ? 1.38 : 2.08) : (leanMotion ? 0.92 : 1.26);
  const roundCooldownScale = aggressiveRound ? (leanMotion ? 0.68 : 0.44) : (leanMotion ? 1.08 : 0.84);
  const roundKickBoost = aggressiveRound ? (leanMotion ? 1.14 : 1.32) : (leanMotion ? 1 : 1.1);
  const iPadSpeedBoost = iPadLane ? (leanMotion ? 1.04 : 1.28) : 1;
  const iPadSteerBoost = iPadLane ? (leanMotion ? 1.04 : 1.52) : 1;
  const iPadBurstBoost = iPadLane ? (leanMotion ? 1.08 : 1.66) : 1;
  const iPadCooldownBoost = iPadLane ? (leanMotion ? 0.96 : 0.64) : 1;
  const iPadKickBoost = iPadLane ? (leanMotion ? 1.04 : 1.24) : 1;
  const speedScale = (type === "rule" ? 0.9 : 1) * roundSpeedBoost * (phoneLane ? 0.88 : 1) * iPadSpeedBoost * (denseRound ? 1.06 : 1) * (leanMotion ? 0.82 : 1);
  const leanSizeScale = leanMotion ? 0.96 : 1;

  options.forEach((text, index) => {
    const assetSrc = globalAssetLookup.get(text) || null;
    const hasAsset = Boolean(assetSrc);
    const sportCardAsset = isSportCardAsset(assetSrc);
    const sizeScale = state.onePlayerMode
      ? type === "sport"
        ? (fullLane ? 1.06 : 0.98)
        : veryDenseRound
          ? 0.72
          : denseRound
            ? 0.8
            : (fullLane ? 0.94 : 0.88)
      : phoneLane ? 0.8 : iPadLane ? 0.9 : 1.02;
    const textScale = state.onePlayerMode
      ? type === "rule" ? 2.55 : sportCardAsset ? 2.45 : hasAsset ? 2.8 : 2.55
      : type === "rule" ? 2.9 : sportCardAsset ? 2.55 : hasAsset ? 3.0 : 2.8;
    const radiusBoost = state.onePlayerMode
      ? type === "rule" && hasAsset ? 44 : sportCardAsset ? 38 : hasAsset ? 30 : 14
      : type === "rule" && hasAsset ? 40 : sportCardAsset ? 34 : hasAsset ? 26 : 10;
    const radiusCap = state.onePlayerMode
      ? type === "rule" ? 150 : sportCardAsset ? 142 : hasAsset ? 128 : 104
      : type === "rule" ? 142 : sportCardAsset ? 132 : hasAsset ? 124 : 104;
    const minRadius = state.onePlayerMode
      ? type === "rule" ? 68 : sportCardAsset ? 66 : hasAsset ? 60 : 48
      : type === "rule" ? 66 : sportCardAsset ? 64 : hasAsset ? 60 : 48;
    const radius = clamp((48 + text.length * textScale + radiusBoost) * sizeScale * leanSizeScale, minRadius * sizeScale * leanSizeScale, radiusCap * sizeScale * leanSizeScale);
    const cols = state.onePlayerMode
      ? type === "sport" ? Math.min(4, options.length) : veryDenseRound ? 6 : denseRound ? 5 : (fullLane ? 4 : 3)
      : phoneLane ? 2 : 3;
    const rows = Math.ceil(options.length / cols);
    const yStart = state.onePlayerMode ? 76 : phoneLane ? 72 : iPadLane ? 76 : 84;
    const rowGap = state.onePlayerMode
      ? clamp((rect.height - yStart - 72) / Math.max(rows - 1, 1), veryDenseRound ? 76 : 88, 122)
      : rect.height < 420 ? (iPadLane ? 80 : 88) : (iPadLane ? 92 : 102);
    const xInset = state.onePlayerMode ? (veryDenseRound ? 66 : denseRound ? 74 : 84) : phoneLane ? 64 : iPadLane ? 68 : 74;
    const jitter = state.onePlayerMode ? (veryDenseRound ? 8 : 12) : (iPadLane ? 16 : 24);
    const x = xInset + (index % cols) * ((rect.width - xInset * 2) / Math.max(cols - 1, 1)) + Math.random() * jitter;
    const y = yStart + Math.floor(index / cols) * rowGap + Math.random() * jitter;
    const minSpeed = (type === "rule" ? 96 : 124) * speedScale;
    const maxSpeed = (type === "rule" ? 182 : 254) * speedScale;
    const startSpeed = randomBetween(minSpeed * 1.02, minSpeed * 1.32);
    const angle = randomBetween(0, Math.PI * 2);
    const vx = Math.cos(angle) * startSpeed;
    const vy = Math.sin(angle) * startSpeed;
    const steerCooldownMin = (leanMotion ? 0.36 : 0.12) * roundCooldownScale * iPadCooldownBoost;
    const steerCooldownMax = (leanMotion ? 0.82 : 0.34) * roundCooldownScale * iPadCooldownBoost;
    const burstCooldownMin = (leanMotion ? 1.1 : 0.22) * roundCooldownScale * iPadCooldownBoost;
    const burstCooldownMax = (leanMotion ? 2.1 : 0.58) * roundCooldownScale * iPadCooldownBoost;
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
      steerForceMin: 46 * speedScale * roundSteerBoost * iPadSteerBoost,
      steerForceMax: 92 * speedScale * roundSteerBoost * iPadSteerBoost,
      steerForceMinY: 38 * speedScale * roundSteerBoost * iPadSteerBoost,
      steerForceMaxY: 78 * speedScale * roundSteerBoost * iPadSteerBoost,
      steerX: randomSigned(46, 92) * speedScale * roundSteerBoost * iPadSteerBoost,
      steerY: randomSigned(38, 78) * speedScale * roundSteerBoost * iPadSteerBoost,
      steerCooldownMin,
      steerCooldownMax,
      steerCooldown: randomBetween(steerCooldownMin, steerCooldownMax),
      burstCooldownMin,
      burstCooldownMax,
      burstCooldown: randomBetween(burstCooldownMin, burstCooldownMax),
      burstStrength: randomBetween(46, 84) * speedScale * roundBurstBoost * iPadBurstBoost,
      wallKick: randomBetween(1.05, 1.13) * roundKickBoost * iPadKickBoost,
      wallJoltMin: 18 * roundKickBoost * iPadKickBoost,
      wallJoltMax: 42 * roundKickBoost * iPadKickBoost,
      radius,
      assetSrc,
      popped: false,
      element: button
    };

    updateBubbleStyle(bubble);
    setBubblePosition(bubble);

    bubbleByElement.set(button, bubble);
    field.appendChild(button);
    bubbles.push(bubble);
  });

  return bubbles;
}

function makeDrifters(laneKey, assets) {
  const field = laneKey === "left" ? ui.leftField : ui.rightField;
  const rect = field.getBoundingClientRect();
  const maxDrifters = state.leanMotion ? 0 : (state.onePlayerMode ? 2 : 4);
  const drifterSpeedScale = state.leanMotion ? 0.7 : 1;
  const drifters = assets.slice(0, Math.min(maxDrifters, assets.length)).map((asset, index) => {
    const node = document.createElement("div");
    node.className = "drifter";
    node.innerHTML = `<img src="${asset.src}" alt="${asset.label}">`;
    const drifter = {
      x: 86 + (index % 2) * ((rect.width - 172) || 120) + Math.random() * 18,
      y: rect.height * 0.6 + Math.floor(index / 2) * 92 + Math.random() * 18,
      vx: (Math.random() * 22 + 12) * drifterSpeedScale * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() * 18 + 10) * drifterSpeedScale * (Math.random() > 0.5 ? 1 : -1),
      radius: rect.width < 420 ? 39 : 55,
      element: node
    };
    setDrifterPosition(drifter);
    field.appendChild(node);
    return drifter;
  });

  return drifters;
}

function clearField(field) {
  [...field.querySelectorAll(".bubble, .drifter")].forEach((node) => node.remove());
}

function setupTask(index) {
  resetBoardPointerSessions();
  const task = tasks[index];
  const drifterAssets = getDrifterAssets(task);
  const modeOptions = getModeOptions(task);
  state.timeLeft = state.timerLimit;
  state.running = false;
  state.motionFrame = 0;
  state.lanes.left.finished = false;
  state.lanes.right.finished = state.onePlayerMode;
  ui.leftStatus.textContent = state.onePlayerMode ? "Wrong pictures deduct points." : "New wave incoming.";
  ui.rightStatus.textContent = state.onePlayerMode ? "" : "New wave incoming.";
  ui.prompt.innerHTML = task.prompt;
  ui.roundPill.textContent = state.onePlayerMode
    ? `Round ${index + 1} / ${tasks.length} · ${task.type} · one player`
    : `Round ${index + 1} / ${tasks.length} · ${task.type}`;
  ui.timer.textContent = String(state.timerLimit);
  ui.progressBar.style.transform = "scaleX(1)";
  ui.hint.textContent = getModeHint(task);
  clearField(ui.leftField);
  clearField(ui.rightField);
  ui.leftField.appendChild(ui.leftFeedback);
  ui.rightField.appendChild(ui.rightFeedback);
  state.lanes.left.drifters = makeDrifters("left", drifterAssets);
  state.lanes.right.drifters = state.onePlayerMode ? [] : makeDrifters("right", drifterAssets);
  state.lanes.left.bubbles = makeBubbles("left", modeOptions, task.target, task.type, index);
  state.lanes.right.bubbles = state.onePlayerMode ? [] : makeBubbles("right", task.options, task.target, task.type, index);
  positionAllBubbles();
  ui.nextBtn.disabled = true;
}

function positionAllBubbles() {
  getActiveLaneKeys().forEach((laneKey) => {
    state.lanes[laneKey].bubbles.forEach((bubble) => {
      setBubblePosition(bubble);
      updateBubbleStyle(bubble);
    });
    state.lanes[laneKey].drifters.forEach((drifter) => {
      setDrifterPosition(drifter);
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

  const scoreRules = getScoreRules();
  bubble.popped = true;
  bubble.element.classList.add("is-popped");

  if (bubble.correct) {
    playCorrectSound();
    addLaneScore(side, scoreRules.correct);
    if (side === "left") {
      ui.leftStatus.textContent = `Great hit: ${bubble.text}`;
    } else {
      ui.rightStatus.textContent = `Great hit: ${bubble.text}`;
    }
    showFeedback(side, `+${scoreRules.correct}`, "good");
  } else {
    playWrongSound();
    addLaneScore(side, -scoreRules.wrong);
    if (side === "left") {
      ui.leftStatus.textContent = `Oops: ${bubble.text}`;
    } else {
      ui.rightStatus.textContent = `Oops: ${bubble.text}`;
    }
    showFeedback(side, `-${scoreRules.wrong}`, "bad");
  }

  updateScores();
  checkLaneCompletion(side);
}

function updateScores() {
  ui.leftScore.textContent = state.leftScore;
  ui.rightScore.textContent = state.rightScore;
}

function checkLaneCompletion(side) {
  const scoreRules = getScoreRules();
  const lane = state.lanes[side];
  if (lane.finished) {
    return;
  }
  const remainingCorrect = lane.bubbles.some((bubble) => bubble.correct && !bubble.popped);
  if (!remainingCorrect) {
    lane.finished = true;
    const bonus = Math.ceil(state.timeLeft) * scoreRules.clearMultiplier;
    addLaneScore(side, bonus);
    if (side === "left") {
      ui.leftStatus.textContent = `${state.onePlayerMode ? "Round" : "Lane"} clear! Bonus +${bonus}`;
    } else {
      ui.rightStatus.textContent = `Lane clear! Bonus +${bonus}`;
    }
    updateScores();
    showFeedback(side, `Clear +${bonus}`, "good");
  }

  if ((state.onePlayerMode && state.lanes.left.finished) || (state.lanes.left.finished && state.lanes.right.finished)) {
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
  ui.leftStatus.textContent = state.onePlayerMode
    ? "Tap or swipe the correct pictures!"
    : state.touchBoardMode ? "Tap or swipe! Your half is touch-locked." : "Pop the right words!";
  ui.rightStatus.textContent = state.onePlayerMode
    ? ""
    : state.touchBoardMode ? "Tap or swipe! Your half is touch-locked." : "Pop the right words!";
  ui.nextBtn.disabled = true;
}

function finishRound() {
  if (!state.running) {
    return;
  }

  state.running = false;
  ui.nextBtn.disabled = false;
  ui.leftStatus.textContent = state.lanes.left.finished ? ui.leftStatus.textContent : "Round over.";
  ui.rightStatus.textContent = state.onePlayerMode ? "" : (state.lanes.right.finished ? ui.rightStatus.textContent : "Round over.");

  if (state.currentTaskIndex === tasks.length - 1) {
    finishMatch();
  }
}

function finishOnePlayerMatch(options = {}) {
  const endedEarly = Boolean(options.endedEarly);
  const score = state.leftScore;
  const beatGoal = score > ONE_PLAYER_SCORE_TARGET;
  ui.nextBtn.disabled = true;
  ui.leftStatus.textContent = endedEarly ? "One Player Mode ended early." : "One Player Mode complete.";
  ui.rightStatus.textContent = "";
  ui.hint.textContent = beatGoal
    ? "Reset Match to play One Player Mode again, or switch back to two players."
    : "Try again and get 300 points.";

  if (beatGoal) {
    closeResultPanel();
    ui.winnerTeam.textContent = "Congratulations!";
    ui.winnerResult.textContent = endedEarly
      ? `You scored ${score} points in One Player Mode.`
      : `You scored ${score} points and beat the 300-point goal!`;
    seedWinnerStars();
    seedWinnerConfetti();
    ui.winnerBanner.classList.remove("hidden");
    playWinnerSound();
    return;
  }

  ui.winnerBanner.classList.add("hidden");
  openResultPanel("Try Again", `Try again and get 300 points. You scored ${score} points.`);
}

function finishMatch(options = {}) {
  const endedEarly = Boolean(options.endedEarly);
  closeEndPanel({ resume: false, returnFocus: false });
  closeOnePlayerPanel({ resume: false, returnFocus: false });
  state.running = false;
  state.ended = true;

  if (state.onePlayerMode) {
    finishOnePlayerMatch({ endedEarly });
    return;
  }

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
    ui.leftStatus.textContent = state.onePlayerMode
      ? "Tap or swipe the correct pictures!"
      : state.touchBoardMode ? "Tap or swipe! Your half is touch-locked." : "Pop the right words!";
    ui.rightStatus.textContent = state.onePlayerMode
      ? ""
      : state.touchBoardMode ? "Tap or swipe! Your half is touch-locked." : "Pop the right words!";
  }

  state.endPanelResume = false;

  if (returnFocus) {
    ui.endBtn.focus();
  }
}

function confirmEndPanel() {
  const enteredCode = ui.endCodeInput.value.trim();
  if (enteredCode !== ONE_PLAYER_PASSCODE) {
    ui.endStatus.textContent = "Wrong code. The game is still on.";
    ui.endCodeInput.focus();
    ui.endCodeInput.select();
    return;
  }

  finishMatch({ endedEarly: true });
}

function openOnePlayerPanel() {
  if (state.onePlayerMode || !ui.onePlayerPanel) {
    return;
  }

  state.onePlayerPanelResume = state.running;
  state.running = false;
  ui.onePlayerPanel.classList.remove("hidden");
  ui.onePlayerPanel.setAttribute("aria-hidden", "false");
  ui.onePlayerStatus.textContent = "";
  ui.onePlayerCodeInput.value = "";
  window.setTimeout(() => {
    ui.onePlayerCodeInput.focus();
    ui.onePlayerCodeInput.select();
  }, 20);
}

function closeOnePlayerPanel(options = {}) {
  const { resume = true, returnFocus = true } = options;
  if (!ui.onePlayerPanel || ui.onePlayerPanel.classList.contains("hidden")) {
    state.onePlayerPanelResume = false;
    return;
  }

  ui.onePlayerPanel.classList.add("hidden");
  ui.onePlayerPanel.setAttribute("aria-hidden", "true");
  ui.onePlayerCodeInput.value = "";
  ui.onePlayerStatus.textContent = "";

  if (resume && !state.ended && state.onePlayerPanelResume) {
    state.running = true;
    state.lastTick = performance.now();
    ui.leftStatus.textContent = state.touchBoardMode
      ? "Tap or swipe! Your half is touch-locked."
      : "Pop the right words!";
    ui.rightStatus.textContent = state.touchBoardMode
      ? "Tap or swipe! Your half is touch-locked."
      : "Pop the right words!";
  }

  state.onePlayerPanelResume = false;

  if (returnFocus) {
    ui.onePlayerBtn.focus();
  }
}

function confirmOnePlayerPanel() {
  const enteredCode = ui.onePlayerCodeInput.value.trim();
  if (enteredCode !== ONE_PLAYER_PASSCODE) {
    ui.onePlayerStatus.textContent = "Wrong code. Two player mode stays on.";
    ui.onePlayerCodeInput.focus();
    ui.onePlayerCodeInput.select();
    return;
  }

  closeOnePlayerPanel({ resume: false, returnFocus: false });
  state.onePlayerMode = true;
  applyModeLayout();
  resetMatch();
}

function openResultPanel(title, copy) {
  ui.resultTitle.textContent = title;
  ui.resultCopy.textContent = copy;
  ui.resultPanel.classList.remove("hidden");
  ui.resultPanel.setAttribute("aria-hidden", "false");
  window.setTimeout(() => ui.resultCloseBtn.focus(), 20);
}

function closeResultPanel() {
  if (!ui.resultPanel || ui.resultPanel.classList.contains("hidden")) {
    return;
  }
  ui.resultPanel.classList.add("hidden");
  ui.resultPanel.setAttribute("aria-hidden", "true");
}

function nextRound() {
  if (state.currentTaskIndex < tasks.length - 1) {
    state.currentTaskIndex += 1;
    setupTask(state.currentTaskIndex);
  }
}

function resetMatch() {
  closeEndPanel({ resume: false, returnFocus: false });
  closeOnePlayerPanel({ resume: false, returnFocus: false });
  closeResultPanel();
  state.currentTaskIndex = 0;
  state.leftScore = 0;
  state.rightScore = 0;
  state.ended = false;
  state.running = false;
  applyModeLayout();
  updateScores();
  if (ui.winnerStars) {
    ui.winnerStars.querySelectorAll(".generated-star").forEach((star) => star.remove());
  }
  if (ui.winnerConfetti) {
    ui.winnerConfetti.querySelectorAll(".generated-confetti").forEach((piece) => piece.remove());
  }
  ui.winnerBanner.classList.add("hidden");
  setupTask(0);
  ui.hint.textContent = state.onePlayerMode
    ? "One Player Mode: wrong pictures deduct points."
    : getTouchBoardInstruction();
}

function updateMotion(dt) {
  state.motionFrame += 1;
  const updateBubbleDynamics = !state.leanMotion;

  getActiveLaneKeys().forEach((laneKey) => {
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
        bubble.steerCooldown = randomBetween(bubble.steerCooldownMin, bubble.steerCooldownMax);
      }

      if (bubble.burstCooldown <= 0) {
        burstBubbleCourse(bubble);
        bubble.burstCooldown = randomBetween(bubble.burstCooldownMin, bubble.burstCooldownMax);
      }

      bubble.vx += bubble.steerX * dt;
      bubble.vy += bubble.steerY * dt;
      clampBubbleSpeed(bubble);

      bubble.x += bubble.vx * dt;
      bubble.y += bubble.vy * dt;

      if (bubble.x - bubble.radius < 10) {
        bubble.x = bubble.radius + 10;
        bubble.vx = Math.abs(bubble.vx) * bubble.wallKick;
        bubble.vy += randomSigned(bubble.wallJoltMin, bubble.wallJoltMax);
        clampBubbleSpeed(bubble);
      }
      if (bubble.x + bubble.radius > width - 10) {
        bubble.x = width - bubble.radius - 10;
        bubble.vx = -Math.abs(bubble.vx) * bubble.wallKick;
        bubble.vy += randomSigned(bubble.wallJoltMin, bubble.wallJoltMax);
        clampBubbleSpeed(bubble);
      }
      if (bubble.y - bubble.radius < 10) {
        bubble.y = bubble.radius + 10;
        bubble.vy = Math.abs(bubble.vy) * bubble.wallKick;
        bubble.vx += randomSigned(bubble.wallJoltMin, bubble.wallJoltMax);
        clampBubbleSpeed(bubble);
      }
      if (bubble.y + bubble.radius > height - 10) {
        bubble.y = height - bubble.radius - 10;
        bubble.vy = -Math.abs(bubble.vy) * bubble.wallKick;
        bubble.vx += randomSigned(bubble.wallJoltMin, bubble.wallJoltMax);
        clampBubbleSpeed(bubble);
      }

      setBubblePosition(bubble);
      if (updateBubbleDynamics) {
        updateBubbleStyle(bubble);
      }
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

      setDrifterPosition(drifter);
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
  maybeAutoLockFullscreen();
  if (state.ended) {
    resetMatch();
  }
  ensureAudio();
  startRound();
});

ui.coverStartBtn.addEventListener("click", () => {
  maybeAutoLockFullscreen();
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

ui.onePlayerBtn.addEventListener("click", () => {
  if (state.onePlayerMode) {
    state.onePlayerMode = false;
    applyModeLayout();
    resetMatch();
    return;
  }
  closeEndPanel({ resume: false, returnFocus: false });
  openOnePlayerPanel();
});

ui.endCancelBtn.addEventListener("click", () => {
  closeEndPanel();
});

ui.endConfirmBtn.addEventListener("click", () => {
  confirmEndPanel();
});

ui.onePlayerCancelBtn.addEventListener("click", () => {
  closeOnePlayerPanel();
});

ui.onePlayerConfirmBtn.addEventListener("click", () => {
  confirmOnePlayerPanel();
});

ui.resultCloseBtn.addEventListener("click", () => {
  closeResultPanel();
  ui.startBtn.focus();
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

ui.onePlayerCodeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmOnePlayerPanel();
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeOnePlayerPanel();
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

function handleFullscreenChange() {
  updateFullscreenButton();
  if (state.fullscreenLocked && !isFullscreenActive()) {
    scheduleFullscreenRestore();
  }
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("touchmove", preventFullscreenGestures, { passive: false });
document.addEventListener("gesturestart", preventFullscreenGestures, { passive: false });
document.addEventListener("gesturechange", preventFullscreenGestures, { passive: false });

if (ui.bottomTouchGuard) {
  ui.bottomTouchGuard.addEventListener("pointerdown", absorbBottomEdgeTouch, { passive: false });
  ui.bottomTouchGuard.addEventListener("pointerup", absorbBottomEdgeTouch, { passive: false });
  ui.bottomTouchGuard.addEventListener("touchstart", absorbBottomEdgeTouch, { passive: false });
  ui.bottomTouchGuard.addEventListener("touchmove", absorbBottomEdgeTouch, { passive: false });
  ui.bottomTouchGuard.addEventListener("touchend", absorbBottomEdgeTouch, { passive: false });
  ui.bottomTouchGuard.addEventListener("click", absorbBottomEdgeTouch);
}

window.addEventListener("resize", () => {
  applyTouchBoardProfile();
  applyMotionProfile();
  if (!state.ended) {
    setupTask(state.currentTaskIndex);
    ui.leftStatus.textContent = "Screen resized. Tap Start Battle again.";
    ui.rightStatus.textContent = state.onePlayerMode ? "" : "Screen resized. Tap Start Battle again.";
  }
});

setupSplitScreenInput();
applyTouchBoardProfile();
applyMotionProfile();
resetMatch();
updateAudioButton();
updateFullscreenButton();
state.lastTick = performance.now();
requestAnimationFrame(animate);
