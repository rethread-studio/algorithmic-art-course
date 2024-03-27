
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
var rightmargin = 0.93 * (w*printerDPI)
var leftmargin = 0.02 * (w*printerDPI)
var topmargin = 0.01 * (h*printerDPI)
var bottommargin = 0.95 * (h*printerDPI)
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


function setup() {
    paperWidthPx = w * printerDPI
    paperHeightPx = h * printerDPI
    cnv = createCanvas(paperWidthPx, paperHeightPx, SVG).mousePressed(savesvg);
    var x = (windowWidth - w*printerDPI) / 2;
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
    save("cartels-vernissage.svg");
}

function preload() {
    font = loadFont("./fonts/1CAMBam_Stick_9.ttf");
    data = loadJSON("data.json")

}

function draw() {
    background(0,0,100)
    //quad(leftmargin, topmargin, rightmargin, topmargin, rightmargin, bottommargin, leftmargin, bottommargin)
    stroke(0,100,100);rect(0, 0, w*printerDPI, h*printerDPI);stroke(0,0,0)
    var fSize = 12
    stroke(0, 0, 0)
    textFont(font)
   for (var x = leftmargin+cartelMarginsPx; x <= w*printerDPI; x += cartelWidth*printerDPI) {
        for (var y = topmargin+cartelMarginsPx; y <= h*printerDPI; y += cartelHeight*printerDPI) {
            rect(x-cartelMarginsPx, y-cartelMarginsPx, cartelWidthPx, cartelHeightPx)
            drawCartel(x, y, cartelWidthPx - cartelMarginsPx * 2, cartelHeightPx - cartelMarginsPx * 2)
        }
    }
    noLoop()
}

function drawCartel(x, y, width, height) {
    
    if (data[currentCartel]) {
        console.log(data[currentCartel])
        //all text is black
        stroke(0, 0, 0)
        noFill()

        //using width limits the textbox width to the available size of the cartel. However, we need to check for textbox height, to make sure it doesn't overflow like hardware currently does for Lena's cartel
        textSize(titleFontSize)
        text(`${data[currentCartel].title}`, x, y + titleHeight, width)

        textSize(artistFontSize)
        text(`${data[currentCartel].artist}`, x, y + artistHeight, width)

        textSize(textFontSize)
        text(`${data[currentCartel].country}`, x, y + artistHeight + 30, width)
        text(`Matériel :${data[currentCartel].hardware}`, x, y + hardwareHeight, width)
        text(`Logiciel : ${data[currentCartel].software}`, x, y + softwareHeight, width)
        text(`${data[currentCartel].description}`, x, y + descriptionHeight, width)

        text(`${data[currentCartel].code}`, x, y + cartelHeightPx - cartelMarginsPx * 1.8, width)

    }

    currentCartel++;
}
