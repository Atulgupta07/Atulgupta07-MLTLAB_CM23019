/**
 * utils.js — Shared utility functions
 * Image Classification with TensorFlow.js
 * CO3 – Apply | MobileNet + ResNet Comparison
 */

"use strict";

/* ── Drag-and-drop helper ─────────────────────────────────── */
/**
 * Attach drag-and-drop behaviour to a zone element.
 * @param {HTMLElement} zone
 * @param {(file: File) => void} onFile  Called with each dropped image file.
 * @param {boolean} [multi=false]        Accept multiple files.
 */
function setupDropZone(zone, onFile, multi = false) {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;
    multi ? files.forEach(onFile) : onFile(files[0]);
  });
}

/* ── File → dataURL ───────────────────────────────────────── */
/**
 * Read a File object as a base64 data URL.
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ── Create <img> from data URL ───────────────────────────── */
/**
 * Create an HTMLImageElement and wait until it has loaded.
 * @param {string} src  Data URL or remote URL.
 * @returns {Promise<HTMLImageElement>}
 */
function createImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* ── Prediction bar renderer ──────────────────────────────── */
/**
 * Render an animated bar chart of up to 3 predictions into a container.
 * Expects CSS classes: .prediction, .pred-header, .pred-rank, .pred-name,
 * .pred-pct--N, .bar-track, .bar-fill--N
 *
 * @param {HTMLElement} container
 * @param {Array<{className: string, probability: number}>} preds
 * @param {{ colorClass?: string }} [opts]
 */
function renderTopPredictions(container, preds, opts = {}) {
  const RANKS  = ["🥇 #1", "🥈 #2", "🥉 #3"];
  const COLORS  = ["1", "2", "3"];
  const { colorClass } = opts;          // override color class prefix e.g. "mob" / "res"

  container.innerHTML = "";

  preds.forEach((p, i) => {
    const pct   = (p.probability * 100).toFixed(1);
    const label = p.className.split(",")[0];
    const color = colorClass || COLORS[i];

    const div = document.createElement("div");
    div.className = "prediction";
    div.innerHTML = `
      <div class="pred-header">
        <span class="pred-rank">${RANKS[i]}</span>
        <span class="pred-name">${label}</span>
        <span class="pred-pct pred-pct--${color}">${pct}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill bar-fill--${color}" data-width="${p.probability * 100}"></div>
      </div>`;
    container.appendChild(div);
  });

  // Animate bars after paint
  requestAnimationFrame(() => {
    container.querySelectorAll(".bar-fill[data-width]").forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width + "%";
      }, i * 140);
    });
  });
}

/* ── Normalise a class name for comparison ────────────────── */
/**
 * Lower-case, strip trailing commas, take first synonym.
 * @param {string} name
 * @returns {string}
 */
function normaliseName(name) {
  return name.toLowerCase().split(",")[0].trim();
}

/* ── Check if two top-1 names broadly agree ──────────────── */
/**
 * Returns true if one name contains the other (handles multi-word labels).
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function namesAgree(a, b) {
  const na = normaliseName(a);
  const nb = normaliseName(b);
  return (
    na === nb ||
    na.includes(nb) ||
    nb.includes(na) ||
    na.split(" ").some((w) => nb.includes(w) && w.length > 3)
  );
}

/* ── Check if true label matches any top-N prediction ─────── */
/**
 * @param {string} trueLabel
 * @param {Array<{className: string}>} preds
 * @returns {boolean}
 */
function isCorrect(trueLabel, preds) {
  if (!trueLabel) return false;
  const tl = trueLabel.toLowerCase().trim();
  return preds.some((p) => {
    const pn = normaliseName(p.className);
    return pn.includes(tl) || tl.split(" ").some((w) => pn.includes(w) && w.length > 2);
  });
}

/* ── Status text helpers ──────────────────────────────────── */
function setStatus(el, text) {
  if (el) el.textContent = text;
}

/* ── Spinner HTML ─────────────────────────────────────────── */
function spinnerHTML(dark = false) {
  return `<span class="spinner${dark ? "" : " spinner--light"}"></span>`;
}

/* ── Exports (also available as globals in browser) ───────── */
if (typeof module !== "undefined") {
  module.exports = {
    setupDropZone,
    readFileAsDataURL,
    createImage,
    renderTopPredictions,
    normaliseName,
    namesAgree,
    isCorrect,
    setStatus,
    spinnerHTML,
  };
}