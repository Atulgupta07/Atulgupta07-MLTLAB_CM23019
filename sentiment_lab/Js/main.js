// js/main.js  –  tab switching, button handlers, app init

// ── Tab switching ──────────────────────────────────────
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(s => s.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById("tab-" + target).classList.add("active");
  });
});

// ── Train both models ──────────────────────────────────
async function trainBoth() {
  const btn = document.getElementById("btn-train");
  btn.disabled = true;
  btn.textContent = "⏳ Training…";

  document.getElementById("train-log").textContent = "";
  logLine("▶ Starting training — RNN (LSTM) model…");

  let rnnDone = false;

  await trainBothModels(
    20,

    // onRNNEpoch
    (ep, total, logs) => {
      updateRNNProgress(ep, total, logs);
      if (ep % 5 === 0 || ep === 1) {
        logLine(`  RNN  epoch ${ep.toString().padStart(2)}/${total}  acc=${(logs.acc * 100).toFixed(1)}%  loss=${logs.loss.toFixed(3)}`);
      }
      if (ep === total && !rnnDone) {
        rnnDone = true;
        logLine("✓ RNN training complete!\n▶ Starting Dense (BoW) model…");
      }
    },

    // onDenseEpoch
    (ep, total, logs) => {
      updateDenseProgress(ep, total, logs);
      if (ep % 5 === 0 || ep === 1) {
        logLine(`  Dense epoch ${ep.toString().padStart(2)}/${total}  acc=${(logs.acc * 100).toFixed(1)}%  loss=${logs.loss.toFixed(3)}`);
      }
    },

    // onDone
    (rnnParams, denseParams) => {
      logLine(`\n✓ Dense training complete!`);
      logLine(`  RNN params:   ${rnnParams.toLocaleString()}`);
      logLine(`  Dense params: ${denseParams.toLocaleString()}`);
      logLine("\n🎉 Both models ready — switch to the Test or Compare tab!");

      fillCompareMetrics(rnnParams, denseParams);
      drawCompareChart();
      fillArchNotes();

      const ab = document.getElementById("btn-analyze");
      ab.disabled = false;
      ab.textContent = "🔍 Analyze sentences";

      btn.disabled = false;
      btn.textContent = "🔄 Retrain models";
    }
  );
}

// ── Analyze custom sentences ───────────────────────────
async function analyzeText() {
  if (!rnnModel || !denseModel) return;

  const lines = document.getElementById("test-input")
    .value.split("\n")
    .map(s => s.trim())
    .filter(Boolean);

  if (!lines.length) return;

  const btn = document.getElementById("btn-analyze");
  btn.disabled = true;
  btn.textContent = "⏳ Analyzing…";

  const results = await predictSentences(lines);

  renderResultRows("rnn-results-list",   results, "rnnScore");
  renderResultRows("dense-results-list", results, "denseScore");

  document.getElementById("results-rnn").style.display   = "block";
  document.getElementById("results-dense").style.display = "block";

  btn.disabled = false;
  btn.textContent = "🔍 Analyze sentences";
}

// ── Init on page load ──────────────────────────────────
window.addEventListener("load", () => {
  // Poll until TF.js is ready
  const interval = setInterval(() => {
    if (window.tf) {
      clearInterval(interval);
      const status = document.getElementById("tf-status");
      status.textContent = "✅ TF.js ready";
      status.className = "badge badge-success";

      buildVocab();
      renderDataset();
    }
  }, 200);
});