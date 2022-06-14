class Deck {
    constructor(cards) {
        this.cardWidth = WIDTH;
        this.cardHeight = HEIGHT;
        this.spacing = 20;
        this.cardX = this.cardWidth/2 + this.spacing;
        this.cardY = this.cardHeight/2 + this.spacing;
        this.flipped = [];

        if (!!cards && isArray(cards)) {
            this.cards = cards;
        } else {
            this.cards = Deck.createCards();
        }
        this.cols = [];
        for (let i = 0; i < 7; i++) {
            this.cols.push(new Column(this.cardX * 2 * (i + 1), this.cardY * 3, i, this));
        }
        this.sorted = [];
        for (let i = 0; i < 4; i++) {
            this.sorted.push(new Sort(this.cardX * 2 * (i + 4), this.cardY, i, this));
        }
        
    }

    scramble = () => {
        for (let i = 0; i < 20000; i++) {
            let index1 = round(random(this.cards.length - 1));
            let index2 = round(random(this.cards.length - 1));
            // console.log(index1)
            [this.cards[index1],  this.cards[index2]] = [this.cards[index2],  this.cards[index1]];
        }
    }

    setCards = () => {
        for (let i = 1; i <= this.cols.length; i++) {
            for(let j = i ; j <= this.cols.length; j++){
                this.cols[j - 1].cards.push(this.cards.pop());
            }
        }
    }
    
    showAll = () => {
        console.log(x,y)
        this.cards.forEach(card => {
            if (x + this.cards[0].width/2 > width) {
                x = this.cards[0].width/2 + spacing;
                y += spacing * 5;
            }

            card.show(x, y)

            x += this.cards[0].width + spacing;
        });
    }
        

    show = () => {
        let xFlipped = this.cardX * 3;
        let cardsLen = this.cards.length;
        let flippedLen = this.flipped.length;

        drawPad(this.cardX ,this.cardY);
        drawPad(xFlipped, this.cardY);
        this.cols.forEach(col => {
            drawPad(col.x, col.y);
        })
        this.sorted.forEach(sort => {
            drawPad(sort.x, sort.y);
        })
        if(cardsLen > 0) {
            this.cards[cardsLen - 1].show(this.cardX, this.cardY, false, true);
        }
        if(flippedLen > 0) {
            this.flipped[flippedLen - 1].show(xFlipped, this.cardY, true, true);
        }
        this.sorted.forEach(sort => {
            sort.show();
        });
        this.cols.forEach(col => {
            col.show();
        })
        this.cols.forEach(col => {
            col.drawPressedCardStack();
        })
    }

    clicked = () => {
        let isClicked = false;
        if (this.cards.length > 0) {
            let lastCard = this.cards[this.cards.length - 1];
            isClicked = (lastCard.getHoverState(this.cardX, this.cardY) || lastCard.getHoverState(this.cardX * 3, this.cardY));
            // console.log(isPressed, x, y);
        } else if (this.flipped.length > 0) {
            this.cards = this.flipped.reverse();
            this.flipped = [];
            isClicked = true;
        
        }
        if (isClicked) {
            this.flipped.push(this.cards.pop());
        }
    }

    pressed = () => {
        let mx = mouseX;
        let my = mouseY;
        if (my > 190) {
            for (let i = 0; i < this.cols.length; i++) {
                if (this.cols[i].pressedCard(mx, my)) {
                    break;
                }
            }
        }
    }

    static createCards = () => {
        let cards = [] 
        for (let rank = 1; rank <= 13; rank++) {
            Card.getSuits().forEach(suit => {
                cards.push(new Card(rank, suit));
            });
        }
        return cards;
    }
}