///////////////////
//// VARIABLES ////
///////////////////

// DOM variables
let p5canvas = document.querySelector(".p5canvas");
let saveButton = document.querySelector(".save");
let renderOptions = document.querySelector("#renderoptions");
let rangeWeight = document.querySelector(".rangeWeight");
let rangeLines = document.querySelector(".rangeLines");
let rangeNoise = document.querySelector(".rangeNoise");
let colorOptions = document.querySelector("#coloroptions");

// Interaction variables
let nbOfLines = 80;
let linesWeight = 1.2;
let noiseValue = 0.1;
let isMusic = false;
let colorBg = 'black';
let colorLines = 'white';

// Audio variables
let song, analyzer, rms;


////////////////////
//// STRUCTURES ////
////////////////////

// Unknown Pleasures cover structure
class UnknownPleasuresCover {
  constructor() {
    this.width = 625;
    this.height = 593;
    this.nbLines = nbOfLines;
    this.nbPoints = 500;
    this.noiseScaleBase = parseFloat(noiseValue);
    this.noiseScaleMiddle = noiseValue * 0.12;
    this.linesWeight = linesWeight;
    this.bgColor = colorBg;
    this.linesColor = colorLines;
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


///////////////////////////
//// UNKNOWN PLEASURES ////
///////////////////////////

let cover = new UnknownPleasuresCover();

function drawRecodingRandom() {
  if(!isMusic) {
    // Generate new noise seed to be able to generate a new cover without having to restart the app
    noiseSeed(random(1000));
    rms = 1;
  } else {
    rms = analyzer.getLevel() * 5;
  }
  background(cover.bgColor); // Fill the background with black
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
        h = 7*rms;
        noiseScale = cover.noiseScaleBase;
      } else {
        if (x < width / 2) {
          h = rms*map(x, width / 3, width / 2, 7, 100);
        } else {
          h = rms*map(x, width / 2, 2 * width / 3, 100, 7);
        }
        noiseScale = cover.noiseScaleMiddle;
      }

      fill(cover.bgColor);
      stroke(cover.bgColor);
      line(x, y - h * noiseVal, x, cover.height);
      noFill();
      stroke(cover.linesColor);
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
  // var myText = text('JOY DIVISION', cover.xMin+20, 60);
  fill(cover.linesColor);
  textSize(30);
  textFont('Helvetica');
  var myText = text('UNKNOWN PLEASURES', cover.xMin-2, cover.yMax+25);
}


//////////////////////
//// INTERACTIONS ////
//////////////////////

function canvasClickHandler() {
  cover = new UnknownPleasuresCover();
  if (renderOptions.value == "classic") {
    if(isMusic == true) {
      isMusic = false;
      song.stop();
    }
    drawRecodingRandom();
  } else if (renderOptions.value == "music") {
    if(isMusic == false) {
      song.loop();
      analyzer = new p5.Amplitude();
      analyzer.setInput(song);
    }
    noiseSeed(random(1000));
    isMusic = true;
  }
}

function rangeLinesUpdateCanvas(e) {
  nbOfLines = e.target.value;
  canvasClickHandler();
}

function rangeWeightUpdateCanvas(e) {
  linesWeight = e.target.value;
  canvasClickHandler();
}

function rangeNoiseUpdateCanvas(e) {
  noiseValue = e.target.value;
  canvasClickHandler();
}

function changeColor(e) {
  let colors = e.target.value.split(',');
  colorBg = colors[0];
  colorLines = colors[1];
  canvasClickHandler();
}

function saveImage() {
  save();
}

p5canvas.addEventListener("click", canvasClickHandler);
renderOptions.addEventListener("change", canvasClickHandler);
colorOptions.addEventListener("change", changeColor)
rangeLines.addEventListener("input", rangeLinesUpdateCanvas);
rangeWeight.addEventListener("input", rangeWeightUpdateCanvas);
rangeNoise.addEventListener("input", rangeNoiseUpdateCanvas)
saveButton.addEventListener("click", saveImage);


////////////////////////
//// P5JS FUNCTIONS ////
////////////////////////


function preload() {
  song = loadSound('JoyDivision.mp3');
}

function setup() {
  // Setup canvas
  createCanvas(cover.width, cover.height);

  if(!isMusic) {
    // frameRate(1);
    drawRecodingRandom();
  }
}

function draw() {
  if(isMusic) {
    drawRecodingRandom();
  }
}
