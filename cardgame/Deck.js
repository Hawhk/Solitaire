class Deck {
    constructor(cards) {
        this.cardWidth = WIDTH;
        this.cardHeight = HEIGHT;
        this.spacing = 20;
        this.cardX = this.cardWidth/2 + this.spacing;
        this.cardY = this.cardHeight/2 + this.spacing;
        
        this.flippDeck = new FlippDeck(
            this.cardX, 
            this.cardX * 3, 
            this.cardY, 
            this
        );

        if (!!cards && isArray(cards)) {
            this.cards = cards;
        } else {
            this.cards = Deck.createCards();
        }
        this.cols = [];
        for (let i = 0; i < 7; i++) {
            this.cols.push(
                new Column(this.cardX * 2 * (i + 1), this.cardY * 3, i, this)
            );
        }
        this.sorts = [];
        for (let i = 0; i < 4; i++) {
            this.sorts.push(
                new Sort(this.cardX * 2 * (i + 4), this.cardY, i, this)
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
        let x = this.cardWidth/2 + this.spacing/2;
        let y = this.cardHeight/2 + this.spacing;
        this.cards.forEach((card) => {
            if (x + this.cardWidth/2 > width) {
                x = this.cardWidth/2 + this.spacing/2;
                y += this.spacing * 5;
            }

            card.show(x, y, true, true);

            x += this.cardWidth + this.spacing;
        });
    }

    show = () => {
        
        if (!this.won){
            this.time = new Date().getTime() - this.start;
            //draws padds
            drawPad(this.flippDeck.deckX, this.flippDeck.y);
            drawPad(this.flippDeck.flippX, this.flippDeck.y);
            this.cols.forEach(col => {
                drawPad(col.x, col.y);
            });
            this.sorts.forEach(sort => {
                drawPad(sort.x, sort.y);
            });
            //draws cards
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
            //draws when pressed
            this.flippDeck.drawPressedCard();
            this.cols.forEach(col => {
                col.drawPressedCard();
            });
            this.sorts.forEach(sort => {
                sort.drawPressedCard();
            });
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
            } else if (done === 4) {
                this.won = true;
                this.sorts.forEach(sort => {
                    this.cards = this.cards.concat(sort.cards);
                    sort.cards = [];
                });
                this.scramble();
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

    pressed = () => {
        let mx = mouseX;
        let my = mouseY;
        if (my > 190) {
            for (let i = 0; i < this.cols.length; i++) {
                if (this.cols[i].pressedCard(mx, my)) {
                    break;
                }
            }
        } else if (mx < 240) {
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
        if (mx < 200 && my < 200) {
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
            console.log(lowestCard);
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
            console.log(card, sortCard);
            if(
                sortCard.rank + 1 === card.rank &&
                sortCard.suit === card.suit
            ){
                return j;
            }
        }
        return index;
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