
//pixel = dpi * mm / 25.4 mm
//A3: 297mm × 420mm
//letter: 8.5in x 11in
//96dpi is for plotting on the UUNA TEK iDraw
//w=96*8.5=816
//h=96*11=1056
//A3 in inches: 11.693 x 16.535
var w = 11.69
var h = 16.53
let printerDPI = 96
var rightmargin = 0.95 * (w * printerDPI)
var leftmargin = 0.05 * (w * printerDPI)
var topmargin = 0.01 * (h * printerDPI)
var bottommargin = 0.95 * (h * printerDPI)
var actualwidth = rightmargin - leftmargin
var actualheight = bottommargin - topmargin
var cnv
var font, data
var titleFontSize = 30
var artistFontSize = 24
var textFontSize = 16

var titleHeight = 10
var artistHeight = 90
var hardwareHeight = 180
var softwareHeight = 290
var descriptionHeight = 340
let cartelWidth = 5.5
let cartelHeight = 5.4 //to fit 4 cartels in the width of the paper
let cartelMargins = 0.5
let cartelWidthPx, cartelHeightPx, cartelMarginsPx
var currentCartel = 0
var alldata


function setup() {
    paperWidthPx = w * printerDPI
    paperHeightPx = h * printerDPI
    cnv = createCanvas(paperWidthPx, paperHeightPx, SVG).mousePressed(savesvg);
    var x = (windowWidth - w * printerDPI) / 2;
    var y = 0
    cnv.position(x, y);

    colorMode(HSB, 360, 100, 100, 250);
    cartelWidthPx = cartelWidth * printerDPI
    cartelHeightPx = cartelHeight * printerDPI
    cartelMarginsPx = cartelMargins * printerDPI
    noFill()
}


function centerCanvas() {
    var x = (windowWidth - w) / 2;
    var y = (windowHeight - h) / 2;
    cnv.position(x, y);
}

function placebtn() {
    var x = (windowWidth - w) / 2;
    var y = (windowHeight - h) / 2;
    imgbtn.position(x - 200, y + h / 2 + 42)
}

function savesvg() {
    save("cartels-data.svg");
}

function preload() {
    font = loadFont("./fonts/1CAMBam_Stick_9.ttf");
    alldata = loadStrings("data.json")

}

function draw() {
    background(0, 0, 100)
    //quad(leftmargin, topmargin, rightmargin, topmargin, rightmargin, bottommargin, leftmargin, bottommargin)
    stroke(0, 100, 100); rect(0, 0, w * printerDPI, h * printerDPI); stroke(0, 0, 0)
    writedata()
    noLoop()
}
function writedata() {
    textFont(font)
    var fSize = 11
    textSize(fSize)
    var x = leftmargin
    var y = topmargin
    var c, tw
    for (let i = 0; i < alldata.length; i++) {
        c = alldata[i]
        tw = rightmargin - x
        if (textWidth(c) > tw) {
            text(c, x, y, tw)
            y += 2 * (fSize + 1)
        }
        else {
            text(c, x, y)
            y += fSize + 1.6
        }
    }
}
