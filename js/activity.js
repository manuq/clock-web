var fps = 1;

var previousTime = Date.now();

var textTimeElem = document.getElementById('text-time');
var clockCanvasElem = document.getElementById("clock-canvas");

var clockContainerElem = clockCanvasElem.parentNode;

var bgCanvasElem = document.createElement('canvas');
clockContainerElem.insertBefore(bgCanvasElem, clockCanvasElem);

var clockContext = clockCanvasElem.getContext("2d");
var backgroundContext = bgCanvasElem.getContext('2d');

// These are calculated on each resize to fill the available space
var height;
var width;
var radius;
var centerX;
var centerY;
var lineWidthBase;
var handSizes;
var lineWidths;

var handAngles = {'hours': 0, 'minutes': 0, 'seconds': 0};

var colors = {
  'black': "#000000",
  'white': "#FFFFFF",
  'hours': "#005FE4",
  'minutes': "#00B20D",
  'seconds': "#E6000A"
};

function updateSizes() {
  height = window.innerHeight - textTimeElem.offsetHeight;
  width = Math.min(window.innerWidth, height);

  clockCanvasElem.width = width;
  clockCanvasElem.height = width;

  bgCanvasElem.width = width;
  bgCanvasElem.height = height;

  clockContainerElem.style.width = width + "px";
  clockContainerElem.style.height = height + "px";

  radius = width / 2;
  centerX = radius;
  centerY = radius;
  lineWidthBase = radius / 150;

  handSizes = {
    'hours': radius * 0.5,
    'minutes': radius * 0.7,
    'seconds': radius * 0.8
  };

  lineWidths = {
    'hours': lineWidthBase * 9,
    'minutes': lineWidthBase * 6,
    'seconds': lineWidthBase * 4
  };
}

function update() {
  // update text time
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var zeroFill = function(number) {
    return ('00' + number).substr(-2);
  }

  textTimeElem.innerHTML = 
    '<span style="color:' + colors['hours'] + '">' + zeroFill(hours) + '</span>' +
    ':<span style="color:' + colors['minutes'] + '">' + zeroFill(minutes) +  '</span>' +
    ':<span style="color:' + colors['seconds'] + '">' + zeroFill(seconds) +  '</span>';

  handAngles['hours'] = Math.PI - (Math.PI / 6 * hours + Math.PI / 360 * minutes);
  handAngles['minutes'] = Math.PI - Math.PI / 30 * minutes;
  handAngles['seconds'] = Math.PI - Math.PI / 30 * seconds;
}

function drawSimpleBackground(ctx) {
  // Draw the background of the simple clock.
  //
  // The simple clock background is a white disk, with hours and
  // minutes ticks, and the hour numbers.

  // Simple clock background
  var lineWidthBackground = lineWidthBase * 4;
  ctx.lineCap = 'round';
  ctx.lineWidth = lineWidthBackground;
  ctx.strokeStyle = colors['black'];
  ctx.fillStyle = colors['white'];
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - lineWidthBackground, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // Clock ticks
  for (var i=0; i<60; i++) {
    var inset;
    if (i % 15 == 0) {
      inset = 0.15 * radius;
      ctx.lineWidth = lineWidthBase * 7;
    }
    else if (i % 5 == 0) {
      inset = 0.12 * radius;
      ctx.lineWidth = lineWidthBase * 5;
    } else {
      inset = 0.08 * radius;
      ctx.lineWidth = lineWidthBase * 4;
    }

    ctx.lineCap = 'round';
    ctx.beginPath();

    var cos = Math.cos(i * Math.PI / 30);
    var sin = Math.sin(i * Math.PI / 30);
    ctx.moveTo(radius + (radius - inset) * cos,
               radius + (radius - inset) * sin);
    ctx.lineTo(radius + (radius - ctx.lineWidth) * cos,
               radius + (radius - ctx.lineWidth) * sin);

    ctx.stroke();
  }
}

function drawNumbers(ctx) {
  // Draw the numbers of the hours.

  ctx.fillStyle = colors['hours'];
  ctx.textBaseline = 'middle';
  ctx.font = "bold 40px sans-serif";

  for (var i=0; i<12; i++) {
    var cos = Math.cos((i - 2) * Math.PI / 6);
    var sin = Math.sin((i - 2) * Math.PI / 6);
    var text = i + 1;
    var textWidth = ctx.measureText(text).width;

    ctx.save()
    ctx.translate(centerX - textWidth / 2, centerY);
    ctx.translate(radius * 0.75 * cos, radius * 0.75 * sin);
    ctx.fillText(text, 0, 0);
    ctx.restore()
  }
}

function drawHands(ctx) {
  // Draw the hands of the analog clocks.

  // Clear canvas first.
  ctx.clearRect(0, 0, width, height);

  var handNames = ['hours', 'minutes', 'seconds'];
  for (var i=0; i<handNames.length; i++) {
    var name = handNames[i];
      ctx.lineCap = 'round';
      ctx.lineWidth = lineWidths[name];
      ctx.strokeStyle = colors[name];
      ctx.beginPath();
      ctx.arc(centerX, centerY, ctx.lineWidth * 0.6, 0, 2 * Math.PI);
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + handSizes[name] * Math.sin(handAngles[name]),
                 centerY + handSizes[name] * Math.cos(handAngles[name]));
      ctx.stroke();
  }
}

function draw() {
  drawHands(clockContext);
}

var requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame;

function animate() {
  var currentTime = Date.now();

  if ((currentTime - previousTime) > (1000 / fps)) {
    previousTime = currentTime;
    update();
    draw();
  }
  requestAnimationFrame(animate);
}

updateSizes();
drawSimpleBackground(backgroundContext);
drawNumbers(backgroundContext);

window.onresize = function(event) {
  updateSizes();
  drawSimpleBackground(backgroundContext);
  drawNumbers(backgroundContext);
  drawHands(clockContext);
}

animate();
