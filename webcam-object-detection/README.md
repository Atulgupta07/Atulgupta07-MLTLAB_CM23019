# 📷 Webcam-based Object Detection
 

 
---
 
## 📌 About This Project
 
This project implements real-time object detection directly in the browser using **COCO-SSD** and **TensorFlow.js**. No Python, no server, no installation required — just open in a browser, allow camera access, and start detecting.
 
The project is divided into **3 tasks**, each building on the previous one — from basic webcam classification to live video overlay to full performance analysis.
 
---
 
## 📋 Tasks Overview
 
| # | Task | What it does |
|---|------|-------------|
| 1 | Webcam Capture & Classification | Opens webcam, runs MobileNetV2 on live frames, shows top-3 detected objects |
| 2 | Label Overlay on Video Feed | Draws bounding boxes and labels directly on the live video using Canvas API |
| 3 | FPS & Performance Analysis | Tracks FPS, inference time, and generates a performance report |
 
---
 
## 🗂️ Project Structure
 
```
webcam-object-detection/
│
├── index.html              ← Landing page linking all 3 tasks
├── README.md
├── .gitignore
│
├── task1/
│   └── index.html          ← Webcam capture + top-3 classification
│
├── task2/
│   └── index.html          ← Live canvas overlay with bounding boxes
│
├── task3/
│   └── index.html          ← FPS meter + performance report
│
└── assets/
    ├── css/
    │   └── style.css        ← Shared styles for all tasks
    └── js/
        └── utils.js         ← Shared utilities for all tasks
```
 
---
 
## 🚀 How to Run
 
> ⚠️ **Camera requires localhost or HTTPS** — opening via `file://` will block camera access.
 
**Step 1 — Clone the repo**
```bash
git clone https://github.com/Atulgupta07/Atulgupta07-MLTLAB_CM23019.git
cd Atulgupta07-MLTLAB_CM23019/webcam-object-detection
```
 
**Step 2 — Start local server**
```bash
python -m http.server 8000
```
 
**Step 3 — Open browser**
```
http://localhost:8000
```
 
Allow camera access when prompted. Click any task to open it.
 
---
 
## 📝 Task Details
 
### Task 1 — Webcam Capture & Classification
 
Accesses the device camera using the browser's MediaDevices API. Loads MobileNetV2 and runs classification on every live frame. Displays the top 3 predicted objects with their confidence scores and animated probability bars.
 
---
 
### Task 2 — Label Overlay on Video Feed
 
Uses the HTML5 Canvas API to render the video feed and draw detection results on top of it in real time. Each detected object gets a colour-coded bounding box with corner brackets and a label showing the class name and confidence. Includes adjustable label opacity and toggle options for labels and FPS counter.
 
---
 
### Task 3 — FPS & Performance Analysis
 
Measures how fast the model runs by tracking frames per second and the time taken for each detection call. Displays a live sparkline chart of FPS over time, a latency gauge, and a timestamped detection log. When stopped, generates a full performance summary including whether the device is capable of real-time detection.
 
---
 
## 🤖 Why COCO-SSD Instead of MobileNet
 
The project uses **COCO-SSD** as the primary model because it is far more accurate for everyday objects.
 
| MobileNet (ImageNet) | COCO-SSD |
|----------------------|----------|
| 1000 abstract categories | 80 real-world objects |
| Classifies the whole frame | Detects each object separately |
| Returns "iPod" for a phone | Returns "cell phone" ✅ |
| No position data | Returns bounding box coordinates |
 
---
 
## 🧠 Accuracy — Voting System
 
Instead of trusting a single frame, the system scans **continuously** until the user clicks Stop. Every frame adds a vote for each detected object. The final result is calculated by combining average confidence, how consistently the object appeared across frames, and its peak score. This filters out one-frame false detections and gives a stable, reliable result.
 
---
 
## 🧰 Technologies
 
| Technology | Purpose |
|-----------|---------|
| TensorFlow.js | Runs ML models in the browser |
| COCO-SSD | Object detection — 80 classes with bounding boxes |
| MobileNetV2 | Image classification — Task 1 |
| HTML5 Canvas API | Drawing video frames and overlays |
| MediaDevices API | Webcam access via browser |
| Vanilla JavaScript | All application logic |
| CSS3 | Layout, animations, responsive design |
 
---
 
## 🖥️ Browser Support
 
| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Recommended |
| Edge 90+ | ✅ Supported |
| Firefox 88+ | ✅ Supported |
| Safari 15+ | ✅ Supported |
| Mobile Chrome | ✅ Supported |
 
---
 
## ⚡ Performance Results
 
| Device | Average FPS | Inference Time |
|--------|-------------|----------------|
| Desktop with GPU | 25 – 60 FPS | 10 – 25 ms |
| Mid-range laptop | 15 – 30 FPS | 30 – 60 ms |
| Low-end laptop | 8 – 15 FPS | 60 – 100 ms |
| Android phone | 10 – 20 FPS | 50 – 90 ms |
 
---
 
## 📌 Limitations
 
- Camera only works on localhost or HTTPS, not on file://
- COCO-SSD detects only its 80 trained object classes
- Detection accuracy drops in poor lighting conditions
- Model weights are fixed — no custom training supported in this project
 
---
