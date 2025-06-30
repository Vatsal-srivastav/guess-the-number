let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let painting = false;

canvas.addEventListener('mousedown', () => painting = true);
canvas.addEventListener('mouseup', () => painting = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!painting) return;
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  document.getElementById('guess').innerText = 'Draw a digit and click "Guess"';
}

// Load MNIST model
let model;
(async () => {
  model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mnist/model.json');
})();

async function predict() {
  if (!model) {
    alert("Model not loaded yet.");
    return;
  }

  // Get image from canvas
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let tfImg = tf.browser.fromPixels(imageData, 1);
  let resized = tf.image.resizeBilinear(tfImg, [28, 28]).toFloat();
  let tensor = resized.div(255.0).expandDims(0);

  // Predict
  let predictions = model.predict(tensor).dataSync();
  let guess = predictions.indexOf(Math.max(...predictions));

  document.getElementById('guess').innerText = `I'm guessing: ${guess}`;
}
