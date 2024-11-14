document.addEventListener("DOMContentLoaded", function () {
  // Crear el contenedor de radio y la imagen del radio
  var body = document.body;
  body.style.margin = 0;
  body.style.height = "100vh";
  body.style.background = "#fff";
  body.style.fontFamily = "'Lucida Console', monospace";
  body.style.display = "flex";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.overflow = "hidden";

  var radioContainer = document.createElement('div');
  radioContainer.id = 'radio-container';
  radioContainer.style.position = "absolute";
  radioContainer.style.top = "50%";
  radioContainer.style.left = "50%";
  radioContainer.style.transform = "translate(-50%, -50%)";
  radioContainer.style.zIndex = 1;
  body.appendChild(radioContainer);

  var radio = document.createElement('img');
  radio.id = 'radio';
  radio.src = "https://raw.githubusercontent.com/Fran15711/prueba1/refs/heads/main/radio.png";
  radio.alt = "Radio";
  radio.style.width = "150px";
  radio.style.cursor = "pointer";
  radio.style.transition = "transform 0.2s ease";
  radioContainer.appendChild(radio);

  // Crear el canvas
  var canvas = document.createElement('canvas');
  body.appendChild(canvas);

  // Estilo de la animación y la vibración
  var style = document.createElement('style');
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

  var URL = "https://raw.githubusercontent.com/Fran15711/prueba1/main/Centinela_Versio%CC%81n%20larga.mp3";
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analizador = audioCtx.createAnalyser();
  analizador.fftSize = 1024;
  var dataArray = new Uint8Array(analizador.frequencyBinCount);
  var audioBuffer, fuenteDeReproduccion;
  var stop = true;
  var tiempo = 0, progreso = 0;

  var ctx = canvas.getContext("2d");
  var cw = (canvas.width = window.innerWidth), cx = cw / 2;
  var ch = (canvas.height = window.innerHeight), cy = ch / 2;
  var R = 150;
  var r = 80;
  var da = 2;
  var cos = Math.cos(da * Math.PI / 180);
  var sin = Math.sin(da * Math.PI / 180);
  var requestId = null;

  function solicitarAudio(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      audioCtx.decodeAudioData(request.response, function (buffer) {
        audioBuffer = buffer;
      });
    };
    request.send();
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
      radio.classList.add("playing");
    } else {
      stop = true;
      detenerAudio();
      radio.classList.remove("playing");
    }
  }

  solicitarAudio(URL);

  radio.addEventListener("click", audio, false);

  function Barr(a) {
    this.a = a * Math.PI / 180;
    this.dr = 0;
    this.cos = Math.cos(this.a);
    this.sin = Math.sin(this.a);

    this.draw = function (R, color) {
      this.x0 = (R + this.dr) * this.cos;
      this.y0 = (R + this.dr) * this.sin;
      this.x1 = this.x0 * cos - this.y0 * sin;
      this.y1 = this.x0 * sin + this.y0 * cos;
      this.x3 = (R - this.dr) * this.cos;
      this.y3 = (R - this.dr) * this.sin;
      this.x2 = this.x3 * cos - this.y3 * sin;
      this.y2 = this.x3 * sin + this.y3 * cos;

      ctx.fillStyle = lGrd(this.x1, this.y1, this.x2, this.y2, color);
      ctx.beginPath();
      ctx.moveTo(this.x0, this.y0);
      ctx.lineTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
      ctx.lineTo(this.x3, this.y3);
      ctx.closePath();
      ctx.fill();
    };
  }

  function update(Ry, R, divisor, n, color) {
    for (var i = 0; i < Ry.length; i++) {
      var dr = dataArray[i * n];
      Ry[i].dr = dr * dr * dr / divisor;
      Ry[i].draw(R, color);
    }
  }

  var Ry = [], Ry1 = [];
  for (var i = 0; i < 180; i += 2 * da) Ry.push(new Barr(i));
  for (var i = -2 * da; i > -(180 + 2 * da); i -= 2 * da) Ry1.push(new Barr(i));

  function Animacion() {
    requestId = window.requestAnimationFrame(Animacion);
    analizador.getByteFrequencyData(dataArray);
    ctx.clearRect(-cw, -ch, 2 * cw, 2 * ch);
    var n = ~~(analizador.frequencyBinCount / Ry.length);

    update(Ry, R, 25000, n, "hsla(200, 80%, 60%, 1)");
    update(Ry1, R, 25000, n, "hsla(200, 80%, 60%, 1)");
    update(Ry, r, 200000, n, "#007ACC");
    update(Ry1, r, 200000, n, "#007ACC");
  }

  function init() {
    if (requestId) window.cancelAnimationFrame(requestId);
    (cw = canvas.width = window.innerWidth), (cx = cw / 2);
    (ch = canvas.height = window.innerHeight), (cy = ch / 2);
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 2);
    Animacion();
  }

  function lGrd(x, y, x1, y1, color) {
    var grd = ctx.createLinearGradient(x, y, x1, y1);
    grd.addColorStop(0, "white");
    grd.addColorStop(0.5, color);
    grd.addColorStop(1, "white");
    return grd;
  }

  window.setInterval(function () {
    init();
    window.addEventListener("resize", init, false);
    if (!stop) progreso = audioCtx.currentTime - tiempo;
    if (audioBuffer && audioCtx.currentTime - tiempo >= audioBuffer.duration) {
      stop = true;
      radio.classList.remove("playing");
      progreso = 0;
    }
  }, 1000 / 30);
});
