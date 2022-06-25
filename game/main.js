let game;

function setup() {
  // put setup code here
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  createCanvas(1200, 900);
  
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