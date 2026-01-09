
var w, h
var cnv
var leftmargin, rightmargin, topmargin, bottommargin, actualheight, actualwidth, penwidth
var resolution, sourcecode

function setup() {
    w = 600
    h = 800
    cnv = createCanvas(w, h)
    centerCanvas();
    leftmargin = Math.floor(w * 0.05)
    rightmargin = Math.floor(w * 0.95)
    topmargin = Math.floor(h * 0.05)
    bottommargin = Math.floor(h * 0.75)
    actualwidth = rightmargin - leftmargin
    actualheight = bottommargin - topmargin
    colorMode(HSB, 360, 100, 100, 250);
}

function centerCanvas() {
    var x = (windowWidth - w) *0.5;
    var y = 0;
    cnv.position(x, y);
}


function draw() {
    background(0, 0, 100);
    fill(0,0,random(100))
    rect(0,0,w,h*0.5)
    //noLoop()
}


