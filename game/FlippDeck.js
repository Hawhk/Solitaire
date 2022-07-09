class FlippDeck {
    constructor(game) {
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
        let deckX = this.getDeckX();
        let flippX = this.getFlippX();
        let y = this.getY();
        if(deckLen > 0) {
            this.deck[deckLen - 1].show(deckX, y, false, true);
        }
        if(flippLen > minus - 1) {
            this.flipp[flippLen - minus].show(flippX, y, true, true);
        }
    }

    clicked = () => {        
        if (this.deck.length === 0) {
            this.deck = this.flipp.reverse();
            this.flipp = [];
        } else {
            this.flipp.push(this.deck.pop());
        }
    }

    pressedCard = (mx, my) => {
        if(this.flipp.length > 0) {
            let pressed = insideRect(
                this.getFlippX(), 
                this.getY(), 
                mx, 
                my, 
                WIDTH, 
                HEIGHT
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
            if (mouseY > this.game.cols[0].getY() - HEIGHT/2) {
                for (let i = 0; i < this.game.cols.length; i++) {
                    const col = this.game.cols[i];
                    let index = col.cards.length -1;
                    if (index < 0) {
                        index = 0;
                    }
                    let y = col.getY() + col.getSpacing() * index;
                    let inside = insideRect(
                        col.getX(), 
                        y, 
                        mouseX, 
                        mouseY, 
                        WIDTH, 
                        HEIGHT
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
                        sort.getX(), 
                        sort.getY(), 
                        mouseX, 
                        mouseY, 
                        WIDTH, 
                        HEIGHT
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

    getDeckX = () => {
        return this.game.getX();
    }

    getFlippX = () => {
        return this.game.getX() + WIDTH + SPACING;
    }

    getY = () => {
        return this.game.getY();
    }
}