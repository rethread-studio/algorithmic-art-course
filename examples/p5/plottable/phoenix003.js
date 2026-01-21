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

function setup() {
    getsvg()
    //getpng()
    centerCanvas();
    colorMode(HSB, 360, 100, 100, 250);
    angleMode(DEGREES)
    strokeCap(SQUARE)
    noFill()
    maxcount = random(39, 45)
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

function draw() {
    background(0, 0, 100)
    noFill()
    stroke(0, 0, 0)
    rect(leftmargin,topmargin,actualwidth,actualheight)
    noLoop()
}
