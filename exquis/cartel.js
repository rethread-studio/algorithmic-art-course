//pixel = dpi * mm / 25.4 mm
//A3: 297mm × 420mm
//96dpi is for plotting on the UUNA TEK iDraw
//A3
//w=96*297/25.4=1122.5
//h=96*420/25.4=1587.4
//letter
//w=96*8.5=816
//h=96*11=1056

var echelle = 1
var w = 816 * echelle
var h = 1056 * echelle
var rightmargin = 0.96 * w
var leftmargin = 0.04 * w
var topmargin = 0.05 * h
var bottommargin = 0.93 * h
var actualwidth = rightmargin - leftmargin
var actualheight = bottommargin - topmargin
var cnv, imgbtn, fSize, exquisitecartel, font1, font2

function preload() {
    font1 = loadFont("../cartels/fonts/1CamBam_Stick_2.ttf");
    font2 = loadFont("../cartels/fonts/1CAMBam_Stick_9.ttf");
    exquisitecartel = loadJSON("./cartel.json")
}

function setup() {
    getsvg()
    //getpng()
    centerCanvas();
    colorMode(HSB, 360, 100, 100, 250);
    strokeCap(SQUARE)
    noFill()
    fSize = 46
    background(0, 0, 100)
    noFill()
    stroke(0, 0, 0)
    noLoop()
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
    save("cartel.svg");
}

function savepng() {
    save("cartel.png");
}

function draw() {
    var t, x, y
    strokeWeight(2)
    //Title of the piece
    textSize(fSize)
    textFont(font1)
    x = leftmargin
    y = topmargin + fSize
    t = exquisitecartel.title.main
    text(t, x, y)
    //Short description
    textFont(font2)
    fSize = fSize * 0.55
    textSize(fSize)
    t = exquisitecartel.subtitle.line1
    x = leftmargin
    y += fSize * 3
    text(t, x, y)
    t = exquisitecartel.subtitle.line2
    y += fSize * 1.1
    text(t, x, y)
    //Artists and artworks
    y += fSize * 4
    for (i in exquisitecartel.artworks) {
        x = leftmargin + actualwidth * 0.3
        y+=fSize
        t = "  " + exquisitecartel.artworks[i].art1 
        if(exquisitecartel.artworks[i].art2!=""){
            t=t+ "  &  " + exquisitecartel.artworks[i].art2
        }
        text(t, x, y)
        t = exquisitecartel.artworks[i].artist + " (b. " + exquisitecartel.artworks[i].origin + ")  "
        x -= textWidth(t)
        text(t, x, y)
    }
    //Acknowledgements
    x=leftmargin
    fSize=fSize*0.6
    textSize(fSize)
    y = bottommargin-fSize * 4
    var ack = "Remerciements: "+exquisitecartel.ack
    var w
    for(var j=0;j<ack.length;j++){
        t=ack.charAt(j)
        w=textWidth(t)
        if(x+w>rightmargin){
            x=leftmargin
            y+=fSize
        }
        text(t,x,y)
        x+=w
    }
}