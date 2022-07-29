const FPS = 120;
let WIDTH;
let HEIGHT;
let SPACING;
let game;

const CARD_RATIO = 1.4;
const SPACING_PERCENT = 0.05;
const CARDS_PER_WIDTH = 14;
const RATIO = 9/16;

function setup() {
  // put setup code here
  let { w, h } = getSize();
  createCanvas(w, h);
  frameRate(FPS);
  SPACING = width * SPACING_PERCENT;
  WIDTH = width/CARDS_PER_WIDTH;
  HEIGHT = WIDTH * CARD_RATIO;
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
  let { w, h } = getSize();
  resizeCanvas(w, h);
  SPACING = width * SPACING_PERCENT;
  WIDTH = width/CARDS_PER_WIDTH;
  HEIGHT = WIDTH * CARD_RATIO;
}

function getSize() {
  let nch = 0;
  if (typeof getNonCanvasHeight === 'function') {
      nch = getNonCanvasHeight();
  } else {
      nch = 25;
  }
  let w = windowWidth;
  let h = windowHeight - nch;
  if (windowHeight - nch < w * RATIO) {
      w = h / RATIO;
  } else {
      h = w * RATIO;
  }
  return { w, h };
}