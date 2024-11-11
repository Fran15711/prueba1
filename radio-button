// Estilos generales del cuerpo
document.body.style.cssText = `
  height: 100vh;
  background: #fff;
  font-family: 'Lucida Console', monospace;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  overflow: hidden;
`;

// Crear contenedor y añadir la imagen de la radio
const radioContainer = document.createElement("div");
radioContainer.id = "radio-container";
radioContainer.style.cssText = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const radio = document.createElement("img");
radio.id = "radio";
radio.src = "https://raw.githubusercontent.com/Fran15711/prueba1/refs/heads/main/radio.png";
radio.alt = "Radio";
radio.style.cssText = `
  width: 150px;
  cursor: pointer;
  transition: transform 0.2s ease;
`;
radioContainer.appendChild(radio);
document.body.appendChild(radioContainer);

// Definir animación de vibración en CSS
const style = document.createElement('style');
style.innerHTML = `
  @keyframes radio-vibration {
    0% { transform: translate(0px, 0px) rotate(0deg); }
    20% { transform: translate(-1px, 1px) rotate(-0.5deg); }
    40% { transform: translate(1px, -1px) rotate(0.5deg); }
    60% { transform: translate(-1px, -1px) rotate(-0.5deg); }
    80% { transform: translate(1px, 1px) rotate(0.5deg); }
    100% { transform: translate(0px, 0px) rotate(0deg); }
  }
  #radio.playing {
    animation: radio-vibration 0.3s infinite;
  }
`;
document.head.appendChild(style);

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analizador = audioCtx.createAnalyser();
analizador.fftSize = 1024;
const dataArray = new Uint8Array(analizador.frequencyBinCount);

let audioBuffer, fuenteDeReproduccion;
let stop = true;
let tiempo = 0, progreso = 0;
const ctx = canvas.getContext("2d");

const R = 150, r = 80, da = 2;
const cos = Math.cos(da * Math.PI / 180);
const sin = Math.sin(da * Math.PI / 180);
let requestId = null;

function solicitarAudio(url) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => audioCtx.decodeAudioData(data, buffer => (audioBuffer = buffer)))
    .catch(console.error);
}

function reproducirAudio() {
  fuenteDeReproduccion = audioCtx.createBufferSource();
  fuenteDeReproduccion.buffer = audioBuffer;
  fuenteDeReproduccion.connect(analizador);
  analizador.connect(audioCtx.destination);
  fuenteDeReproduccion.start(audioCtx.currentTime, progreso);
}

function detenerAudio() {
  fuenteDeReproduccion.stop();
}

function audio() {
  if (stop) {
    tiempo = audioCtx.currentTime - progreso;
    stop = false;
    reproducirAudio(progreso);
    radio.classList.add("playing"); // Añade la animación de vibración
  } else {
    stop = true;
    detenerAudio();
    radio.classList.remove("playing"); // Remueve la animación de vibración
  }
}

radio.addEventListener("click", audio, false);

function Barr(a) {
  this.a = a * Math.PI / 180;
  this.dr = 0;
  this.cos = Math.cos(this.a);
  this.sin = Math.sin(this.a);

  this.draw = function(R, color) {
    const x0 = (R + this.dr) * this.cos;
    const y0 = (R + this.dr) * this.sin;
    const x1 = x0 * cos - y0 * sin;
    const y1 = x0 * sin + y0 * cos;
    const x3 = (R - this.dr) * this.cos;
    const y3 = (R - this.dr) * this.sin;
    const x2 = x3 * cos - y3 * sin;
    const y2 = x3 * sin + y3 * cos;

    ctx.fillStyle = lGrd(x1, y1, x2, y2, color);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  };
}

function update(Ry, R, divisor, n, color) {
  for (let i = 0; i < Ry.length; i++) {
    const dr = dataArray[i * n];
    Ry[i].dr = (dr * dr * dr) / divisor;
    Ry[i].draw(R, color);
  }
}

const Ry = [], Ry1 = [];
for (let i = 0; i < 180; i += 2 * da) Ry.push(new Barr(i));
for (let i = -2 * da; i > -(180 + 2 * da); i -= 2 * da) Ry1.push(new Barr(i));

function Animacion() {
  requestId = window.requestAnimationFrame(Animacion);
  analizador.getByteFrequencyData(dataArray);
  ctx.clearRect(-canvas.width, -canvas.height, 2 * canvas.width, 2 * canvas.height);
  const n = ~~(analizador.frequencyBinCount / Ry.length);

  update(Ry, R, 25000, n, "hsla(200, 80%, 60%, 1)");
  update(Ry1, R, 25000, n, "hsla(200, 80%, 60%, 1)");
  update(Ry, r, 200000, n, "#007ACC");
  update(Ry1, r, 200000, n, "#007ACC");
}

function init() {
  if (requestId) window.cancelAnimationFrame(requestId);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  Animacion();
}

function lGrd(x, y, x1, y1, color) {
  const grd = ctx.createLinearGradient(x, y, x1, y1);
  grd.addColorStop(0, "white");
  grd.addColorStop(0.5, color);
  grd.addColorStop(1, "white");
  return grd;
}

window.setInterval(() => {
  init();
  window.addEventListener("resize", init, false);
  if (!stop) progreso = audioCtx.currentTime - tiempo;
  if (audioBuffer && audioCtx.currentTime - tiempo >= audioBuffer.duration) {
    stop = true;
    radio.classList.remove("playing");
    progreso = 0;
  }
}, 1000 / 30);

solicitarAudio("https://raw.githubusercontent.com/Fran15711/prueba1/main/Centinela_Versio%CC%81n%20larga.mp3");
