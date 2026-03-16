// js/model.js  –  TensorFlow.js model definitions & training

let rnnModel   = null;
let denseModel = null;
let rnnHistory   = [];
let denseHistory = [];

/** RNN: Embedding → LSTM(32) → Dense(sigmoid) */
function buildRNN() {
  const m = tf.sequential();
  m.add(tf.layers.embedding({
    inputDim:    VOCAB_SIZE,
    outputDim:   16,
    inputLength: MAX_LEN
  }));
  m.add(tf.layers.lstm({ units: 32, returnSequences: false }));
  m.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  m.compile({ optimizer: "adam", loss: "binaryCrossentropy", metrics: ["accuracy"] });
  return m;
}

/** Dense BoW: Dense(32,relu) → Dropout(0.3) → Dense(sigmoid) */
function buildDense() {
  const m = tf.sequential();
  m.add(tf.layers.dense({ inputShape: [VOCAB_SIZE], units: 32, activation: "relu" }));
  m.add(tf.layers.dropout({ rate: 0.3 }));
  m.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  m.compile({ optimizer: "adam", loss: "binaryCrossentropy", metrics: ["accuracy"] });
  return m;
}

/** Train both models sequentially; calls UI callbacks each epoch */
async function trainBothModels(EPOCHS = 20, onRNNEpoch, onDenseEpoch, onDone) {
  buildVocab();

  // Build tensors
  const xSeq = tf.tensor2d(DATASET.map(([s]) => tokenize(s)));
  const xBow = tf.tensor2d(DATASET.map(([s]) => toBowVector(s)));
  const y    = tf.tensor1d(DATASET.map(([, l]) => l));

  rnnModel   = buildRNN();
  denseModel = buildDense();
  rnnHistory   = [];
  denseHistory = [];

  // ── Train RNN ──────────────────────────────────────
  await rnnModel.fit(xSeq, y, {
    epochs:    EPOCHS,
    batchSize: 8,
    shuffle:   true,
    callbacks: {
      onEpochEnd: (ep, logs) => {
        rnnHistory.push({ acc: logs.acc, loss: logs.loss });
        onRNNEpoch(ep + 1, EPOCHS, logs);
      }
    }
  });

  // ── Train Dense ────────────────────────────────────
  await denseModel.fit(xBow, y, {
    epochs:    EPOCHS,
    batchSize: 8,
    shuffle:   true,
    callbacks: {
      onEpochEnd: (ep, logs) => {
        denseHistory.push({ acc: logs.acc, loss: logs.loss });
        onDenseEpoch(ep + 1, EPOCHS, logs);
      }
    }
  });

  // Free tensors
  xSeq.dispose();
  xBow.dispose();
  y.dispose();

  onDone(rnnModel.countParams(), denseModel.countParams());
}

/** Run inference on an array of sentences; returns [{line, rnnScore, denseScore}] */
async function predictSentences(sentences) {
  const results = [];
  for (const line of sentences) {
    const seq = tf.tensor2d([tokenize(line)]);
    const bow = tf.tensor2d([toBowVector(line)]);

    const rnnScore   = (await rnnModel.predict(seq).data())[0];
    const denseScore = (await denseModel.predict(bow).data())[0];

    seq.dispose();
    bow.dispose();

    results.push({ line, rnnScore, denseScore });
  }
  return results;
}