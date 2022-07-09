// const WIDTH = width/7;
// const HEIGHT = 150;

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.frontColor = 235;
        this.backColor = [0, 0, 195];

        switch (this.suit) {
            case "♣":
                this.color = "black";
                break;
            case "♠":
                this.color = "black";
                break;
            case "♦":
                this.color = "red";
                break
            case "♥":
                this.color = "red";
                break
        }
        
        switch (this.rank) {
            case 1:
                this.display = "A";
                break;
            case 11:
                this.display = "J";
                break;
            case 12:
                this.display = "Q";
                break;
            case 13:
                this.display = "K";
                break;
            default:
                this.display = this.rank;
                break;
        }
    }

    show = (x, y, showFace=false, hoverEffect=false, hx=x, hy=y, hw=WIDTH, hh=HEIGHT) => {
        this.drawCard(x, y, showFace, this.getHoverState(hx,hy,hw,hh), hoverEffect);
    }

    getHoverState = (x, y, w=WIDTH, h=HEIGHT) => {
        let mx = mouseX;
        let my = mouseY;
        return insideRect(x,y,mx,my,w,h);
    }

    drawCard = (x, y, showFace, hovers, hoverEffect) => {
        stroke(0);

        let addOnHover = 0;
        if (hoverEffect && hovers) {
            addOnHover = 20;
        }
        if (showFace) {
            fill(this.frontColor + addOnHover); 
    
        } else {
            let backColorAddon = [...this.backColor];
            backColorAddon[2] += addOnHover * 3;
            fill(backColorAddon);
        }
        rect(x, y, WIDTH, HEIGHT);
        
        if (showFace) {
            fill(this.color);
            textSize(SPACING/2);
            text(this.suit, x, y);
            textSize(SPACING/3);

            push();
            translate(x, y); 
            let tx = -WIDTH/2 + WIDTH/7;
            let ty = -HEIGHT/2 + HEIGHT/8;
            text(this.display, tx, ty);
            text(this.suit, -tx , ty);
            rotate(180);
            text(this.display, tx , ty);
            text(this.suit, -tx, ty);
            pop(); 
        }
    }

    static getSuits() {
        return ["♣", "♦", "♥", "♠"];
    }
}