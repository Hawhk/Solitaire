class Game {
    constructor(cards) {
        this.flippDeck = new FlippDeck(
            this
        );

        if (!!cards && isArray(cards)) {
            this.cards = cards;
        } else {
            this.cards = Game.createCards();
        }
        this.cols = [];
        for (let i = 0; i < 7; i++) {
            this.cols.push(
                new Column(i, this)
            );
        }
        this.sorts = [];
        for (let i = 0; i < 4; i++) {
            this.sorts.push(
                new Sort(i, this)
            );
        }
        this.won = false;
        this.canSolve = false;
        
        this.start = new Date().getTime();
        this.time = 0;
    }

    scramble = () => {
        for (let i = 0; i < 20000; i++) {
            let index1 = round(random(this.cards.length - 1));
            let index2 = round(random(this.cards.length - 1));
            swap(this.cards, index1, index2);
        }
    }

    setCards = () => {
        for (let i = 1; i <= this.cols.length; i++) {
            for(let j = i ; j <= this.cols.length; j++){
                this.cols[j - 1].cards.push(this.cards.pop());
            }
        }
        this.flippDeck.deck = this.cards.splice(0, this.cards.length);
    }
    
    showAllOnWin = () => {
        let x = WIDTH/2 + SPACING/2;
        let y = HEIGHT/2 + SPACING;
        this.cards.forEach((card) => {
            if (x + WIDTH/2 > width) {
                x = WIDTH/2 + SPACING/2;
                y += SPACING * 5;
            }

            card.show(x, y, true, true);

            x += WIDTH + SPACING;
        });
    }

    show = () => {
        if (!this.won){
            this.time = new Date().getTime() - this.start;
            //draws padds
            this.showPadds();
            //draws cards
            this.showCards();
            //draws when pressed
            this.showPressedCards();
            //check if can solve
            if (this.canSolve || this.won) {
                this.solveble();
            }
        } else {
            this.showAllOnWin();
        }
        fill(0);
        text(
            new Date(this.time).toISOString().slice(11, 19), 
            width/2,
            height - 50
        );
    }

    showPadds = () => {
        let flipDeckY = this.flippDeck.getY();
        drawPad(this.flippDeck.getDeckX(), flipDeckY);
        drawPad(this.flippDeck.getFlippX(), flipDeckY);
        this.cols.forEach(col => {
            drawPad(col.getX(), col.getY());
        });
        this.sorts.forEach(sort => {
            drawPad(sort.getX(), sort.getY());
        });
    }

    showCards = () => {
        let done = 0;
        let left = 0;
        this.flippDeck.show();
        this.cols.forEach(col => {
            col.show();
            left += col.showed;
        });
        this.canSolve = left === -7;
        this.sorts.forEach(sort => {
            sort.show();
            if (sort.cards.length === 13) {
                done++;
            }
        });
        this.won = done === 4;
    }

    showPressedCards = () => {
        //todo: make them return status if it has drawn or not to optimize
        this.flippDeck.drawPressedCard();
        this.cols.forEach(col => {
            col.drawPressedCard();
        });
        this.sorts.forEach(sort => {
            sort.drawPressedCard();
        });
    }

    solveble = () => {
        if (this.canSolve) {
            let c = 235;
            if (
                insideRect(
                    width/2, 
                    height - 100, 
                    mouseX, 
                    mouseY, 
                    80, 
                    40
                )
            ) {
                c += 20;
            }
            fill(c);
            rect(width/2, height - 100, 80, 40);
            fill(0);
            text("Solve!", width/2, height - 100, 80, 40);
        } else {
            this.sorts.forEach(sort => {
                this.cards = this.cards.concat(sort.cards);
                sort.cards = [];
            });
            this.scramble();
        }
    }

    pressed = () => {
        let mx = mouseX;
        let my = mouseY;
        if (my > this.cols[0].getY() - HEIGHT/2) {
            for (let i = 0; i < this.cols.length; i++) {
                if (this.cols[i].pressedCard(mx, my)) {
                    break;
                }
            }
        } else if (
            insideRect(
                this.flippDeck.getFlippX(), 
                this.flippDeck.getY(), 
                mx,
                my,
                WIDTH,
                HEIGHT
            )
        ) {
            this.flippDeck.pressedCard(mx, my);
        } else {
            for (let i = 0; i < this.sorts.length; i++) {
                this.sorts[i].pressedCard(mx, my);
            }
        }
    }

    clicked = () => {
        let my = mouseY;
        let mx = mouseX;
        if (
            insideRect(
                this.flippDeck.getDeckX(), 
                this.flippDeck.getY(), 
                mx,
                my,
                WIDTH,
                HEIGHT
            )
        ) {
            this.flippDeck.clicked();
        } else if (
            insideRect(
                width/2,
                height - 100, 
                mx,
                my,
                80,
                40
            )
        ) {
            this.solve();
        }
    }

    solve = () => {
        if (this.canSolve) {
            this.flippDeck.deck = this.flippDeck.deck.concat(this.flippDeck.flipp);
            this.flippDeck.flipp = [];
            let lowestCard = 13;
            this.sorts.forEach(sort => {
                
                let lenInd = sort.cards.length -1;
                if(lenInd < 0) {
                    lowestCard = 0;
                } else if(sort.cards[lenInd].rank < lowestCard){
                    lowestCard = sort.cards[lenInd].rank;
                }
            });
            for (let i = lowestCard + 1; i <= 13; i++) {
                let card
                let found = false;
                this.cols.forEach(col => {
                    if (
                        col.cards.length > 0 && 
                        col.cards[col.cards.length - 1].rank === i
                    ) {
                        card = col.cards.pop();
                        let findsortIndex = this.findSortToPutCard(card);
                        if (findsortIndex !== -1) {
                            this.sorts[findsortIndex].cards.push(card);
                        } else {
                            console.log(
                                "error", 
                                `card`, card, 
                                `Card searched for ${i}`
                            );
                        }
                    }
                    
                });
                if(!found){
                    let index = this.flippDeck.deck.findIndex(
                        flipcard => flipcard.rank === i
                    );
                    while(index !== -1) {
                        card = this.flippDeck.deck.splice(index, 1)[0];
                        let findsortIndex = this.findSortToPutCard(card);
                        if (findsortIndex !== -1) {
                            this.sorts[findsortIndex].cards.push(card);
                        } else {
                            console.log(
                                "error", 
                                `card`, card,
                                `Card searched for ${i}`
                            );
                        }
                        index = this.flippDeck.deck.findIndex(
                            card => card.rank === i
                        );
                    }
                }
            }
            this.won = true;
        }
    }

    findSortToPutCard = (card) => {
        let index = -1;
        for(let j = 0; j < this.sorts.length; j++){
            let lenInd = this.sorts[j].cards.length -1;
            if (lenInd < 0 && card.rank === 1) {
                index = j;
                continue;
            } else if (lenInd < 0) {
                break;
            }
            let sortCard = this.sorts[j].cards[lenInd];
            if(
                sortCard.rank + 1 === card.rank &&
                sortCard.suit === card.suit
            ){
                return j;
            }
        }
        return index;
    }

    getX = () => {
        return WIDTH/2 + SPACING/2;
    }

    getY = () => {
        return HEIGHT/2 + SPACING/2;
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