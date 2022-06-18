class Sort extends Column{
    constructor(x, y, number, deck) {
        super(x, y, number, deck);
    }

    show = () => {
        let minus = 1
        if (this.draging != -1) {
            minus += 1;
        }
        if (this.cards.length > minus - 1) {
            this.cards[this.cards.length - minus].show(this.x,  this.y, true, true);
        }
    }

    pressedCard = (mx, my) => {
        let pressed = false;
        let index = this.cards.length - 1;
        pressed = insideRect(this.x, this.y, mx, my, this.cardWidth, this.cardHeight);

        if (pressed) {
            this.draging = index;
            return pressed;
        }
        return false;
    }
}