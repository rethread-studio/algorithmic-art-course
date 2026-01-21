//pixel = dpi * mm / 25.4 mm
//A3: 297mm × 420mm
//96dpi is for plotting on the UUNA TEK iDraw
//A3
//w=96*297/25.4=1122.5
//h=96*420/25.4=1587.4
//letter
//w=96*8.5=816
//h=96*11=1056

var w = Math.floor(96 * 8.5)
var h = Math.floor(96 * 11)
var rightmargin = 0.96 * w
var leftmargin = 0.04 * w
var topmargin = 0.05 * h
var bottommargin = 0.73 * h
var actualwidth = rightmargin - leftmargin
var actualheight = bottommargin - topmargin
var cnv, imgbtn
var font, fSize

function setup() {
    getsvg()
    //getpng()
    centerCanvas();
    colorMode(HSB, 360, 100, 100, 250);
    angleMode(DEGREES)
    strokeCap(SQUARE)
    noFill()
    fSize=14
}

function getsvg() {
    cnv = createCanvas(w, h, SVG).mousePressed(savesvg);
    imgbtn = createButton("save svg");
    placebtn();
    imgbtn.mouseClicked(savesvg);
}
function getpng() {
    cnv = createCanvas(w, h);
    imgbtn = createButton("save png");
    placebtn();
    imgbtn.mouseClicked(savepng);
}

function centerCanvas() {
    var x = (windowWidth - w) / 2;
    var y = 0//(windowHeight - h) / 2;
    cnv.position(x, y);
}

function placebtn() {
    var x = (windowWidth - w) / 2;
    var y = (windowHeight - h) / 2;
    imgbtn.position(x - 200, y + h / 2 + 42)
}

function savesvg() {
    save("phoenix003.svg");
}

function savepng() {
    save("phoenix003.png");
}

function preload() {
    font = loadFont("../fonts/1CamBam_Stick_4.ttf");
}

var xoff = 0.0
var xinc = 1
var resolution = 12
var xstep = actualwidth / resolution
var ystep = actualheight / resolution

function draw() {
    background(0, 0, 100)
    noFill()
    stroke(0, 0, 0)
    rect(0, 0, w, h)
    initgrid()
//    showgrid()
    schott()
    credits(leftmargin,bottommargin+3*fSize)
    noLoop()
}

var grille = []
function initgrid() {
    var x, y
    for (i = 0; i < resolution; i++) {
        y = topmargin + i * ystep// + noise(xoff) * (ystep * 0.42 - ystep); xoff += xinc
        for (j = 0; j < resolution; j++) {
            x = leftmargin + j * xstep// + noise(xoff) * (xstep * 0.42 - xstep); xoff += xinc
            grille.push({ x: x, y: y })
        }
    }
}   

function showgrid(){
    for (i in grille){
        rect(grille[i].x,grille[i].y,xstep,ystep)
    }
}
function schott() {
    let tilt = 0
    for (i in grille) {
        if (i % resolution == 0) { tilt += 3; }
        push()
        translate(grille[i].x+xstep*0.5, grille[i].y+ystep*0.5)
        var initangle = Math.floor(random(-tilt, tilt))
        rotate(initangle)
            quad(-xstep * 0.5, -ystep * 0.5,
                xstep * 0.5, -ystep * 0.5,
                xstep * 0.5, ystep * 0.5,
                -xstep * 0.5, ystep * 0.5)
        pop()
    }

}

function credits(posx, posy) {
    textFont(font)
    textSize(fSize);
    stroke(0, 0, 0)
    var c = "IFT6256 schotter demo 2026::01::14"
    text(c, posx, posy)
}