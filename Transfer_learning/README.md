# CO4 – Transfer Learning with Images

**Course Outcome 4 (Create)** · TensorFlow.js · Runs entirely in the browser

---

## 📋 Assignment Overview

| Task | Description | Status |
|------|-------------|--------|
| Task 1 | Retrain MobileNet for 3 fruit categories | ✅ |
| Task 2 | Evaluate accuracy + confusion matrix | ✅ |
| Task 3 | Incremental category addition + analysis | ✅ |

---

## 🚀 How to Run

### Option 1 — Open directly (recommended)
Just open `index.html` in any modern browser. No server needed.

### Option 2 — Local server (avoids CORS issues)
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
Then open `http://localhost:8000`

---

## 🧠 Architecture

```
Input Image (any size)
        ↓
  Resize to 224×224
        ↓
MobileNet V2 (FROZEN — pretrained on ImageNet)
        ↓
  Feature Vector (1280-dim)
        ↓
  Dense(128, ReLU)     ← TRAINABLE
        ↓
  Dropout(0.3)         ← TRAINABLE
        ↓
  Dense(N, Softmax)    ← TRAINABLE  (N = number of categories)
        ↓
   Prediction
```

---

## 📁 Project Structure

```
co4-transfer-learning/
├── index.html                    ← Assignment home page
├── README.md                     ← This file
├── task1_retrain/
│   └── index.html               ← Train MobileNet on 3 fruit categories
├── task2_evaluation/
│   └── index.html               ← Confusion matrix + precision/recall/F1
└── task3_incremental/
    └── index.html               ← Add categories, compare performance
```

---

## 📌 Task Details

### Task 1 — Retrain MobileNet
- Load **MobileNet V2** pretrained weights (frozen)
- Upload 5+ images each for **Apple, Banana, Orange**
- Extract 1280-dim feature vectors per image
- Train custom head: `Dense(128) → Dropout(0.3) → Dense(3, softmax)`
- Optimizer: Adam (lr=0.001) | Loss: Categorical Crossentropy | Epochs: 50
- Save trained model to **LocalStorage**

### Task 2 — Evaluate & Confusion Matrix
- Upload separate **validation images** (not used in training)
- Run inference on each image using saved model
- Compute and display:
  - **Overall accuracy**
  - **Confusion matrix** (N×N heatmap)
  - **Per-class**: Precision, Recall, F1 Score
  - Visual sample grid (✓ correct / ✗ wrong)

### Task 3 — Incremental Learning
- Add new categories: **Mango → Grapes → Strawberry** (one at a time)
- Retrain model with all categories combined
- Compare accuracy after each addition
- Analyze **catastrophic forgetting** — does adding new classes hurt old ones?

---

## 🛠 Technologies
- **TensorFlow.js** v4.x (browser-based ML)
- **MobileNet V2** (pretrained on ImageNet, 1.4M parameters)
- **No backend** — everything runs in the browser
- **LocalStorage** for model persistence between tasks

---

## 📊 Expected Results

| Scenario | Expected Accuracy |
|----------|------------------|
| 3 classes, 10 imgs each | 85–95% |
| 3 classes, 5 imgs each  | 70–85% |
| After adding 4th class  | 75–90% |
| After adding 5th class  | 70–88% |

*Higher accuracy = more training images + visual variety in dataset*

---

## 💡 Tips for Better Accuracy
1. Use **10–20 images per class** for training
2. Use **different angles, lighting, backgrounds**
3. Keep training & validation images **separate**
4. For Task 3 validation: re-upload images for old categories too

---

## 🔗 References
- [TensorFlow.js Docs](https://www.tensorflow.org/js)
- [MobileNet Paper](https://arxiv.org/abs/1801.04381)
- [Transfer Learning Guide](https://www.tensorflow.org/js/tutorials/transfer/what_is_transfer_learning)