let deck;

function setup() {
  // put setup code here
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  createCanvas(1200, 900);
  
  deck = new Deck();
  deck.scramble();
  deck.setCards();
}
let i = 0
function draw() {
  background(100);
  deck.show();
  i++;
}

function mouseClicked() { 
  deck.flippDeck.clicked();
}

function mousePressed() {
  deck.pressed();
  return false;
}