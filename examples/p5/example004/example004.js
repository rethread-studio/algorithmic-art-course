
var w, h
var cnv
var x, y
var xoff, xinc
var count, white
function setup() {
    w = windowWidth
    h = windowHeight
    cnv = createCanvas(w, h);
    //centerCanvas();
    colorMode(HSB, 360, 100, 100, 250);
    noFill();
    background(0, 0, 0)
    xoff=0.0
    xinc=0.0001
    count=1
}

function centerCanvas() {
    var x = (windowWidth - w) / 2;
    var y = (windowHeight - h) / 2;
    cnv.position(x, y);
}

function draw() {
    if(count%20==0){
    fill(0,0,0)
    rect(0,0,w*0.5,h)
    ikeda(0,0,w*0.5,true)}
    if(count%19==0){
    fill(0,0,0)
    rect(w*0.5,0,w*0.5,h)
    ikeda(w*0.5,0,w*0.5,false)}
    count++
    //noLoop()
}

function ikeda(x,y,ikedaw,left){
    let cy=y
    let ryoji=random()*h*0.01
    let blanc=true
    if(left){
    while(cy<h){
        blanc?fill(0,0,100):fill(0,0,0)
        ryoji=random()*h*0.01
        rect(x,cy,ikedaw,ryoji)
        cy+=ryoji
        blanc=!blanc

    }}
    else{

    while(cy<h){
        blanc?fill(0,0,100):fill(0,0,0)
        ryoji=random()*h*0.1
        rect(x,cy,ikedaw,ryoji)
        cy+=ryoji
        blanc=!blanc

    }
    }
}
