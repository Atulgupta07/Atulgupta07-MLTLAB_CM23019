// js/data.js  –  training dataset & tokenization helpers

const DATASET = [
  ["I absolutely love this product, it changed my life!", 1],
  ["This is the best thing I have ever purchased!", 1],
  ["Amazing quality and fast shipping, very happy.", 1],
  ["Highly recommend, exceeded all my expectations.", 1],
  ["Great value for money, works perfectly.", 1],
  ["Wonderful experience from start to finish.", 1],
  ["Fantastic product, I am thoroughly impressed.", 1],
  ["Brilliant! Will definitely buy again.", 1],
  ["So happy with this purchase, five stars!", 1],
  ["Outstanding service and excellent product.", 1],
  ["Good quality item, happy with the result.", 1],
  ["Decent product, arrived on time, no complaints.", 1],
  ["Pretty good overall, would buy again.", 1],
  ["Nice product, works as described.", 1],
  ["Satisfied with my purchase, does the job.", 1],
  ["This is absolute garbage, complete waste of money!", 0],
  ["Terrible product, broke after one day of use.", 0],
  ["Worst purchase I have ever made, deeply disappointed.", 0],
  ["Horrible experience, never buying from here again.", 0],
  ["Complete rubbish, totally useless product.", 0],
  ["Very poor quality, fell apart immediately.", 0],
  ["Awful customer service and defective product.", 0],
  ["Do not buy this, it is a complete scam.", 0],
  ["Disgusting quality, I want a refund immediately.", 0],
  ["Regret buying this, total disappointment.", 0],
  ["Bad product, did not work at all.", 0],
  ["Cheap and nasty, not worth it.", 0],
  ["Overpriced junk, extremely unhappy.", 0],
  ["Poor build quality, broke straight away.", 0],
  ["Dreadful, arrived damaged and missing parts.", 0],
];

const MAX_LEN   = 15;
const VOCAB_SIZE = 200;

let vocab = {};

/** Build word → index vocabulary from dataset */
function buildVocab() {
  let idx = 2;
  vocab = { "<PAD>": 0, "<UNK>": 1 };
  DATASET.forEach(([s]) =>
    s.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).forEach(w => {
      if (!vocab[w]) vocab[w] = idx++;
    })
  );
}

/** Pad / truncate a sentence into a fixed-length integer sequence */
function tokenize(sentence, maxLen = MAX_LEN) {
  const toks = sentence
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .map(w => vocab[w] || 1);

  const padded = Array(maxLen).fill(0);
  const start  = Math.max(0, maxLen - toks.length);
  for (let i = 0; i < Math.min(toks.length, maxLen); i++) {
    padded[start + i] = toks[i];
  }
  return padded;
}

/** Convert a sentence to a binary Bag-of-Words vector */
function toBowVector(sentence) {
  const vec = Array(VOCAB_SIZE).fill(0);
  sentence
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .forEach(w => {
      const i = vocab[w];
      if (i && i < VOCAB_SIZE) vec[i] = 1;
    });
  return vec;
}