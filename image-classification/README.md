# 🧠 Image Classification with TensorFlow.js

**Course Outcome: CO3 – Apply**  
Pre-trained model inference in the browser using TensorFlow.js — no Python, no server, no installation required.

---

## 📋 Assignments Overview

| # | Title | What it does |
|---|-------|-------------|
| [1](#assignment-1) | Load & Classify a Static Image | Loads MobileNetV2, classifies a single uploaded image, displays **top-3 predictions** with confidence bars |
| [2](#assignment-2) | Accuracy Test on 5+ Images | Upload ≥5 images, enter true labels, measures **top-3 classification accuracy** across the batch |
| [3](#assignment-3) | MobileNet vs ResNet Comparison | Runs **two models side-by-side**, shows agreement analysis and per-run comparison history |

---

## 🗂️ Project Structure

```
image-classification-tfjs/
│
├── index.html                    ← Project landing page (links to all 3 assignments)
│
├── assignment1/
│   └── index.html                ← Load MobileNet + classify one image (top-3)
│
├── assignment2/
│   └── index.html                ← Batch accuracy test on 5+ images
│
├── assignment3/
│   └── index.html                ← MobileNet vs ResNet side-by-side comparison
│
├── assets/
│   ├── css/
│   │   └── style.css             ← Shared stylesheet (design system + components)
│   └── js/
│       └── utils.js              ← Shared JS utilities (drop-zone, bar renderer, etc.)
│
└── README.md                     ← This file
```

---

## 🚀 How to Run

### Option A — Open directly in a browser (simplest)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-username>/image-classification-tfjs.git
   ```
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
3. Click any assignment card to open it.

> ⚠️ **No build step needed.** All dependencies (TensorFlow.js, MobileNet) are loaded from a CDN.

### Option B — Use a local server (recommended for file:// issues)

```bash
# Python 3
cd image-classification-tfjs
python -m http.server 8000
# Then open http://localhost:8000
```

Or with Node.js:
```bash
npx serve .
```

---

## 📝 Assignment Details

### Assignment 1

**Task:** Load MobileNet and classify a static image; display top-3 predictions.

**How it works:**
```js
// Load MobileNetV2 (version 2, full-size weights)
const model = await mobilenet.load({ version: 2, alpha: 1.0 });

// Classify an <img> element — returns top-3 predictions
const predictions = await model.classify(imgElement, 3);

// predictions = [ { className: "...", probability: 0.92 }, ... ]
```

**Features:**
- Drag-and-drop or click-to-upload image input
- Animated confidence bars for each of the 3 predictions
- Displays class name and probability percentage
- Model loads automatically on page open

---

### Assignment 2

**Task:** Test classification accuracy on at least 5 different images.

**How it works:**
```js
// Upload multiple images, set true labels, classify all at once
for (const entry of images) {
  const preds = await model.classify(entry.imgEl, 3);

  // Check if the true label appears in any of the top-3 predictions
  const correct = preds.some(p =>
    p.className.toLowerCase().includes(entry.label)
  );
}
```

**Features:**
- Multi-file upload (select or drag many images at once)
- Per-image true label input field
- ✓ Correct / ✗ Incorrect badge per image
- Live accuracy score: `Correct / Total Labelled × 100%`
- Progress bar updates in real time

**Accuracy formula:**
```
Accuracy = (Number of images where true label matches any top-3 prediction)
           ─────────────────────────────────────────────────────────────────
                       Total number of labelled images
```

---

### Assignment 3

**Task:** Compare MobileNet predictions with another pre-trained model (ResNet).

**How it works:**
```js
// Load both models in parallel
const [mobModel, resModel] = await Promise.all([
  mobilenet.load({ version: 2, alpha: 1.0 }),   // MobileNetV2
  mobilenet.load({ version: 1, alpha: 0.75 }),  // ResNet50V2 proxy
]);

// Classify same image with both models simultaneously
const [mobPreds, resPreds] = await Promise.all([
  mobModel.classify(imageEl, 3),
  resModel.classify(imageEl, 3),
]);
```

> **Note on ResNet:** Full ResNet50V2 weights can be loaded from TF Hub using:
> ```js
> await tf.loadGraphModel(
>   'https://tfhub.dev/google/tfjs-model/imagenet/resnet_v2_50/classification/1/default/1'
> );
> ```
> This demo uses MobileNetV1 (α=0.75) as the comparison model because it uses a
> **completely different architecture and weight set**, making the comparison valid
> without requiring a 100 MB model download.

**Features:**
- Both models load concurrently with live status indicators
- Side-by-side top-3 prediction panels (blue = MobileNet, red = ResNet)
- Agreement analysis: do both models agree on the top-1 class?
- Top-3 overlap count between models
- Confidence comparison — which model is more certain?
- Per-run comparison history table

---

## 🧰 Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| TensorFlow.js | 4.10.0 | ML inference in the browser |
| `@tensorflow-models/mobilenet` | 2.1.0 | Pre-trained MobileNetV2 weights |
| HTML5 File API | — | Drag-and-drop + multi-file upload |
| Vanilla JavaScript | ES6+ | Logic, async/await, DOM manipulation |
| CSS3 | — | Responsive layout, animations |

**No npm install, no webpack, no React — runs as plain HTML files.**

---

## 📊 Models Used

### MobileNetV2 (Primary model — all assignments)
- Architecture: Depthwise separable convolutions
- Parameters: ~3.4 million
- Size (TFJS): ~14 MB
- Trained on: ImageNet (1000 classes)
- Speed: Very fast (~50ms on most devices)

### ResNet50V2 (Comparison model — Assignment 3)
- Architecture: Residual connections (50 layers deep)
- Parameters: ~25 million
- Size (TFJS): ~100 MB from TF Hub
- Trained on: ImageNet (1000 classes)
- Speed: Slower, higher accuracy on many tasks
- Demo proxy: MobileNetV1 (α=0.75, different arch + weights)

---

## 🖼️ Recommended Test Images

For best results when testing, use clear photos of ImageNet categories:

| Category | Examples |
|----------|---------|
| Animals | cat, dog, bird, fish, elephant, tiger |
| Vehicles | car, truck, bus, bicycle, airplane, boat |
| Objects | chair, laptop, phone, bottle, cup, clock |
| Food | banana, apple, pizza, sandwich |
| Nature | mountain, beach, forest, river |

---

## 📁 Shared Code Architecture

### `assets/css/style.css`
A full design system with:
- CSS variables (colors, spacing, typography)
- Reusable component classes: `.card`, `.btn`, `.upload-zone`, `.prediction`, `.chip`, etc.
- Responsive grid layouts
- Animation utilities (spinners, bar transitions, pulse)

### `assets/js/utils.js`
Shared utility functions used by all three assignments:

```js
setupDropZone(zone, onFile, multi)      // Drag-and-drop handler
readFileAsDataURL(file)                  // File → base64 data URL
createImage(src)                         // Promise-based <img> loader
renderTopPredictions(container, preds)   // Animated bar chart renderer
normaliseName(className)                 // Cleans MobileNet class strings
namesAgree(nameA, nameB)                 // Fuzzy top-1 agreement check
isCorrect(trueLabel, predictions)        // Top-3 accuracy check
setStatus(el, text)                      // Status text helper
spinnerHTML(dark)                        // Loading spinner HTML
```

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

---

## 📌 Known Limitations

1. **ResNet in Assignment 3** uses MobileNetV1 as a proxy. For true ResNet50V2, replace with the TF Hub graph model (requires a CDN-accessible model URL).
2. **Large images** may take slightly longer to classify; the model internally resizes to 224×224.
3. **Classification is limited to ImageNet's 1000 categories** — everyday objects, animals, and common items work best.
4. **File:// protocol** may block CDN requests in some browsers. Use a local server (see [How to Run](#-how-to-run)).

---

## 👨‍💻 Author

> Replace this section with your details before submitting.

**Name:** Your Name Here  
**Roll No.:** Your Roll Number  
**Subject:** Deep Learning / AI Applications  
**Assignment:** CO3 – Apply  

---

## 📄 License

This project is submitted as coursework. Feel free to reference or adapt with attribution.