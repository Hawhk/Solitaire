let deck;

function setup() {
  // put setup code here
  angleMode(DEGREES);
  createCanvas(1200, 900);
  deck = new Deck();
  deck.scramble();
  deck.setCards();
}
let i = 0
function draw() {
  // put drawing code here
  // 
  background(100);
  deck.show();
  i++;
  // if (i == 2)
    // noLoop();
}

function mouseClicked() { 
  deck.clicked();
}

function mousePressed() {
  deck.pressed();
  return false;
}