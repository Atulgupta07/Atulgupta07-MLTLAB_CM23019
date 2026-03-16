# 🧠 Sentiment Analysis Lab — TensorFlow.js

A fully in-browser sentiment analysis app built with **TensorFlow.js** that trains and compares two neural network architectures: an **RNN (LSTM)** and a **Dense Bag-of-Words** model — with zero backend required.

## 🌐 Live Demo

> After hosting on GitHub Pages, your URL will be:  
> `https://<your-username>.github.io/sentiment-lab/`

---

## 📁 Project Structure

```
sentiment-lab/
├── index.html          ← Main HTML (3 tabs: Train / Test / Compare)
├── css/
│   └── style.css       ← Dark-themed styling
├── js/
│   ├── data.js         ← Dataset (30 sentences) + tokenizer helpers
│   ├── model.js        ← TF.js model definitions & training logic
│   ├── ui.js           ← DOM rendering helpers (charts, results)
│   └── main.js         ← Entry point: tab switching, button handlers
└── README.md
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Train** | 30-sentence labelled dataset, 20 epochs, live progress bars |
| **RNN Model** | `Embedding(vocab,16) → LSTM(32) → Dense(sigmoid)` |
| **Dense Model** | `Input(vocabSize) → Dense(32,relu) → Dropout(0.3) → Dense(sigmoid)` |
| **Test** | Enter any sentences → confidence scores + Positive / Negative / Neutral labels |
| **Compare** | Side-by-side accuracy, loss, parameter count + Chart.js training curves |

---

## 🚀 Run Locally (VS Code)

### Option A — Open directly in browser
```bash
# Just double-click index.html  OR  right-click → Open with browser
```

### Option B — Use VS Code Live Server (recommended)
1. Install the **Live Server** extension in VS Code  
   (`Ext ID: ritwickdey.LiveServer`)
2. Right-click `index.html` → **Open with Live Server**
3. Browser opens at `http://127.0.0.1:5500`

### Option C — Simple Python server
```bash
cd sentiment-lab
python -m http.server 5500
# Open http://localhost:5500
```

> **Note:** No `npm install` or build step needed — all dependencies load from CDN.

---

## 📤 Deploy to GitHub Pages

### Step 1 — Push to GitHub

```bash
# Inside the sentiment-lab/ folder:
git init
git add .
git commit -m "Initial commit: Sentiment Analysis Lab"

# Create a new repo on github.com, then:
git remote add origin https://github.com/<your-username>/sentiment-lab.git
git branch -M main
git push -u origin main
```

### Step 2 — Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**

Your site will be live at:  
`https://<your-username>.github.io/sentiment-lab/`

---

## 🧪 How It Works

### RNN (LSTM) Model
- Tokenizes sentences into integer sequences (padded to length 15)
- Embedding layer maps each token to a 16-dim dense vector
- LSTM reads the sequence, maintaining hidden state (captures word order)
- Best for nuanced text where context and sequence matter

### Dense (Bag-of-Words) Model
- Converts each sentence to a binary vector (word present = 1)
- Dense layer learns weighted word combinations
- Ignores word order — fast, stable, great for keyword-heavy text

### Confidence Scores
- Score > 0.6 → **Positive**
- Score < 0.4 → **Negative**
- Otherwise → **Neutral**

---

## 🛠 Technologies

- [TensorFlow.js 4.10](https://www.tensorflow.org/js) — in-browser ML
- [Chart.js 4.4](https://www.chartjs.org/) — training curves
- Vanilla HTML / CSS / JS — no framework, no build tool

---

## 📝 License

MIT — free to use and modify.