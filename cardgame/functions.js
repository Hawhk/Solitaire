function insideRect(x, y, x2, y2, w, h) {
    return(x2 > x - w/2 && x2 < x + w/2) && (y2 > y - h/2 && y2 < y + h/2)
}

function drawPad(x, y) {
    let w = WIDTH + 15;
    let h = HEIGHT + 15;
    noStroke();
    fill(34,54,60,220);
    rect(x , y, w, h);
}

function moveCards(arr1, arr2, index, length) {
    let spl = arr1.splice(index, length);
    let con = arr2.concat(spl);
    return con;
}

function canPlace(card1, card2, sameColor) {
    if (!card1 && sameColor) {
        return card2.rank === 1;
    } else if (!card1) {
        return card2.rank === 13;
    }

    if (!card2) {
        console.log("errror!!!")
        return false;
    }

    if (sameColor) {
        return card1.suit === card2.suit && card1.rank === card2.rank - 1;
    }else {
        return card1.color !== card2.color && card1.rank - 1 === card2.rank;
    }
}