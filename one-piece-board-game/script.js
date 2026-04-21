const piecesData = [
  { id: "luffy", name: "Luffy", src: "./assets/processed/luffy.png", x: 70, y: 80, rotation: -7, group: 0 },
  { id: "zoro", name: "Zoro", src: "./assets/processed/zoro.png", x: 250, y: 110, rotation: 4, group: 0 },
  { id: "sanji", name: "Sanji", src: "./assets/processed/sanji.png", x: 430, y: 92, rotation: -4, group: 0 },
  { id: "nami", name: "Nami", src: "./assets/processed/nami.png", x: 970, y: 88, rotation: 5, group: 0 },
  { id: "chopper", name: "Chopper", src: "./assets/processed/chopper.png", x: 1160, y: 120, rotation: -5, group: 0 },
  { id: "robin", name: "Robin", src: "./assets/processed/robin.png", x: 240, y: 620, rotation: -2, group: 0 },
  { id: "vivi", name: "Vivi", src: "./assets/processed/vivi.png", x: 440, y: 640, rotation: 6, group: 1 },
  { id: "brook", name: "Brook", src: "./assets/processed/brook.png", x: 645, y: 585, rotation: -6, group: 1 },
  { id: "jinbe", name: "Jinbe", src: "./assets/processed/jinbe.png", x: 850, y: 626, rotation: 2, group: 1 },
  { id: "franky", name: "Franky", src: "./assets/processed/franky.png", x: 1050, y: 618, rotation: -5, group: 1 },
  { id: "usopp", name: "Usopp", src: "./assets/processed/usopp.png", x: 635, y: 295, rotation: 0, group: 1 }
];

const SCREEN_BOARD_CODE = "143";
const SCREEN_BOARD_DEFAULT_COLOR = "#f04646";
const VIEWPORT_LOCKED_CONTENT = "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
const DOUBLE_TAP_ZOOM_DELAY = 350;

