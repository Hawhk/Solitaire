let WIDTH;
let HEIGHT;
let SPACING;
let game;

const RATIO = 1.5;
const SPACING_PERCENT = 0.04;
const CARDS_PER_WIDTH = 15;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight - 50);
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
  resizeCanvas(windowWidth, windowHeight - 50);
  SPACING = width * SPACING_PERCENT;
  WIDTH = width/CARDS_PER_WIDTH;
  HEIGHT = WIDTH * RATIO;
}