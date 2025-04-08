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
    let codestring, codefile, y;
    console.log("Going through " + Object.keys(codefiles).length + " code files");
    y = fSize;

    function loadStringsPromise(path) {
        return new Promise((resolve, reject) => {
            loadStrings(path,
                (result) => resolve(result),
                (error) => reject(error)
            );
        });
    }

    // Process files one by one to ensure each is fully loaded
    let allcode = [];
    for (let i = 0; i < Object.keys(codefiles).length; i++) {
        const key = Object.keys(codefiles)[i];
        try {
            const code = await loadStringsPromise("../" + codefiles[key].art_code + ".js");
            allcode.push(code);
        } catch (error) {
            console.error("Error loading file:", error);
        }
    }

    // Now process the loaded code and create one CodeFile object for each code file 
    for (let j = 0; j < allcode.length; j++) {
        console.log("Content:", allcode[j]);
        console.log("Length:", allcode[j].length);

        codestring = "";
        for (let k = 0; k < allcode[j].length; k++) {
            codestring += allcode[j][k];
        }
        codefile = new CodeFile(codestring, y + j * fSize);
        textarray.push(codefile);
    }
    console.log("Created " + textarray.length + " codefile objects");
}

// takes an array of Strings and returns a single String that concatnates all elements of the array
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
    var f
    if (textarray.length != 0) {
        for (var i = 0; i < 3; i++) {
            f = Math.floor(random(textarray.length - 1))
            console.log("index " + f + " in " + textarray.length)
            textarray[f].bouge()
        }
    }
    /*for (var f in textarray) {
        console.log("index: "+f+" in "+textarray.length)
        textarray[f].bouge()
    }*/
    console.log(frameRate())
}
