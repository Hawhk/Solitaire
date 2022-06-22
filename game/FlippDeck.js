class FlippDeck {
    constructor(deckX, flippX, y, game) {
        this.cardWidth = WIDTH;
        this.cardHeight = HEIGHT;
        this.deckX = deckX;
        this.flippX = flippX;
        this.y = y;
        this.game = game;
        this.deck = [];
        this.flipp = [];
        this.draging = -1;
    }

    show = () => {
        let deckLen = this.deck.length;
        let flippLen = this.flipp.length;
        let minus = 1
        if (this.draging != -1) {
            minus += 1;
        }
        if(deckLen > 0) {
            this.deck[deckLen - 1].show(this.deckX, this.y, false, true);
        }
        if(flippLen > minus - 1) {
            this.flipp[flippLen - minus].show(this.flippX, this.y, true, true);
        }
    }

    clicked = () => {
        let isClicked = insideRect(
            this.deckX, 
            this.y, 
            mouseX, 
            mouseY, 
            this.cardWidth, 
            this.cardHeight
        );
        
        if (this.deck.length === 0 && isClicked) {
            this.deck = this.flipp.reverse();
            this.flipp = [];
            isClicked = false;
        }
        if (isClicked) {
            this.flipp.push(this.deck.pop());
        }
    }

    pressedCard = (mx, my) => {
        if(this.flipp.length > 0) {
            let pressed = insideRect(
                this.flippX, 
                this.y, 
                mx, 
                my, 
                this.cardWidth, 
                this.cardHeight
            );
            if (pressed) {
                this.draging = this.flipp.length -1;
            }
        }
    }

    drawPressedCard = () => {
        if (this.draging == -1) {
            return;
        } 
        if (mouseIsPressed) {
            this.flipp[this.flipp.length -1].show(mouseX, mouseY, true, true);
        } else {
            if (mouseY > 190) {
                for (let i = 0; i < this.game.cols.length; i++) {
                    const col = this.game.cols[i];
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
                        this.flipp[this.draging], 
                        false
                    );
                    if(inside && place) {
                        col.cards = moveCards(
                            this.flipp, 
                            col.cards, 
                            this.draging, 
                            1
                        );
                        break;
                    }
                }
            } else {
                for (let i = 0; i <this.game.sorts.length; i++) {
                    const sort = this.game.sorts[i];
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
                        this.flipp[this.draging], 
                        true
                    );
                    if(inside && place) {
                        sort.cards = moveCards(
                            this.flipp, 
                            sort.cards, 
                            this.draging, 
                            1
                        );
                        break;
                    }
                }
            }
            this.draging = -1;
        }
    }

}