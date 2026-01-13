
var w, h
var cnv

function setup() {
    w = 800
    h = 800
    cnv = createCanvas(w, h);
    centerCanvas();
    colorMode(HSB, 360, 100, 100, 250);
    noLoop()
}

function centerCanvas() {
    var x = (windowWidth - 800) / 2;
    var y = (windowHeight - 800) / 2;
    cnv.position(x, y);
}

function draw() {
    background(0,0,0)
    fill(230,100,100)
    noStroke()
    let noir=false
    let cx=w*0.5
    let cy=h*0.5
    let vera=random(42,300)
    let molnar=17
    let pas=9
    for(vera=300;vera>42;vera-=pas){
        noir?fill(0,0,0):fill(230,100,100)
    quad(cx-vera+random(-molnar,molnar),cy-vera+random(-molnar,molnar),
        cx+vera+random(-molnar,molnar),cy-vera+random(-molnar,molnar),
        cx+vera+random(-molnar,molnar),cy+vera+random(-molnar,molnar),
        cx-vera+random(-molnar,molnar),cy+vera+random(-molnar,molnar)
    )
    noir=!noir
}
}