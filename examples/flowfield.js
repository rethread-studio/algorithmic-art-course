
var w, h
var cnv
var xoff, yoff, incx, incy, incz
var zoff = 0.0
var density, nbcols, nbrows
var flowfield = []
var nbParticles
var particles = []

function setup() {
    w = 800
    h = 800
    cnv = createCanvas(w, h);
    centerCanvas();
    colorMode(HSB, 360, 100, 100, 250);
    yoff = 0.0
    xoff = 0.0
    incx = 0.2
    incy = 0.2
    incz = 0.001
    density = 20
    nbcols = w / density
    nbrows = h / density
    nbParticles = 100
    initParticles()
    initField()
}

function initParticles() {
    for (var i = 0; i < nbParticles; i++) {
        particles[i] = new Particle()
    }
}

function initField() {
    yoff = 0.0
    for (y = 0; y < nbrows; y++) {
        xoff = 0.0
        for (x = 0; x < nbcols; x++) {
            var h = noise(xoff, yoff) * 360; xoff += incx //random()*360
            var v = p5.Vector.fromAngle(radians(h));
            v.setMag(7)
            var index = x + y * nbcols
            flowfield[index] = v
            push()
            stroke(0, 0, 100, 150)
            strokeWeight(1)
            translate(x * density, y * density)
            rotate(v.heading())
            //line(0, 0, density,0)
            pop()
            // fill(h,100,100)
            // rect(x*density,y*density,density,density)
        }
        yoff += incy
    }
}

function centerCanvas() {
    var x = (windowWidth - 800) / 2;
    var y = (windowHeight - 800) / 2;
    cnv.position(x, y);
}

function draw() {
    movingfield()
    //showParticles()
    showCurves()
    //noLoop()
}

function movingfield(){
    //background(0, 0, 0)
    yoff = 0.0
    for (y = 0; y < nbrows; y++) {
        xoff = 0.0
        for (x = 0; x < nbcols; x++) {
            var h = noise(xoff, yoff, zoff) * 360; //random()*360
            var v = p5.Vector.fromAngle(radians(h));
            xoff += incx
            var index = x + y * nbcols
            flowfield[index] = v
            push()
            stroke(0, 0, 100, 150)
            strokeWeight(1)
            translate(x * density, y * density)
            rotate(v.heading())
            //line(0, 0, density, 0)
            pop()

            // fill(h,100,100)
            // rect(x*density,y*density,density,density)
        }
        yoff += incy
    }
    zoff += 0.003;

}

function showCurves() {
    stroke(0, 0, 100, 42)
    noFill()
    var numsteps, x, y, index, x2, y2, steplength
    var x1 = random(w)
    var y1 = random(h)
    numsteps = 50
    steplength = 4
    beginShape()
    curveVertex(x1, y1)
    curveVertex(x1, y1)
    for (let i = 0; i < numsteps; i++) {
        if (x1 > 0 && x1 <= w && y1 > 0 && y1 <= h) {
            console.log("one vertex " + x1 + " " + y1)
            x = Math.floor(x1 / density)
            y = Math.floor(y1 / density)
            index = x + y * nbcols
            angle = flowfield[index].heading()
            x2 = x1 + steplength * cos(angle)
            y2 = y1 + steplength * sin(angle)
            curveVertex(x2, y2)
            x1 = x2
            y1 = y2
            console.log("one vertex " + x1 + " " + y1)
        }
        else {
            i = numsteps
        }
    }
    curveVertex(x2, y2)
    endShape()
}

function showParticles() {
    for (var i = 0; i < nbParticles; i++) {
        particles[i].follow(flowfield)
        particles[i].update()
        particles[i].show()
        particles[i].edges()
    }
}
