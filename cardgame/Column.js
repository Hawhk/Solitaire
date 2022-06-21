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
                    card.show(
                        this.x, 
                        y, 
                        show, 
                        show, 
                        this.x, 
                        hy, 
                        this.cardWidth/2, 
                        this.spacing/2
                    );
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
                pressed = insideRect(
                    this.x,
                    y,
                    mx,
                    my,
                    this.cardWidth,
                    this.cardHeight
                );
            } else {
                y = y - this.cardWidth/2 - this.spacing/2 + 3;
                pressed = insideRect(
                    this.x,
                    y,
                    mx,
                    my,
                    this.cardWidth,
                    this.spacing
                );
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
                let y = mouseY + 
                    this.spacing * 
                    (j - this.draging) + 
                    this.cardWidth/2 + 
                    this.spacing/2 + 3;
                this.cards[j].show(mouseX, y, true, true);
            }
        } else {
            let found = false;
            if (mouseY > 190) {

                for (let j = 0; j < this.deck.cols.length; j++) {
                    const col = this.deck.cols[j];
                    let index = col.cards.length -1;
                    if (index < 0) {
                        index = 0;
                    }
                    let y = col.y + col.spacing * index;
                    let inside = insideRect(
                        col.x, 
                        y, 
                        mouseX, 
                        mouseY, 
                        this.cardWidth, 
                        this.cardHeight
                    );
                    let place = canPlace(
                        col.cards[col.cards.length - 1], 
                        this.cards[this.draging], false
                    );
                    if(inside && place) {
                        col.cards = moveCards(
                            this.cards, 
                            col.cards, 
                            this.draging, 
                            this.cards.length
                        );
                        found = true;
                        break;
                    }
                }
            } else {
                for (let i = 0; i <this.deck.sorts.length; i++) {
                    const sort = this.deck.sorts[i];
                    let inside = insideRect(
                        sort.x, 
                        sort.y, 
                        mouseX, 
                        mouseY, 
                        sort.cardWidth, 
                        sort.cardHeight
                    );
                    let place = canPlace(
                        sort.cards[sort.cards.length - 1], 
                        this.cards[this.draging], 
                        true
                    );
                    if(inside && place) {
                        if (this.draging === this.cards.length - 1) {
                            sort.cards = moveCards(
                                this.cards, 
                                sort.cards, 
                                this.draging, 
                                1
                            );
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