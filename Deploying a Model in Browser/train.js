<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AI Pose Tracking</title>

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet"></script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(270deg, #0f172a, #1e3a8a, #0f172a);
  background-size: 600% 600%;
  animation: gradientBG 10s ease infinite;
  color: white;
  text-align: center;
}

@keyframes gradientBG {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

h1 {
  margin-top: 15px;
  font-size: 28px;
  color: #22c55e;
  letter-spacing: 1px;
}

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#frame {
  position: relative;
  width: 700px;
  height: 500px;
  margin-top: 15px;
  border-radius: 15px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 25px rgba(34,197,94,0.4);
  border: 1px solid rgba(255,255,255,0.1);
}

video, canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

#stats {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.8;
}

.badge {
  padding: 5px 10px;
  border-radius: 20px;
  margin: 5px;
  display: inline-block;
}

.online {
  background: #22c55e;
  color: black;
}

.fps {
  background: #3b82f6;
}
</style>
</head>

<body>

<h1>🤖 AI Pose Tracking System</h1>

<div id="container">
  <div id="frame">
    <video id="cam" autoplay></video>
    <canvas id="layer"></canvas>
  </div>

  <div id="stats">
    <span class="badge online">LIVE</span>
    <span class="badge fps" id="fps">FPS: 0</span>
  </div>
</div>

<script>
const cam = document.getElementById("cam");
const layer = document.getElementById("layer");
const ctx = layer.getContext("2d");

let lastPoints = [];
let lastTime = performance.now();

// Camera
async function initCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  cam.srcObject = stream;
  return new Promise(res => cam.onloadedmetadata = res);
}

// Smooth
function applySmoothing(points) {
  if (!lastPoints.length) return points;

  const alpha = 0.6;
  const beta = 0.4;

  return points.map((pt, i) => {
    const prev = lastPoints[i];
    return {
      ...pt,
      position: {
        x: alpha * pt.position.x + beta * prev.position.x,
        y: alpha * pt.position.y + beta * prev.position.y
      }
    };
  });
}

// Draw joints (Glow effect)
function renderPoints(points) {
  points.forEach(p => {
    if (p.score > 0.5) {
      ctx.beginPath();
      ctx.arc(p.position.x, p.position.y, 6, 0, Math.PI * 2);

      ctx.shadowBlur = 15;
      ctx.shadowColor = "#ff0000";

      ctx.fillStyle = "#ff4d4d";
      ctx.fill();

      ctx.shadowBlur = 0;
    }
  });
}

// Draw skeleton (Neon lines)
function renderLines(points) {
  const links = posenet.getAdjacentKeyPoints(points, 0.5);

  links.forEach(([p1, p2]) => {
    ctx.beginPath();
    ctx.moveTo(p1.position.x, p1.position.y);
    ctx.lineTo(p2.position.x, p2.position.y);

    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 3;

    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffcc";

    ctx.stroke();
    ctx.shadowBlur = 0;
  });
}

// FPS counter
function updateFPS() {
  const now = performance.now();
  const fps = Math.round(1000 / (now - lastTime));
  document.getElementById("fps").innerText = "FPS: " + fps;
  lastTime = now;
}

// Main
async function run() {
  const model = await posenet.load({
    architecture: "ResNet50",
    outputStride: 32
  });

  await initCamera();
  cam.play();

  async function loop() {
    const pose = await model.estimateSinglePose(cam, {
      flipHorizontal: true
    });

    ctx.clearRect(0, 0, layer.width, layer.height);

    const smoothed = applySmoothing(pose.keypoints);

    renderPoints(smoothed);
    renderLines(smoothed);

    lastPoints = smoothed;

    updateFPS();

    requestAnimationFrame(loop);
  }

  loop();
}

run();
</script>

</body>
</html>