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
        this.draging = -1;
    }

    show = () => {
        for (let index = 0; index < this.cards.length; index++) {
            let card = this.cards[index];
            let show = index > this.showed; //TODO: remove -6; 
            let y = this.y + this.spacing * index;
            if (
                this.draging != -1 &&
                index >= this.draging
                ) {
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
                if (i > this.showed) {
                    this.draging = i;
                }
                return pressed;
            }
        }
        return false;
    }

    drawPressedCard = () => {
        if (this.draging == -1) {
            return;
        } 
        if (mouseIsPressed) {
            for (let j = this.draging; j < this.cards.length; j++) {
                let y = (mouseY + this.spacing * (j - this.draging)) + this.cardWidth/2 + this.spacing/2 + 3;
                this.cards[j].show(mouseX, y, true, true);
            }
        } else {
            let found = false;
            if (mouseY > 190) {

                for (let j = 0; j < this.deck.cols.length; j++) {
                    if (j === this.number) {
                        continue;
                    }
                    const col = this.deck.cols[j];
                    let index = col.cards.length -1;
                    if (index < 0) {
                        index = 0;
                    }
                    let y = col.y + col.spacing * index;
                    if(insideRect(col.x, y, mouseX, mouseY, this.cardWidth/2, this.cardHeight/2)) {
                        col.cards = moveCards(this.cards, col.cards, this.draging, this.cards.length);
                        found = true;
                        break;
                    }
                }
            } else {
                for (let i = 0; i <this.deck.sorts.length; i++) {
                    const sort = this.deck.sorts[i];
                    if(insideRect(sort.x, sort.y, mouseX, mouseY, sort.cardWidth/2, sort.cardHeight/2)) {
                        if (this.draging === this.cards.length - 1) {
                            sort.cards = moveCards(this.cards, sort.cards, this.draging, 1);
                            found = true;
                            break;
                        }
                    }
                }
            }
            if (found) {
                if (this.showed >= 0 && this.showed == this.cards.length - 1) {
                    this.showed--;
                }
            }
            this.draging = -1;
        }
    }
}