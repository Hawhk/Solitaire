class Sort extends Column{
    constructor(x, y, number, deck) {
        super(x, y, number, deck);
    }

    show = () => {
        if (this.cards.length > 0) {
            this.cards[this.cards.length - 1].show(this.x,  this.y, true);
        }
    }
}