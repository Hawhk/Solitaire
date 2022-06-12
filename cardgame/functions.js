function insideRect(x, y, x2, y2, w, h) {
    return(x2 > x - w && x2 < x + w) && (y2 > y - h && y2 < y + h)
}