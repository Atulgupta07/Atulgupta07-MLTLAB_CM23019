// js/ui.js  –  all DOM rendering helpers

/** Append a line to the training log box */
function logLine(msg) {
  const el = document.getElementById("train-log");
  el.textContent += msg + "\n";
  el.scrollTop = el.scrollHeight;
}

/** Render the dataset preview cards */
function renderDataset() {
  const el = document.getElementById("dataset-preview");
  el.innerHTML = DATASET.map(([sentence, label]) => {
    const cls  = label ? "badge-pos" : "badge-neg";
    const icon = label ? "✅ POS" : "❌ NEG";
    return `<div class="ds-row">
      <span class="badge ${cls}">${icon}</span>
      <span>${sentence}</span>
    </div>`;
  }).join("");
}

/** Update RNN training progress bar + status text */
function updateRNNProgress(ep, total, logs) {
  document.getElementById("rnn-bar").style.width = ((ep / total) * 100) + "%";
  document.getElementById("rnn-status").textContent =
    `Epoch ${ep}/${total} — acc: ${(logs.acc * 100).toFixed(1)}%  loss: ${logs.loss.toFixed(3)}`;
}

/** Update Dense training progress bar + status text */
function updateDenseProgress(ep, total, logs) {
  document.getElementById("dense-bar").style.width = ((ep / total) * 100) + "%";
  document.getElementById("dense-status").textContent =
    `Epoch ${ep}/${total} — acc: ${(logs.acc * 100).toFixed(1)}%  loss: ${logs.loss.toFixed(3)}`;
}

/** Fill Compare tab metrics */
function fillCompareMetrics(rnnParams, denseParams) {
  const rnnFinal   = rnnHistory[rnnHistory.length - 1];
  const denseFinal = denseHistory[denseHistory.length - 1];

  document.getElementById("c-rnn-acc").textContent    = (rnnFinal.acc   * 100).toFixed(1) + "%";
  document.getElementById("c-rnn-loss").textContent   = rnnFinal.loss.toFixed(3);
  document.getElementById("c-rnn-params").textContent = rnnParams.toLocaleString();

  document.getElementById("c-dense-acc").textContent    = (denseFinal.acc   * 100).toFixed(1) + "%";
  document.getElementById("c-dense-loss").textContent   = denseFinal.loss.toFixed(3);
  document.getElementById("c-dense-params").textContent = denseParams.toLocaleString();
}

/** Draw Chart.js accuracy/loss comparison chart */
let chartInstance = null;
function drawCompareChart() {
  const labels = rnnHistory.map((_, i) => i + 1);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(document.getElementById("compare-chart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "RNN accuracy",
          data: rnnHistory.map(h => +(h.acc * 100).toFixed(2)),
          borderColor: "#4d90fe",
          backgroundColor: "transparent",
          tension: 0.3,
          pointRadius: 2,
        },
        {
          label: "Dense accuracy",
          data: denseHistory.map(h => +(h.acc * 100).toFixed(2)),
          borderColor: "#34c78a",
          backgroundColor: "transparent",
          tension: 0.3,
          pointRadius: 2,
        },
        {
          label: "RNN loss",
          data: rnnHistory.map(h => +h.loss.toFixed(4)),
          borderColor: "#4d90fe",
          backgroundColor: "transparent",
          tension: 0.3,
          borderDash: [5, 4],
          pointRadius: 2,
        },
        {
          label: "Dense loss",
          data: denseHistory.map(h => +h.loss.toFixed(4)),
          borderColor: "#34c78a",
          backgroundColor: "transparent",
          tension: 0.3,
          borderDash: [5, 4],
          pointRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#7b82b4", font: { size: 11 }, boxWidth: 12 },
        },
      },
      scales: {
        x: {
          ticks: { color: "#7b82b4", font: { size: 10 } },
          grid:  { color: "#2e3250" },
          title: { display: true, text: "Epoch", color: "#7b82b4", font: { size: 11 } },
        },
        y: {
          ticks: { color: "#7b82b4", font: { size: 10 } },
          grid:  { color: "#2e3250" },
          title: { display: true, text: "Value", color: "#7b82b4", font: { size: 11 } },
        },
      },
    },
  });
}

/** Fill architecture analysis notes */
function fillArchNotes() {
  document.getElementById("arch-notes").innerHTML = `
    <strong>RNN (LSTM):</strong> The embedding layer projects each word index into a dense 16-dimensional vector. The LSTM reads the sequence left-to-right while maintaining hidden state, so it can capture word order and context (e.g. "not bad" vs "bad"). This makes it stronger for nuanced, longer sentences.<br><br>
    <strong>Dense (Bag-of-Words):</strong> Converts the sentence to a binary vector where each slot = "word present/absent". The dense layer learns weighted combinations of word signals. Word order is lost, but the model trains faster and is highly stable on small datasets.<br><br>
    <strong>Small dataset insight:</strong> With only 30 sentences both models can overfit quickly. The Dense BoW model typically converges faster due to fewer parameters. The LSTM model benefits more from larger corpora where sequence-level reasoning matters. On production datasets (10k+ samples) the LSTM advantage becomes clear.
  `;
}

/** Render a list of prediction results into a container */
function renderResultRows(containerId, rows, scoreKey) {
  document.getElementById(containerId).innerHTML = rows
    .map(({ line, [scoreKey]: score }) => {
      const pct     = (score * 100).toFixed(1);
      const label   = score > 0.6 ? "Positive" : score < 0.4 ? "Negative" : "Neutral";
      const cls     = score > 0.6 ? "badge-pos" : score < 0.4 ? "badge-neg" : "badge-neu";
      const barClr  = score > 0.6 ? "#34c78a" : score < 0.4 ? "#f25f5c" : "#7b82b4";
      return `<div class="result-row">
        <span class="result-text">${line}</span>
        <span class="badge ${cls}">${label}</span>
        <div class="result-conf">
          <div class="conf-label">${pct}%</div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${pct}%; background:${barClr};"></div>
          </div>
        </div>
      </div>`;
    })
    .join("");
}