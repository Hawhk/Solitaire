class Sort extends Column{
    constructor(number, game) {
        super(number, game);
    }

    show = () => {
        let minus = 1
        if (this.draging != -1) {
            minus += 1;
        }
        if (this.cards.length > minus - 1) {
            this.cards[this.cards.length - minus].show(
                this.getX(), 
                this.getY(), 
                true, 
                true
            );
        }
    }

    pressedCard = (mx, my) => {
        let pressed = false;
        let index = this.cards.length - 1;
        pressed = insideRect(
            this.getX(), 
            this.getY(), 
            mx, 
            my, 
            WIDTH, 
            HEIGHT
        );

        if (pressed) {
            this.draging = index;
            return pressed;
        }
        return false;
    }
    
    getX = () => {
        return this.game.getX() * 6 + (this.number) * (WIDTH + SPACING);
    }

    getY = () => {
        return this.game.getY();
    }
}