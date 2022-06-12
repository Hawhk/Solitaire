function insideRect(x, y, x2, y2, w, h) {
    return(x2 > x - w && x2 < x + w) && (y2 > y - h && y2 < y + h)
}

function drawPad(x, y) {
    let w = WIDTH + 15;
    let h = HEIGHT + 15;
    noStroke();
    fill(34,54,60,220);
    rect(x , y, w, h);
}