/**
 * utils.js — Shared utilities
 * Webcam-based Object Detection with TensorFlow.js
 * CO3 – Apply
 */

"use strict";

/* ─────────────────────────────────────────────────────────────
   WEBCAM UTILITIES
───────────────────────────────────────────────────────────── */

/**
 * Start the webcam and stream into a <video> element.
 * @param {HTMLVideoElement} videoEl
 * @returns {Promise<MediaStream>}
 */
async function startWebcam(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  });
  videoEl.srcObject = stream;
  await new Promise((res) => (videoEl.onloadedmetadata = res));
  await videoEl.play();
  return stream;
}

/**
 * Stop all tracks on a MediaStream.
 * @param {MediaStream} stream
 */
function stopWebcam(stream) {
  if (stream) stream.getTracks().forEach((t) => t.stop());
}

/* ─────────────────────────────────────────────────────────────
   FPS TRACKER
───────────────────────────────────────────────────────────── */

/**
 * Simple FPS counter.
 * Usage:
 *   const fps = new FPSTracker();
 *   fps.tick();          // call once per frame
 *   fps.current          // latest fps value
 *   fps.average          // rolling average
 *   fps.min / fps.max
 */
class FPSTracker {
  constructor(historySize = 60) {
    this.historySize = historySize;
    this.history     = [];
    this.current     = 0;
    this.average     = 0;
    this.min         = Infinity;
    this.max         = 0;
    this._lastTime   = null;
  }

  tick() {
    const now = performance.now();
    if (this._lastTime !== null) {
      const delta = now - this._lastTime;
      const fps   = 1000 / delta;

      this.current = Math.round(fps);
      this.history.push(fps);
      if (this.history.length > this.historySize) this.history.shift();

      this.average = Math.round(this.history.reduce((a, b) => a + b, 0) / this.history.length);
      this.min     = Math.min(this.min, this.current);
      this.max     = Math.max(this.max, this.current);
    }
    this._lastTime = now;
  }

  reset() {
    this.history   = [];
    this.current   = 0;
    this.average   = 0;
    this.min       = Infinity;
    this.max       = 0;
    this._lastTime = null;
  }
}

/* ─────────────────────────────────────────────────────────────
   FPS SPARKLINE CHART (canvas)
───────────────────────────────────────────────────────────── */

/**
 * Draw a sparkline chart of FPS history onto a canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} history   Array of FPS values
 * @param {number} [targetFps=30]
 */
function drawFPSChart(canvas, history, targetFps = 30) {
  const ctx = canvas.getContext("2d");
  const W   = canvas.width  = canvas.offsetWidth * devicePixelRatio;
  const H   = canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.clearRect(0, 0, W, H);

  if (history.length < 2) return;

  const max    = Math.max(...history, targetFps + 5);
  const points = history.slice(-80);                // last 80 samples
  const step   = W / (points.length - 1);

  // Target FPS line
  const targetY = H - (targetFps / max) * H;
  ctx.beginPath();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "rgba(255,209,102,0.35)";
  ctx.lineWidth = 1.5 * devicePixelRatio;
  ctx.moveTo(0, targetY);
  ctx.lineTo(W, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Fill area
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0,   "rgba(6,214,160,0.25)");
  gradient.addColorStop(1,   "rgba(6,214,160,0.0)");

  ctx.beginPath();
  points.forEach((v, i) => {
    const x = i * step;
    const y = H - (v / max) * H;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo((points.length - 1) * step, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  points.forEach((v, i) => {
    const x = i * step;
    const y = H - (v / max) * H;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#06d6a0";
  ctx.lineWidth   = 2 * devicePixelRatio;
  ctx.lineJoin    = "round";
  ctx.stroke();
}

/* ─────────────────────────────────────────────────────────────
   CANVAS LABEL OVERLAY
───────────────────────────────────────────────────────────── */

/**
 * Draw prediction labels directly onto a canvas overlay.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W  Canvas width
 * @param {number} H  Canvas height
 * @param {Array<{className:string, probability:number}>} preds
 */
function drawLabelsOnCanvas(ctx, W, H, preds) {
  if (!preds || preds.length === 0) return;

  const COLORS = ["#06d6a0", "#118ab2", "#ffd166"];
  const PAD    = 14;
  const LINE_H = 28;
  const FONT_SZ = Math.max(13, W * 0.018);

  ctx.font      = `700 ${FONT_SZ}px 'JetBrains Mono', monospace`;
  ctx.textAlign = "left";

  preds.forEach((p, i) => {
    const label = `#${i + 1} ${p.className.split(",")[0]}`;
    const pct   = `${(p.probability * 100).toFixed(1)}%`;
    const text  = `${label}  ${pct}`;

    const metrics  = ctx.measureText(text);
    const boxW     = metrics.width + PAD * 2;
    const boxH     = LINE_H;
    const x        = PAD;
    const y        = PAD + i * (boxH + 6);

    // Background pill
    ctx.fillStyle   = "rgba(0,0,0,0.72)";
    ctx.beginPath();
    ctx.roundRect(x, y, boxW, boxH, 6);
    ctx.fill();

    // Accent left border
    ctx.fillStyle = COLORS[i];
    ctx.fillRect(x, y, 3, boxH);

    // Text
    ctx.fillStyle = COLORS[i];
    ctx.fillText(text, x + PAD, y + boxH * 0.68);
  });
}

/* ─────────────────────────────────────────────────────────────
   MODEL LOADER HELPER
───────────────────────────────────────────────────────────── */

/**
 * Load MobileNetV2 with a status callback.
 * @param {(msg:string)=>void} onStatus
 * @returns {Promise<mobilenet.MobileNet>}
 */
async function loadMobileNet(onStatus) {
  onStatus("⏳ Loading MobileNetV2…");
  const model = await mobilenet.load({ version: 2, alpha: 1.0 });
  onStatus("✅ MobileNetV2 ready.");
  return model;
}

/* ─────────────────────────────────────────────────────────────
   INFERENCE LOOP HELPER
───────────────────────────────────────────────────────────── */

/**
 * Run a continuous inference loop.
 * Returns a controller object with a `.stop()` method.
 *
 * @param {Object} opts
 * @param {mobilenet.MobileNet}  opts.model
 * @param {HTMLVideoElement}     opts.video
 * @param {FPSTracker}           opts.fpsTracker
 * @param {(preds, fps:FPSTracker) => void} opts.onResult
 * @returns {{ stop: () => void }}
 */
function startInferenceLoop({ model, video, fpsTracker, onResult }) {
  let running = true;
  let rafId   = null;

  async function loop() {
    if (!running) return;
    fpsTracker.tick();

    try {
      const preds = await model.classify(video, 3);
      onResult(preds, fpsTracker);
    } catch (_) {}

    rafId = requestAnimationFrame(loop);
  }

  loop();
  return { stop() { running = false; cancelAnimationFrame(rafId); } };
}

/* ─────────────────────────────────────────────────────────────
   MISC
───────────────────────────────────────────────────────────── */

function setStatus(el, msg) { if (el) el.textContent = msg; }

function fpsColor(fps) {
  if (fps >= 20) return "#06d6a0";
  if (fps >= 10) return "#ffd166";
  return "#ef476f";
}

function now() {
  return new Date().toLocaleTimeString();
}

/* Browser global exports */
if (typeof module !== "undefined") {
  module.exports = {
    startWebcam, stopWebcam,
    FPSTracker, drawFPSChart, drawLabelsOnCanvas,
    loadMobileNet, startInferenceLoop,
    setStatus, fpsColor, now,
  };
}