const WIDTH = 100;
const HEIGHT = 150;

class Card {
    constructor(rank, suit) {
        this.width = WIDTH;
        this.height = HEIGHT;
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

    show = (x, y, showFace=false, hoverEffect=false, hx=x, hy=y, hw=this.width/2, hh=this.height/2) => {
        this.drawCard(x, y, showFace, this.getHoverState(hx,hy,hw,hh), hoverEffect);
    }

    getHoverState = (x, y, w=this.width/2, h=this.height/2) => {
        let mx = mouseX;
        let my = mouseY;
        return insideRect(x,y,mx,my,w,h);
    }

    drawCard = (x, y, showFace, hovers, hoverEffect) => {
        // console.log(hovers);
        rectMode(CENTER);
        stroke(0);
        textAlign(CENTER, CENTER);
        textSize(20);

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
        rect(x, y, this.width, this.height);
        if (showFace) {
            fill(this.color);
            text(this.display, x-35, y-60);
            text(this.suit, x-35, y-45);
            push();
            // console.log(width);
            translate(x, y); 
            rotate(180);
            text(this.display, -this.width/2 + 15, -this.width/2 - 10);
            text(this.suit, -this.width/2 + 15, -this.width/2 + 5);
            pop(); 
        }
    }

    static getSuits() {
        return ["♣", "♦", "♥", "♠"];
    }
}