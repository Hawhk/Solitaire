class Column {
    constructor(x, y, number, deck) {
        this.x = x;
        this.y = y;
        this.deck = deck;
        this.cards = [];
        this.number = number;
        this.showed = number -1;
        this.cardWidth = WIDTH;
        this.cardHeight = HEIGHT;
        this.spacing = 30;
        this.padColor = [34,54,60];
        this.draging = -1;
        this.pressingCheck = false;
    }

    show = () => {
        let w = this.cardWidth + 15;
        let h = this.cardHeight + 15;
        noStroke();
        fill(...this.padColor , 220);
        rect(this.x ,this.y, w, h);
        for (let index = 0; index < this.cards.length; index++) {
            let card = this.cards[index];
            let show = index > this.showed; //TODO: remove -6; 
            let y = this.y + this.spacing * index;
            if (this.pressingCheck && this.drawPressedCardStack(index)) {
                break;
            } else {
                if (index == this.cards.length - 1) {
                    card.show(this.x, y, show, show);
                } else {
                    let hy = y - this.cardWidth/2 - this.spacing/2 + 3;
                    card.show(this.x, y, show, show, this.x, hy, this.cardWidth/2, this.spacing/2);
                }
            }
        };
    }

    showNewCard = () => {
        if (this.showed >= 0 && this.showed == this.cards.length - 1) {
            this.showed--;
        }
    }

    pressedCard = (mx, my) => {
        for (let i = 0; i < this.cards.length; i++) {
            // const card = this.cards[i];
            let pressed = false;
            let y = this.y + this.spacing * i;
            if (i === this.cards.length - 1) {
                pressed = insideRect(this.x, y, mx, my, this.cardWidth/2, this.cardHeight/2);
            } else {
                y = y - this.cardWidth/2 - this.spacing/2 + 3;
                pressed = insideRect(this.x, y, mx, my, this.cardWidth/2, this.spacing/2);
            }
            if (pressed) {
                if (i > this.showed - 3) {
                    this.draging = i;
                    this.pressingCheck = true;
                }
                return pressed;
            }
        }
        return false;
    }

    drawPressedCardStack = (i) => {
        if (this.draging != -1 && i >= this.draging) {
            if (mouseIsPressed) {
                for (let j = this.draging; j < this.cards.length; j++) {
                    this.cards[j].show(mouseX, mouseY + this.spacing * (j - i), true, true);
                }
                return true;
            } else {
                for (let j = 0; j < this.deck.cols.length; j++) {
                    if (j === this.number) {
                        continue;
                    }
                    const col = this.deck.cols[j];
                    let index = col.cards.length -1;
                    if (index < 0) {
                        index = 0;
                    }
                    let y = col.y + this.spacing * index;
                    if(insideRect(col.x, y, mouseX, mouseY, this.cardWidth/2, this.cardHeight/2)) {
                        let spl = this.cards.splice(this.draging, this.cards.length);
                        let con = col.cards.concat(spl);
                        col.cards = con;
                        this.showNewCard()
                        return true;
                    }
                }
                this.pressingCheck = false;
                this.draging = -1;
            }
        }

        return false;
    }
}