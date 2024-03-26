/*
    title: Cartel generator
    author: LenaMK & IFT6251 class of 2024
    date: 2023-03-24
    description: génère des cartels à exporter en SVG pour le plotter

*/
//landscape so that we can fit two cartels in heigth
let paperHeight = 28
let paperWidth = 22

let printerDPI = 96


let cartelWidth = 5.5
let cartelHeight = 7 //to fit 4 cartels in the width of the paper
var cartelMargins = 0.5
let cartelWidthPx, cartelHeightPx, paperHeightPx, paperWidthPx, cartelMarginsPx
var currentCartel
var myFont;
var titleFontSize = 30
var artistFontSize = 24
var textFontSize = 16

var titleHeight = 50
var artistHeight = 120
var hardwareHeight = 200
var softwareHeight = 300
var descriptionHeight = 350

function preload() {
    myFont = loadFont('fonts/1CAMBam_Stick_9.ttf')
    data = loadJSON("data.json")
}


function setup() {
    colorMode(HSB, 360, 100, 100, 250);

    //paper size
    createCanvas(paperWidth * printerDPI, paperHeight * printerDPI);

    cartelWidthPx = cartelWidth * printerDPI
    cartelHeightPx = cartelHeight * printerDPI
    cartelMarginsPx = cartelMargins * printerDPI
    paperWidthPx = paperWidth * printerDPI
    paperHeightPx = paperHeight * printerDPI

    currentCartel = 0

    //load font
    textFont(myFont)

    noLoop();

}

function drawCartel(x, y, width, height) {
    noStroke()
    fill(341, 72, 67, 10)
    rect(x, y, width, height)

    push()

    translate(x, y)

    //if we still have a cartel to draw
    if (data[currentCartel]) {
        console.log(data[currentCartel])
            //all text is black
        stroke(0, 0, 0, 250)

        //using width limits the textbox width to the available size of the cartel. However, we need to check for textbox height, to make sure it doesn't overflow like hardware currently does for Lena's cartel
        textSize(titleFontSize)
        text(`${data[currentCartel].title}`, 0, titleHeight, width)

        textSize(artistFontSize)
        text(`${data[currentCartel].artist}`, 0, artistHeight, width)

        textSize(textFontSize)
        text(`${data[currentCartel].hardware}`, 0, hardwareHeight, width)
        text(`${data[currentCartel].software}`, 0, softwareHeight, width)
        text(`${data[currentCartel].description}`, 0, descriptionHeight, width)

    }

    pop()

    currentCartel++;

}


function draw() {


    for (var i = 0; i <= paperWidth; i += cartelWidth) {

        var x = i * printerDPI
        stroke(0, 0, 0, 50)
        line(x, 0, x, paperHeightPx)

        for (var j = cartelHeight; j <= paperHeight; j += cartelHeight) {

            var y = j * printerDPI
            stroke(0, 0, 0, 50)
            line(x, y, x + cartelWidthPx, y)



            drawCartel(x + cartelMarginsPx, y - cartelHeightPx + cartelMarginsPx, cartelWidthPx - cartelMarginsPx * 2, cartelHeightPx - cartelMarginsPx * 2)


        }


    }







    textSize(30);


}
