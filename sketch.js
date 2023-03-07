// Unknown Pleasures cover structure
class UnknownPleasuresCover {
  constructor() {
    this.width = 625;
    this.height = 593;
    this.nbLines = 80;
    this.nbPoints = 500;
    this.noiseScaleBase = 0.04;
    this.noiseScaleMiddle = 0.012;
    this.linesWeight = 1.2;
    // Position
    this.xMin = 140;
    this.xMax = this.width - this.xMin;
    this.yMin = 100;
    this.yMax = this.height - this.yMin;
    // Distance between elements
    this.dPoints = (this.xMax - this.xMin) / this.nbPoints;
    this.dLines = (this.yMax - this.yMin) / this.nbLines;
  }
}

/////////////////////
//// VARIABLES //////
/////////////////////
// DOM variables
let p5canvas = document.querySelector(".p5canvas");
let saveButton = document.querySelector(".save");
let renderOptions = document.querySelector("#renderoptions");

// Cover variables
let cover = new UnknownPleasuresCover();

/////////////////////////////
//// UNKNOWN PLEASURES //////
/////////////////////////////

function drawRecodingRandom() {
  noiseSeed(random(1000)); // Generate new noise seed to be able to generate a new cover without having to restart the app
  background(0); // Fill the background with black
  strokeWeight(cover.linesWeight);

  var width = cover.width;
  var x = cover.xMin;
  var y = cover.yMin;
  var start = 0;
  var noiseScale;
  var h;

  for (var i = 0; i < cover.nbLines; i++) {
    x = cover.xMin;

    for (var j = 0; j < cover.nbPoints; j++) {
      let noiseVal = noise(start);

      if (x < width / 3 || x > 2 * width / 3) {
        h = 7;
        noiseScale = cover.noiseScaleBase;
      } else {
        if (x < width / 2) {
          h = map(x, width / 3, width / 2, 7, 100);
        } else {
          h = map(x, width / 2, 2 * width / 3, 100, 7);
        }
        noiseScale = cover.noiseScaleMiddle;
      }

      fill(0);
      stroke(0);
      line(x, y - h * noiseVal, x, cover.height);
      noFill();
      stroke(255);
      point(x, y - h * noiseVal);

      x += cover.dPoints;
      start += noiseScale;
    }

    y += cover.dLines;
  }

  drawText();
}

function drawText() {
  strokeWeight(0);
  // textSize(26);
  // fill(255);
  // textSize(45);
  // var myText = text('JOY DIVISION', cover.xMin+20, 40);
  fill(255);
  textSize(30);
  var myText = text('UNKNOWN PLEASURES', cover.xMin-2, cover.yMax+25);
}

////////////////////////
//// INTERACTIONS //////
////////////////////////

function canvasClickHandler() {
  if (renderOptions.value == "mousepos") {
    drawRecodingMouse();
  } else if (renderOptions.value == "random") {
    drawRecodingRandom();
  }
}

function saveImage() {
  save();
}

p5canvas.addEventListener("click", canvasClickHandler);
saveButton.addEventListener("click", saveImage);


////////////////////////
//// P5JS FUNCTIONS ////
////////////////////////

function setup() {
  // Setup canvas
  createCanvas(cover.width, cover.height);

  frameRate(1);
  drawRecodingRandom();
  // draw();
}

function draw() {
  // drawRecodingRandom();
}
