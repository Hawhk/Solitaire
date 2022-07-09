const FPS = 120;
let WIDTH;
let HEIGHT;
let SPACING;
let game;

const RATIO = 1.4;
const SPACING_PERCENT = 0.05;
const CARDS_PER_WIDTH = 14;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight - 25);
  frameRate(FPS);
  SPACING = width * SPACING_PERCENT;
  WIDTH = width/CARDS_PER_WIDTH;
  HEIGHT = WIDTH * RATIO;
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  
  
  game = new Game();
  game.scramble();
  game.setCards();
}

function draw() {
  background(25, 110, 25);
  game.show();
}

function mouseReleased() { 
  game.clicked();
  
}

function mousePressed() {
  game.pressed();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 25);
  SPACING = width * SPACING_PERCENT;
  WIDTH = width/CARDS_PER_WIDTH;
  HEIGHT = WIDTH * RATIO;
}