const board = document.getElementById("board");
const viewportMeta = document.querySelector('meta[name="viewport"]');
const playZone = document.getElementById("playZone");
const resetButton = document.getElementById("resetButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const screenBoardButton = document.getElementById("screenBoardButton");
const coverBadges = [
  document.getElementById("coverBadgeA"),
  document.getElementById("coverBadgeB")
];
const coverScreen = document.getElementById("coverScreen");
const startButton = document.getElementById("startButton");
const ipadHint = document.getElementById("ipadHint");
const closeHintButton = document.getElementById("closeHintButton");
const screenBoardGate = document.getElementById("screenBoardGate");
const screenBoardForm = document.getElementById("screenBoardForm");
const screenBoardCodeInput = document.getElementById("screenBoardCodeInput");
const screenBoardError = document.getElementById("screenBoardError");
const screenBoardCancelButton = document.getElementById("screenBoardCancelButton");
const screenBoardOverlay = document.getElementById("screenBoardOverlay");
const screenBoardCanvas = document.getElementById("screenBoardCanvas");
const screenBoardToolButtons = [...document.querySelectorAll(".screen-board-tool")];
const screenBoardClearButton = document.getElementById("screenBoardClearButton");
const screenBoardCloseButton = document.getElementById("screenBoardCloseButton");

const state = {
  zIndex: 10,
  pieces: new Map(),
  pseudoFullscreen: false,
  covers: coverBadges.map(() => ({
    x: 0,
    y: 0,
    pointerId: null,
    homeX: 0,
    homeY: 0,
    dragOffsetX: 0,
    dragOffsetY: 0,
    resetTimer: null
  })),
  screenBoard: {
    isGateOpen: false,
    isOpen: false,
    activeTool: "pen",
    activeColor: SCREEN_BOARD_DEFAULT_COLOR,
    pointerId: null,
    lastPoint: null,
    ctx: null
  },
  zoomLock: {
    lastTouchEnd: 0
  }
};

function isScreenBoardBlocking() {
  return state.screenBoard.isGateOpen || state.screenBoard.isOpen;
}

function updateViewportHeight() {
  if (isStandaloneIOSApp()) {
    document.documentElement.style.removeProperty("--app-height");
    return;
  }
  const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${viewportHeight}px`);
}

function isIOSLike() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandaloneIOSApp() {
  return window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;
}

function lockViewportZoom() {
  if (viewportMeta) {
    viewportMeta.setAttribute("content", VIEWPORT_LOCKED_CONTENT);
  }
}

function preventZoomGestures(event) {
  if (!isIOSLike()) {
    return;
  }
  event.preventDefault();
}

function preventMultiTouchZoom(event) {
  if (!isIOSLike()) {
    return;
  }
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}

function preventDoubleTapZoom(event) {
  if (!isIOSLike()) {
    return;
  }

  const now = Date.now();
  if (now - state.zoomLock.lastTouchEnd <= DOUBLE_TAP_ZOOM_DELAY) {
    event.preventDefault();
  }
  state.zoomLock.lastTouchEnd = now;
}

function supportsNativeFullscreen() {
  return Boolean(
    board.requestFullscreen ||
    board.webkitRequestFullscreen ||
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullscreen
  );
}

function getFullscreenElement() {
  return state.pseudoFullscreen
    ? board
    : document.fullscreenElement || document.webkitFullscreenElement || null;
}

function setPseudoFullscreen(active) {
  state.pseudoFullscreen = active;
  board.classList.toggle("pseudo-fullscreen", active);
  document.body.classList.toggle("pseudo-fullscreen", active);
  if (active) {
    updateViewportHeight();
    window.scrollTo(0, 0);
  }
}

async function requestBoardFullscreen() {
  if (isIOSLike() && !isStandaloneIOSApp()) {
    ipadHint.classList.remove("hidden");
    return;
  }

  if (isIOSLike() && supportsNativeFullscreen()) {
    try {
      if (board.requestFullscreen) {
        await board.requestFullscreen();
        return;
      }
      if (board.webkitRequestFullscreen) {
        board.webkitRequestFullscreen();
        return;
      }
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        return;
      }
      if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
        return;
      }
    } catch (error) {
      // Fall through to pseudo fullscreen if native fullscreen fails on iPad Safari.
    }
  }

  if (isIOSLike()) {
    setPseudoFullscreen(true);
    syncFullscreenButton();
    handleResize();
    return;
  }
  if (board.requestFullscreen) {
    await board.requestFullscreen();
    return;
  }
  if (board.webkitRequestFullscreen) {
    board.webkitRequestFullscreen();
  }
}

async function exitAnyFullscreen() {
  if (state.pseudoFullscreen) {
    setPseudoFullscreen(false);
    closeIpadHint();
    syncFullscreenButton();
    handleResize();
    return;
  }
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function boardBounds() {
  return {
    width: board.clientWidth,
    height: board.clientHeight
  };
}

function rectWithinBoard(element) {
  const boardRect = board.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - boardRect.left,
    y: rect.top - boardRect.top,
    width: rect.width,
    height: rect.height
  };
}

function zoneInnerBounds(zoneElement, topInset = 88, sideInset = 22, bottomInset = 24) {
  const rect = rectWithinBoard(zoneElement);
  return {
    x: rect.x + sideInset,
    y: rect.y + topInset,
    width: Math.max(0, rect.width - sideInset * 2),
    height: Math.max(0, rect.height - topInset - bottomInset)
  };
}

function dockBounds(group = 0) {
  const bounds = boardBounds();
  const x = Math.max(64, bounds.width * 0.085);
  const width = Math.min(290, bounds.width * 0.27);
  const gap = Math.max(26, bounds.height * 0.05);
  const availableHeight = Math.max(340, bounds.height * 0.78);
  const height = Math.max(150, (availableHeight - gap) / 2);
  const startY = Math.max(86, bounds.height * 0.16);
  const y = startY + group * (height + gap);
  return { x, y, width, height };
}

function positionCover(group, x, y) {
  const coverState = state.covers[group];
  const coverBadge = coverBadges[group];
  coverState.x = x;
  coverState.y = y;
  coverBadge.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function updateCoverLayout() {
  coverBadges.forEach((coverBadge, group) => {
    const zone = dockBounds(group);
    const coverWidth = coverBadge.offsetWidth;
    const coverHeight = coverBadge.offsetHeight;
    const x = zone.x + (zone.width - coverWidth) / 2;
    const y = zone.y + (zone.height - coverHeight) / 2;
    state.covers[group].homeX = x;
    state.covers[group].homeY = y;
    positionCover(group, x, y);
  });
}

function queueCoverReturn(group) {
  const coverState = state.covers[group];
  clearTimeout(coverState.resetTimer);
  coverState.resetTimer = window.setTimeout(() => {
    positionCover(group, coverState.homeX, coverState.homeY);
  }, 1000);
}

function startCoverDrag(group, event) {
  if (isScreenBoardBlocking()) {
    return;
  }
  event.preventDefault();
  const coverState = state.covers[group];
  const coverBadge = coverBadges[group];
  clearTimeout(coverState.resetTimer);
  coverState.pointerId = event.pointerId;
  coverBadge.classList.add("active");
  coverBadge.style.zIndex = "2100";
  coverBadge.setPointerCapture(event.pointerId);
  const rect = board.getBoundingClientRect();
  coverState.dragOffsetX = event.clientX - rect.left - coverState.x;
  coverState.dragOffsetY = event.clientY - rect.top - coverState.y;
}

function dragCover(group, event) {
  const coverState = state.covers[group];
  const coverBadge = coverBadges[group];
  if (event.pointerId !== coverState.pointerId) {
    return;
  }

  const rect = board.getBoundingClientRect();
  const maxX = Math.max(0, board.clientWidth - coverBadge.offsetWidth);
  const maxY = Math.max(0, board.clientHeight - coverBadge.offsetHeight);
  const x = event.clientX - rect.left - coverState.dragOffsetX;
  const y = event.clientY - rect.top - coverState.dragOffsetY;
  positionCover(group, clamp(x, 0, maxX), clamp(y, 0, maxY));
}

function stopCoverDrag(group, event) {
  const coverState = state.covers[group];
  const coverBadge = coverBadges[group];
  if (event.pointerId !== coverState.pointerId) {
    return;
  }

  coverState.pointerId = null;
  coverBadge.classList.remove("active");
  coverBadge.style.zIndex = "2000";
  queueCoverReturn(group);
}

function createPiece(pieceData) {
  const piece = document.createElement("div");
  piece.className = "piece";
  piece.dataset.id = pieceData.id;
  piece.setAttribute("aria-label", `${pieceData.name} draggable token`);
  piece.setAttribute("role", "img");

  const image = document.createElement("img");
  image.src = pieceData.src;
  image.alt = pieceData.name;
  image.draggable = false;
  image.addEventListener("error", () => {
    if (!image.dataset.fallbackApplied) {
      image.dataset.fallbackApplied = "true";
      image.src = `./${pieceData.id}.png`;
    }
  });

  piece.append(image);
  board.appendChild(piece);

  const internal = {
    element: piece,
    config: { ...pieceData },
    zIndex: state.zIndex,
    currentX: pieceData.x,
    currentY: pieceData.y,
    targetX: pieceData.x,
    targetY: pieceData.y,
    rotation: pieceData.rotation,
    targetRotation: pieceData.rotation,
    velocityX: 0,
    velocityY: 0,
    pointerId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    width: 0,
    height: 0
  };

  piece.addEventListener("pointerdown", (event) => startDrag(event, internal));
  piece.addEventListener("dblclick", () => resetPiece(internal));
  piece.addEventListener("contextmenu", (event) => event.preventDefault());

  state.pieces.set(pieceData.id, internal);
  updatePieceMetrics(internal);
  paintPiece(internal);
}

function updatePieceMetrics(piece) {
  piece.width = piece.element.offsetWidth;
  piece.height = piece.element.offsetHeight;
}

function setPieceTarget(piece, x, y) {
  const bounds = boardBounds();
  const maxX = Math.max(0, bounds.width - piece.width);
  const maxY = Math.max(0, bounds.height - piece.height);
  piece.targetX = clamp(x, 0, maxX);
  piece.targetY = clamp(y, 0, maxY);
}

function setPieceTargetInRect(piece, x, y, rect) {
  const maxX = Math.max(rect.x, rect.x + rect.width - piece.width);
  const maxY = Math.max(rect.y, rect.y + rect.height - piece.height);
  piece.targetX = clamp(x, rect.x, maxX);
  piece.targetY = clamp(y, rect.y, maxY);
}

function paintPiece(piece) {
  piece.element.style.setProperty("--x", `${piece.currentX}px`);
  piece.element.style.setProperty("--y", `${piece.currentY}px`);
  piece.element.style.setProperty("--rotation", `${piece.rotation}deg`);
  piece.element.style.zIndex = String(piece.zIndex);
}

function animate() {
  for (const piece of state.pieces.values()) {
    piece.velocityX += (piece.targetX - piece.currentX) * 0.16;
    piece.velocityY += (piece.targetY - piece.currentY) * 0.16;
    piece.velocityX *= 0.72;
    piece.velocityY *= 0.72;

    piece.currentX += piece.velocityX;
    piece.currentY += piece.velocityY;
    piece.rotation += (piece.targetRotation - piece.rotation) * 0.14;

    if (Math.abs(piece.targetX - piece.currentX) < 0.05) {
      piece.currentX = piece.targetX;
    }
    if (Math.abs(piece.targetY - piece.currentY) < 0.05) {
      piece.currentY = piece.targetY;
    }
    if (Math.abs(piece.targetRotation - piece.rotation) < 0.05) {
      piece.rotation = piece.targetRotation;
    }

    paintPiece(piece);
  }

  requestAnimationFrame(animate);
}

function liftPiece(piece) {
  state.zIndex += 1;
  piece.zIndex = state.zIndex;
  piece.element.style.zIndex = String(piece.zIndex);
}

function startDrag(event, piece) {
  if (isScreenBoardBlocking()) {
    return;
  }
  event.preventDefault();
  updatePieceMetrics(piece);
  piece.pointerId = event.pointerId;
  piece.element.classList.add("active");
  piece.element.setPointerCapture(event.pointerId);
  liftPiece(piece);
  piece.dragOffsetX = event.clientX - piece.targetX - board.getBoundingClientRect().left;
  piece.dragOffsetY = event.clientY - piece.targetY - board.getBoundingClientRect().top;
  piece.velocityX = 0;
  piece.velocityY = 0;

  const onMove = (moveEvent) => dragPiece(moveEvent, piece);
  const onUp = (upEvent) => stopDrag(upEvent, piece, onMove, onUp);

  piece.element.addEventListener("pointermove", onMove);
  piece.element.addEventListener("pointerup", onUp);
  piece.element.addEventListener("pointercancel", onUp);
}

function dragPiece(event, piece) {
  if (event.pointerId !== piece.pointerId) {
    return;
  }

  const rect = board.getBoundingClientRect();
  const x = event.clientX - rect.left - piece.dragOffsetX;
  const y = event.clientY - rect.top - piece.dragOffsetY;

  setPieceTarget(piece, x, y);
  piece.targetRotation = clamp(((event.movementX || 0) * 0.3), -10, 10);
}

function stopDrag(event, piece, onMove, onUp) {
  if (event.pointerId !== piece.pointerId) {
    return;
  }

  piece.pointerId = null;
  piece.targetRotation = piece.config.rotation;
  piece.element.classList.remove("active");
  piece.element.removeEventListener("pointermove", onMove);
  piece.element.removeEventListener("pointerup", onUp);
  piece.element.removeEventListener("pointercancel", onUp);
}

function randomizePiece(piece) {
  updatePieceMetrics(piece);
  const zone = zoneInnerBounds(playZone, 84, 24, 24);
  const maxX = Math.max(0, zone.width - piece.width);
  const maxY = Math.max(0, zone.height - piece.height);
  setPieceTargetInRect(
    piece,
    zone.x + Math.random() * maxX,
    zone.y + Math.random() * maxY,
    zone
  );
  piece.targetRotation = Math.random() * 18 - 9;
  liftPiece(piece);
}

function resetPiece(piece) {
  updatePieceMetrics(piece);
  setPieceTarget(piece, piece.config.x, piece.config.y);
  piece.targetRotation = piece.config.rotation;
  liftPiece(piece);
}

function resetAllPieces() {
  layoutDockPieces();
  updateCoverLayout();
  closeIpadHint();
}

async function toggleFullscreen() {
  try {
    if (!getFullscreenElement()) {
      await requestBoardFullscreen();
      return;
    }
    await exitAnyFullscreen();
  } catch (error) {
    // Ignore unsupported fullscreen requests.
  }
}

function syncFullscreenButton() {
  if (isIOSLike() && !isStandaloneIOSApp()) {
    fullscreenButton.textContent = "ADD TO HOME SCREEN";
    return;
  }
  fullscreenButton.textContent = getFullscreenElement() ? "EXIT FULLSCREEN" : "FULL SCREEN";
}

function syncBrowserState() {
  lockViewportZoom();
  if (!document.fullscreenElement && !document.webkitFullscreenElement && state.pseudoFullscreen && !isIOSLike()) {
    setPseudoFullscreen(false);
  }
  syncFullscreenButton();
}

function preventFullscreenTouchScroll(event) {
  if (getFullscreenElement()) {
    event.preventDefault();
  }
}

function startGame() {
  coverScreen.classList.add("hidden");
}

function closeIpadHint() {
  ipadHint.classList.add("hidden");
}

function setScreenBoardError(message) {
  screenBoardError.textContent = message;
  screenBoardCodeInput.setAttribute("aria-invalid", message ? "true" : "false");
}

function syncScreenBoardToolButtons() {
  screenBoardToolButtons.forEach((button) => {
    const isColorTool = button.dataset.tool === "pen";
    const isActive = isColorTool
      ? state.screenBoard.activeTool === "pen" && button.dataset.color === state.screenBoard.activeColor
      : state.screenBoard.activeTool === "eraser";
    button.classList.toggle("active", isActive);
  });
}

function setScreenBoardTool(tool, color = state.screenBoard.activeColor) {
  state.screenBoard.activeTool = tool;
  if (tool === "pen") {
    state.screenBoard.activeColor = color;
  }
  syncScreenBoardToolButtons();
}

function openScreenBoardGate() {
  if (state.screenBoard.isOpen) {
    return;
  }
  state.screenBoard.isGateOpen = true;
  screenBoardGate.classList.remove("hidden");
  screenBoardGate.setAttribute("aria-hidden", "false");
  setScreenBoardError("");
  screenBoardCodeInput.value = "";
  window.requestAnimationFrame(() => {
    screenBoardCodeInput.focus();
  });
}

function closeScreenBoardGate() {
  state.screenBoard.isGateOpen = false;
  screenBoardGate.classList.add("hidden");
  screenBoardGate.setAttribute("aria-hidden", "true");
  screenBoardCodeInput.value = "";
  setScreenBoardError("");
}

function getCanvasScale() {
  const rect = screenBoardCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return { x: 1, y: 1 };
  }
  return {
    x: screenBoardCanvas.width / rect.width,
    y: screenBoardCanvas.height / rect.height
  };
}

function resizeScreenBoardCanvas() {
  if (!state.screenBoard.isOpen) {
    return;
  }

  const rect = screenBoardCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const nextWidth = Math.max(1, Math.round(rect.width * pixelRatio));
  const nextHeight = Math.max(1, Math.round(rect.height * pixelRatio));

  if (screenBoardCanvas.width === nextWidth && screenBoardCanvas.height === nextHeight) {
    if (!state.screenBoard.ctx) {
      state.screenBoard.ctx = screenBoardCanvas.getContext("2d");
    }
    return;
  }

  const snapshot = document.createElement("canvas");
  if (screenBoardCanvas.width && screenBoardCanvas.height) {
    snapshot.width = screenBoardCanvas.width;
    snapshot.height = screenBoardCanvas.height;
    snapshot.getContext("2d").drawImage(screenBoardCanvas, 0, 0);
  }

  screenBoardCanvas.width = nextWidth;
  screenBoardCanvas.height = nextHeight;
  state.screenBoard.ctx = screenBoardCanvas.getContext("2d");
  state.screenBoard.ctx.lineCap = "round";
  state.screenBoard.ctx.lineJoin = "round";

  if (snapshot.width && snapshot.height) {
    state.screenBoard.ctx.drawImage(snapshot, 0, 0, nextWidth, nextHeight);
  }
}

function getScreenBoardPoint(event) {
  const rect = screenBoardCanvas.getBoundingClientRect();
  const scale = getCanvasScale();
  return {
    x: (event.clientX - rect.left) * scale.x,
    y: (event.clientY - rect.top) * scale.y
  };
}

function applyScreenBoardBrush() {
  const { ctx, activeTool, activeColor } = state.screenBoard;
  if (!ctx) {
    return;
  }

  const scale = getCanvasScale();
  const lineWidth = activeTool === "eraser" ? 26 * scale.x : 6 * scale.x;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;
  ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
  ctx.strokeStyle = activeColor;
  ctx.fillStyle = activeColor;
}

function drawScreenBoardDot(point) {
  const { ctx, activeTool } = state.screenBoard;
  if (!ctx) {
    return;
  }

  applyScreenBoardBrush();
  ctx.beginPath();
  ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fillStyle = activeTool === "eraser" ? "rgba(0, 0, 0, 1)" : state.screenBoard.activeColor;
  ctx.fill();
}

function drawScreenBoardStroke(fromPoint, toPoint) {
  const { ctx } = state.screenBoard;
  if (!ctx) {
    return;
  }

  applyScreenBoardBrush();
  ctx.beginPath();
  ctx.moveTo(fromPoint.x, fromPoint.y);
  ctx.lineTo(toPoint.x, toPoint.y);
  ctx.stroke();
}

function resetScreenBoardPointer() {
  if (state.screenBoard.pointerId !== null && screenBoardCanvas.hasPointerCapture?.(state.screenBoard.pointerId)) {
    screenBoardCanvas.releasePointerCapture(state.screenBoard.pointerId);
  }
  state.screenBoard.pointerId = null;
  state.screenBoard.lastPoint = null;
}

function startScreenBoardDrawing(event) {
  if (!state.screenBoard.isOpen) {
    return;
  }

  event.preventDefault();
  resizeScreenBoardCanvas();
  state.screenBoard.pointerId = event.pointerId;
  state.screenBoard.lastPoint = getScreenBoardPoint(event);
  screenBoardCanvas.setPointerCapture(event.pointerId);
  drawScreenBoardDot(state.screenBoard.lastPoint);
}

function moveScreenBoardDrawing(event) {
  if (event.pointerId !== state.screenBoard.pointerId || !state.screenBoard.lastPoint) {
    return;
  }

  event.preventDefault();
  const nextPoint = getScreenBoardPoint(event);
  drawScreenBoardStroke(state.screenBoard.lastPoint, nextPoint);
  state.screenBoard.lastPoint = nextPoint;
}

function stopScreenBoardDrawing(event) {
  if (event.pointerId !== state.screenBoard.pointerId) {
    return;
  }

  event.preventDefault();
  resetScreenBoardPointer();
}

function clearScreenBoardCanvas() {
  if (!state.screenBoard.ctx) {
    return;
  }
  state.screenBoard.ctx.clearRect(0, 0, screenBoardCanvas.width, screenBoardCanvas.height);
}

function openScreenBoardOverlay() {
  closeScreenBoardGate();
  state.screenBoard.isOpen = true;
  screenBoardOverlay.classList.remove("hidden");
  screenBoardOverlay.setAttribute("aria-hidden", "false");
  board.classList.add("screen-board-open");
  setScreenBoardTool("pen", SCREEN_BOARD_DEFAULT_COLOR);
  window.requestAnimationFrame(() => {
    resizeScreenBoardCanvas();
    screenBoardCloseButton.focus();
  });
}

function closeScreenBoardOverlay() {
  if (!state.screenBoard.isOpen) {
    return;
  }

  resetScreenBoardPointer();
  state.screenBoard.isOpen = false;
  screenBoardOverlay.classList.add("hidden");
  screenBoardOverlay.setAttribute("aria-hidden", "true");
  board.classList.remove("screen-board-open");
}

function handleScreenBoardSubmit(event) {
  event.preventDefault();
  if (screenBoardCodeInput.value.trim() !== SCREEN_BOARD_CODE) {
    setScreenBoardError("Incorrect code. Try again.");
    screenBoardCodeInput.focus();
    screenBoardCodeInput.select();
    return;
  }

  openScreenBoardOverlay();
}

function handleScreenBoardToolClick(event) {
  const { tool, color } = event.currentTarget.dataset;
  if (tool === "eraser") {
    setScreenBoardTool("eraser");
    return;
  }
  setScreenBoardTool("pen", color);
}

function handleScreenBoardEscape(event) {
  if (event.key !== "Escape") {
    return;
  }

  if (state.screenBoard.isGateOpen) {
    event.preventDefault();
    closeScreenBoardGate();
    return;
  }

  if (state.screenBoard.isOpen) {
    event.preventDefault();
    closeScreenBoardOverlay();
  }
}

function shufflePieces() {
  for (const piece of state.pieces.values()) {
    randomizePiece(piece);
  }
}

function handleResize() {
  updateViewportHeight();
  layoutDockPieces(true);
  updateCoverLayout();
  resizeScreenBoardCanvas();
  for (const piece of state.pieces.values()) {
    updatePieceMetrics(piece);
    setPieceTarget(piece, piece.targetX, piece.targetY);
    piece.currentX = clamp(piece.currentX, 0, Math.max(0, board.clientWidth - piece.width));
    piece.currentY = clamp(piece.currentY, 0, Math.max(0, board.clientHeight - piece.height));
  }
}

function layoutDockPieces(preserveActivePositions = false) {
  [0, 1].forEach((group) => {
    const zone = dockBounds(group);
    const entries = [...state.pieces.values()].filter((piece) => piece.config.group === group);
    if (!entries.length) {
      return;
    }

    entries.forEach((piece) => {
      updatePieceMetrics(piece);
      const x = zone.x + (zone.width - piece.width) / 2;
      const y = zone.y + (zone.height - piece.height) / 2;
      piece.config.x = clamp(x, zone.x, zone.x + zone.width - piece.width);
      piece.config.y = clamp(y, zone.y, zone.y + zone.height - piece.height);
      if (!preserveActivePositions) {
        piece.currentX = piece.config.x;
        piece.currentY = piece.config.y;
        piece.targetX = piece.config.x;
        piece.targetY = piece.config.y;
        piece.targetRotation = piece.config.rotation;
      }
    });
  });
}

piecesData.forEach(createPiece);
coverBadges.forEach((coverBadge) => board.appendChild(coverBadge));
resetButton.addEventListener("click", resetAllPieces);
fullscreenButton.addEventListener("click", toggleFullscreen);
screenBoardButton.addEventListener("click", openScreenBoardGate);
screenBoardForm.addEventListener("submit", handleScreenBoardSubmit);
screenBoardCancelButton.addEventListener("click", closeScreenBoardGate);
screenBoardCodeInput.addEventListener("input", () => {
  if (screenBoardError.textContent) {
    setScreenBoardError("");
  }
});
screenBoardGate.addEventListener("click", (event) => {
  if (event.target === screenBoardGate) {
    closeScreenBoardGate();
  }
});
screenBoardCloseButton.addEventListener("click", closeScreenBoardOverlay);
screenBoardClearButton.addEventListener("click", clearScreenBoardCanvas);
screenBoardToolButtons.forEach((button) => {
  button.addEventListener("click", handleScreenBoardToolClick);
});
screenBoardCanvas.addEventListener("pointerdown", startScreenBoardDrawing);
screenBoardCanvas.addEventListener("pointermove", moveScreenBoardDrawing);
screenBoardCanvas.addEventListener("pointerup", stopScreenBoardDrawing);
screenBoardCanvas.addEventListener("pointercancel", stopScreenBoardDrawing);
screenBoardCanvas.addEventListener("lostpointercapture", resetScreenBoardPointer);
document.addEventListener("fullscreenchange", syncFullscreenButton);
document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
document.addEventListener("keydown", handleScreenBoardEscape);
document.addEventListener("gesturestart", preventZoomGestures, { passive: false });
document.addEventListener("gesturechange", preventZoomGestures, { passive: false });
document.addEventListener("gestureend", preventZoomGestures, { passive: false });
document.addEventListener("touchstart", preventMultiTouchZoom, { passive: false });
document.addEventListener("touchmove", preventMultiTouchZoom, { passive: false });
document.addEventListener("touchend", preventDoubleTapZoom, { passive: false });
board.addEventListener("touchmove", preventFullscreenTouchScroll, { passive: false });
coverBadges.forEach((coverBadge, group) => {
  coverBadge.addEventListener("pointerdown", (event) => startCoverDrag(group, event));
  coverBadge.addEventListener("pointermove", (event) => dragCover(group, event));
  coverBadge.addEventListener("pointerup", (event) => stopCoverDrag(group, event));
  coverBadge.addEventListener("pointercancel", (event) => stopCoverDrag(group, event));
});
startButton.addEventListener("click", startGame);
closeHintButton.addEventListener("click", closeIpadHint);
window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", handleResize);
window.addEventListener("pageshow", syncBrowserState);
document.addEventListener("visibilitychange", syncBrowserState);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", handleResize);
  window.visualViewport.addEventListener("scroll", handleResize);
}

if (isStandaloneIOSApp()) {
  document.body.classList.add("standalone-app");
}

lockViewportZoom();
updateViewportHeight();
layoutDockPieces();
updateCoverLayout();
handleResize();
animate();
syncFullscreenButton();
syncScreenBoardToolButtons();
