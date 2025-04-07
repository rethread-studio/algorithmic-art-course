var w, h, cnv, font, ht, js
var fSize = 42
var codefiles
var textarray = []

function preload() {
    var code;
    font = loadFont("./FreeMono.otf");
    codefiles = loadJSON("../exquisite.json")
}

function setup() {
    w = windowWidth
    h = windowHeight
    cnv = createCanvas(w, h);
    fSize = Math.floor(h / 30)
    textFont(font)
    textSize(fSize)
    colorMode(HSB, 360, 100, 100, 250);
    strokeCap(SQUARE)
    stroke(130, 100, 100); fill(130, 100, 100)

    initcodefiles()
}

async function initcodefiles() {
    var code, allcode, codestring, codefile, y
    console.log("Going through " + Object.keys(codefiles).length + " code files")
    y = fSize
    allcode=[]
    for (var i in Object.keys(codefiles)) {
        code = await loadStrings("../" + codefiles[i].art_code + ".js")
        allcode.push(code)
    }
    for (var j in allcode){
        console.log(allcode[j])
        console.log(allcode[j].length)
        codestring = ""
        for (var k in allcode[j]) {
            codestring += allcode[j][k]
        }
        codefile = new CodeFile(codestring, y + j * fSize)
        textarray.push(codefile)
    }
    console.log("Created " + textarray.length + " codefile objects")
}

function flattencode(data) {
    var codestring = ""
    console.log(data)
    console.log(data.length)
    for (var i in data) {
        codestring += data[i]
    }
    console.log(codestring)
    return codestring

}

function draw() {
    if (frameCount < 11) {
        textFont(font)
        textSize(fSize)
        text("wow", 0, 200)
        text(Object.keys(codefiles).length, 0, 300)
        for (var f in textarray) {
            textarray[f].bouge()
        }
    }
    else {
        noLoop()
    }
}
