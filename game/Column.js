class Column {
    constructor(number, game) {
        this.game = game;
        this.cards = [];
        this.number = number;
        this.showed = number -1;
        this.draging = -1; 
    }

    show = () => {
        for (let index = 0; index < this.cards.length; index++) {
            let card = this.cards[index];
            let show = index > this.showed; 
            let y = this.getY() + this.getSpacing() * index;
            if (
                this.draging != -1 &&
                index >= this.draging
            ) {
                break;
            } else {
                if (index == this.cards.length - 1) {
                    card.show(this.getX(), y, show, show);
                } else {
                    // todo: fix when hovering
                    let hy = y - WIDTH/2 - this.getSpacing() + 3;
                    card.show(
                        this.getX(), 
                        y, 
                        show, 
                        show, 
                        this.getX(), 
                        hy, 
                        WIDTH, 
                        this.getSpacing()
                    );
                }
            }
        };
    }

    pressedCard = (mx, my) => {
        for (let i = 0; i < this.cards.length; i++) {
            // const card = this.cards[i];
            let pressed = false;
            let y = this.getY() + this.getSpacing() * i;
            if (i === this.cards.length - 1) {
                
                pressed = insideRect(
                    this.getX(),
                    y,
                    mx,
                    my,
                    WIDTH,
                    HEIGHT
                );
            } else {
                y = y - WIDTH/2 - this.getSpacing() + 3;
                pressed = insideRect(
                    this.getX(),
                    y,
                    mx,
                    my,
                    WIDTH,
                    SPACING
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
            return false;
        } 
        if (mouseIsPressed) {
            if (this.draging === this.cards.length - 1) {
                this.cards[this.draging].show(mouseX, mouseY, true, true);

            } else {
                for (let j = this.draging; j < this.cards.length; j++) {
                    let y = mouseY + this.getSpacing() * (j - this.draging) + HEIGHT/2 - this.getSpacing()/2;
                    this.cards[j].show(mouseX, y, true, true);
                }
            }
        } else {
            let found = false;
            if (mouseY > this.getY() - HEIGHT/2) {
                for (let j = 0; j < this.game.cols.length; j++) {
                    const col = this.game.cols[j];
                    let index = col.cards.length -1;
                    if (index < 0) {
                        index = 0;
                    }
                    let y = col.getY() + this.getSpacing() * index;
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
        return true;
    }

    getX = () => {
        return this.game.getX() + this.number * (WIDTH + SPACING);
    }

    getY = () => {
        return this.game.getY() + HEIGHT + SPACING;
    }

    getSpacing = () => {
        return SPACING/2;
    }
}