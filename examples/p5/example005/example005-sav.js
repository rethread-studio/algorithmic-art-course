
var w, h
var cnv
var leftmargin, rightmargin, topmargin, bottommargin, actualheight, actualwidth, penwidth
var count, satdown, coordinates


let palette//=[[270,50,30],[180,70,100],[0,100,100],[50,80,100],[270,80,100],[270,0,100],[0,0,0]]
let palettes = [
    [[270, 50, 30], [180, 70, 100], [0, 100, 100], [50, 80, 100], [270, 80, 100], [270, 0, 100], [0, 0, 0]],
    [[180, 50, 30], [90, 70, 100], [270, 100, 100], [320, 80, 100], [180, 80, 100], [270, 0, 100], [0, 0, 0]]
]

function setup() {
    w = 800
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
    count = 0
    satdown = true
    i = Math.floor((random(palettes.length)))
    palette = palettes[0]
    initgrid()

}

function centerCanvas() {
    var x = (windowWidth - w) * 0.5;
    var y = (windowHeight - h) * 0.5;
    cnv.position(x, y);
}

function draw() {
    background(0, 0, 100);
    showgrid()
    noLoop()
}


function brillant() {
    let xres = 0.05
    let yres = 0.05
    let xstep = xres * w
    let ystep = yres * h
    let coordinates = [
        { col: palette[0], x1: 0, y1: 0, x2: xstep, y2: 0, x3: xstep, y3: ystep * 5, x4: 0, y4: ystep * 5, cercle: false },
        { col: palette[1], x1: 0, y1: ystep * 5, x2: xstep, y2: ystep * 5, x3: xstep, y3: ystep * 10, x4: 0, y4: ystep * 10, cercle: false },
        { col: palette[0], x1: 0, y1: ystep * 10, x2: xstep, y2: ystep * 10, x3: xstep, y3: ystep * 16, x4: 0, y4: ystep * 16, cercle: false },

        { col: palette[4], x1: 0, y1: ystep * 16, x2: xstep * 6, y2: ystep * 16, x3: xstep * 6, y3: ystep * 20, x4: 0, y4: ystep * 20, cercle: false },

        { col: palette[1], x1: xstep, y1: 0, x2: xstep * 6, y2: 0, x3: xstep * 6, y3: ystep, x4: xstep, y4: ystep, cercle: false },
        { col: palette[2], x1: xstep, y1: ystep, x2: xstep * 6, y2: ystep, x3: xstep * 6, y3: ystep * 8, x4: xstep, y4: ystep * 8, cercle: false },
        { col: palette[2], x1: xstep, y1: ystep * 8, x2: xstep * 6, y2: ystep * 8, x3: xstep * 6, y3: ystep * 16, x4: xstep, y4: ystep * 16, cercle: false },

        { col: palette[0], x1: xstep * 6, y1: 0, x2: xstep * 12, y2: 0, x3: xstep * 12, y3: ystep, x4: xstep * 6, y4: ystep, cercle: false },
        { col: palette[6], x1: xstep * 6, y1: ystep, x2: xstep * 12, y2: ystep, x3: xstep * 12, y3: ystep * 5, x4: xstep * 6, y4: ystep * 5, cercle: true },
        { col: palette[5], x1: xstep * 6, y1: ystep * 5, x2: xstep * 12, y2: ystep * 5, x3: xstep * 12, y3: ystep * 10, x4: xstep * 6, y4: ystep * 10, cercle: true },
        { col: palette[3], x1: xstep * 6, y1: ystep * 10, x2: xstep * 12, y2: ystep * 10, x3: xstep * 12, y3: ystep * 15, x4: xstep * 6, y4: ystep * 15, cercle: false },
        { col: palette[6], x1: xstep * 6, y1: ystep * 15, x2: xstep * 12, y2: ystep * 15, x3: xstep * 12, y3: ystep * 16, x4: xstep * 6, y4: ystep * 16, cercle: false },
        { col: palette[3], x1: xstep * 6, y1: ystep * 16, x2: xstep * 12, y2: ystep * 16, x3: xstep * 12, y3: ystep * 17, x4: xstep * 6, y4: ystep * 17, cercle: false },
        { col: palette[6], x1: xstep * 6, y1: ystep * 17, x2: xstep * 12, y2: ystep * 17, x3: xstep * 12, y3: ystep * 20, x4: xstep * 6, y4: ystep * 20, cercle: false },

        { col: palette[1], x1: xstep * 12, y1: 0, x2: xstep * 19, y2: 0, x3: xstep * 19, y3: ystep, x4: xstep * 12, y4: ystep, cercle: false },
        { col: palette[2], x1: xstep * 12, y1: ystep, x2: xstep * 19, y2: ystep, x3: xstep * 19, y3: ystep * 8, x4: xstep * 12, y4: ystep * 8, cercle: false },
        { col: palette[2], x1: xstep * 12, y1: ystep * 8, x2: xstep * 19, y2: ystep * 8, x3: xstep * 19, y3: ystep * 16, x4: xstep * 12, y4: ystep * 16, cercle: false },

        { col: palette[4], x1: xstep * 12, y1: ystep * 16, x2: xstep * 20, y2: ystep * 16, x3: xstep * 20, y3: ystep * 20, x4: xstep * 12, y4: ystep * 20, cercle: false },

        { col: palette[0], x1: xstep * 19, y1: 0, x2: xstep * 20, y2: 0, x3: xstep * 20, y3: ystep * 5, x4: xstep * 19, y4: ystep * 5, cercle: false },
        { col: palette[5], x1: xstep * 19, y1: ystep * 5, x2: xstep * 20, y2: ystep * 5, x3: xstep * 20, y3: ystep * 10, x4: xstep * 19, y4: ystep * 10, cercle: false },
        { col: palette[0], x1: xstep * 19, y1: ystep * 10, x2: xstep * 20, y2: ystep * 10, x3: xstep * 20, y3: ystep * 16, x4: xstep * 19, y4: ystep * 16, cercle: false }
    ]
    for (i in coordinates) {
        c = coordinates[i]
        fill(c.col[0], c.col[1], c.col[2])
        stroke(0, 0, 100)
        quad(c.x1, c.y1, c.x2, c.y2, c.x3, c.y3, c.x4, c.y4)
        if (c.cercle) {
            (c.y3 - c.y1)<(c.x2 - c.x1)?diam = (c.y3 - c.y1) * 0.9:diam = (c.x2 - c.x1) * 0.9
            noStroke()
            fill(230, 100, 50)
            centrex = c.x1 + ((c.x2 - c.x1) * 0.5)
            centrey = c.y1 + ((c.y3 - c.y1) * 0.5)
            ellipse(centrex, centrey, diam, diam)
        }
        satdown ? c.col[1] -= 0.1 : c.col[1] += 0.1
    }
    count++; console.log(count)
    if (count % 400 == 0) { satdown = !satdown }
}


function brillantgen() {
    let res = 0.05
    let stepx = Math.floor(w*res)
    let stepy = Math.floor(h*res)
    let coordinates = []
    let col, x1, y1, x2, y2, x3, y3, x4, y4, cercle
    x1 = 0
    while (x1 < w) {
        y1 = 0
        x2 = x1 + Math.floor(random(1, 8)) * stepx
        if (x2 >= w) { x2 = w }
        while (y1 < h - 5 * stepy) {
            y2 = y1 + Math.floor(random(1, 8)) * stepy
            console.log("x2: "+x2+"; y2: "+y2)
            if (y2 >= h - (5 * stepy)) { y2 = h - (5 * stepy) }
            col = palette[Math.floor(random(palette.length))]
            random() < 0.5 ? cercle = true : cercle = false
            coordinates.push({ col: col, x1: x1, y1: y1, x2: x2, y2: y1, x3: x2, y3: y2, x4: x1, y4: y2, cercle: cercle })
            y1 = y2
            console.log("x1: "+x1+"; y1: "+y1)
        }
        x1 = x2
    }
    x1=0
    while (x1 < w) {
        y1 = h - 5 * stepy
        x2 = x1 + Math.floor(random(4, 8)) * stepx
        if (x2 >= w) { x2 = w }
        while (y1 < h) {
            y2 = y1 + Math.floor(random(2, 5)) * stepy
            if (y2 >= h) { y2 = h }
            col = palette[Math.floor(random(palette.length))]
            cercle = false
            coordinates.push({ col: col, x1: x1, y1: y1, x2: x2, y2: y1, x3: x2, y3: y2, x4: x1, y4: y2, cercle: cercle })
            y1 = y2
        }
        x1 = x2
    }



    for (i in coordinates) {
        c = coordinates[i]
        fill(c.col[0], c.col[1], c.col[2])
        stroke(0, 0, 100)
        quad(c.x1, c.y1, c.x2, c.y2, c.x3, c.y3, c.x4, c.y4)
        if (c.cercle) {
            (c.y3 - c.y1)<(c.x2 - c.x1)?diam = (c.y3 - c.y1) * 0.9:diam = (c.x2 - c.x1) * 0.9
            noStroke()
            fill(random(360), 100, 50)
            centrex = c.x1 + ((c.x2 - c.x1) * 0.5)
            centrey = c.y1 + ((c.y3 - c.y1) * 0.5)
            ellipse(centrex, centrey, diam, diam)
        }
    }
}


function initgrid(){
    coordinates=[]
    let xres = 0.05
    let yres = 0.05
    let xstep = xres * w
    let ystep = yres * h
    coordinates = [
        { col: palette[0], x1: 0, y1: 0, x2: xstep, y2: 0, x3: xstep, y3: ystep * 5, x4: 0, y4: ystep * 5, cercle: false },
        { col: palette[1], x1: 0, y1: ystep * 5, x2: xstep, y2: ystep * 5, x3: xstep, y3: ystep * 10, x4: 0, y4: ystep * 10, cercle: false },
        { col: palette[0], x1: 0, y1: ystep * 10, x2: xstep, y2: ystep * 10, x3: xstep, y3: ystep * 16, x4: 0, y4: ystep * 16, cercle: false },

        { col: palette[4], x1: 0, y1: ystep * 16, x2: xstep * 6, y2: ystep * 16, x3: xstep * 6, y3: ystep * 20, x4: 0, y4: ystep * 20, cercle: false },

        { col: palette[1], x1: xstep, y1: 0, x2: xstep * 6, y2: 0, x3: xstep * 6, y3: ystep, x4: xstep, y4: ystep, cercle: false },
        { col: palette[2], x1: xstep, y1: ystep, x2: xstep * 6, y2: ystep, x3: xstep * 6, y3: ystep * 8, x4: xstep, y4: ystep * 8, cercle: false },
        { col: palette[2], x1: xstep, y1: ystep * 8, x2: xstep * 6, y2: ystep * 8, x3: xstep * 6, y3: ystep * 16, x4: xstep, y4: ystep * 16, cercle: false },

        { col: palette[0], x1: xstep * 6, y1: 0, x2: xstep * 12, y2: 0, x3: xstep * 12, y3: ystep, x4: xstep * 6, y4: ystep, cercle: false },
        { col: palette[6], x1: xstep * 6, y1: ystep, x2: xstep * 12, y2: ystep, x3: xstep * 12, y3: ystep * 5, x4: xstep * 6, y4: ystep * 5, cercle: true },
        { col: palette[5], x1: xstep * 6, y1: ystep * 5, x2: xstep * 12, y2: ystep * 5, x3: xstep * 12, y3: ystep * 10, x4: xstep * 6, y4: ystep * 10, cercle: true },
        { col: palette[3], x1: xstep * 6, y1: ystep * 10, x2: xstep * 12, y2: ystep * 10, x3: xstep * 12, y3: ystep * 15, x4: xstep * 6, y4: ystep * 15, cercle: false },
        { col: palette[6], x1: xstep * 6, y1: ystep * 15, x2: xstep * 12, y2: ystep * 15, x3: xstep * 12, y3: ystep * 16, x4: xstep * 6, y4: ystep * 16, cercle: false },
        { col: palette[3], x1: xstep * 6, y1: ystep * 16, x2: xstep * 12, y2: ystep * 16, x3: xstep * 12, y3: ystep * 17, x4: xstep * 6, y4: ystep * 17, cercle: false },
        { col: palette[6], x1: xstep * 6, y1: ystep * 17, x2: xstep * 12, y2: ystep * 17, x3: xstep * 12, y3: ystep * 20, x4: xstep * 6, y4: ystep * 20, cercle: false },

        { col: palette[1], x1: xstep * 12, y1: 0, x2: xstep * 19, y2: 0, x3: xstep * 19, y3: ystep, x4: xstep * 12, y4: ystep, cercle: false },
        { col: palette[2], x1: xstep * 12, y1: ystep, x2: xstep * 19, y2: ystep, x3: xstep * 19, y3: ystep * 8, x4: xstep * 12, y4: ystep * 8, cercle: false },
        { col: palette[2], x1: xstep * 12, y1: ystep * 8, x2: xstep * 19, y2: ystep * 8, x3: xstep * 19, y3: ystep * 16, x4: xstep * 12, y4: ystep * 16, cercle: false },

        { col: palette[4], x1: xstep * 12, y1: ystep * 16, x2: xstep * 20, y2: ystep * 16, x3: xstep * 20, y3: ystep * 20, x4: xstep * 12, y4: ystep * 20, cercle: false },

        { col: palette[0], x1: xstep * 19, y1: 0, x2: xstep * 20, y2: 0, x3: xstep * 20, y3: ystep * 5, x4: xstep * 19, y4: ystep * 5, cercle: false },
        { col: palette[5], x1: xstep * 19, y1: ystep * 5, x2: xstep * 20, y2: ystep * 5, x3: xstep * 20, y3: ystep * 10, x4: xstep * 19, y4: ystep * 10, cercle: false },
        { col: palette[0], x1: xstep * 19, y1: ystep * 10, x2: xstep * 20, y2: ystep * 10, x3: xstep * 20, y3: ystep * 16, x4: xstep * 19, y4: ystep * 16, cercle: false }
    ]

}

function initgridgen(){
    coordinates=[]
    let res = 0.05
    let stepx = Math.floor(w*res)
    let stepy = Math.floor(h*res)
    let col, x1, y1, x2, y2, x3, y3, x4, y4, cercle
    x1 = 0
    while (x1 < w) {
        y1 = 0
        x2 = x1 + Math.floor(random(1, 8)) * stepx
        if (x2 >= w) { x2 = w }
        while (y1 < h - 5 * stepy) {
            y2 = y1 + Math.floor(random(1, 8)) * stepy
            console.log("x2: "+x2+"; y2: "+y2)
            if (y2 >= h - (5 * stepy)) { y2 = h - (5 * stepy) }
            col = palette[Math.floor(random(palette.length))]
            random() < 0.5 ? cercle = true : cercle = false
            coordinates.push({ col: col, x1: x1, y1: y1, x2: x2, y2: y1, x3: x2, y3: y2, x4: x1, y4: y2, cercle: cercle })
            y1 = y2
            console.log("x1: "+x1+"; y1: "+y1)
        }
        x1 = x2
    }
    x1=0
    while (x1 < w) {
        y1 = h - 5 * stepy
        x2 = x1 + Math.floor(random(4, 8)) * stepx
        if (x2 >= w) { x2 = w }
        while (y1 < h) {
            y2 = y1 + Math.floor(random(2, 5)) * stepy
            if (y2 >= h) { y2 = h }
            col = palette[Math.floor(random(palette.length))]
            cercle = false
            coordinates.push({ col: col, x1: x1, y1: y1, x2: x2, y2: y1, x3: x2, y3: y2, x4: x1, y4: y2, cercle: cercle })
            y1 = y2
        }
        x1 = x2
    }
    
}

function showgrid(){
        for (i in coordinates) {
        c = coordinates[i]
        fill(c.col[0], c.col[1], c.col[2])
        stroke(0, 0, 100)
        quad(c.x1, c.y1, c.x2, c.y2, c.x3, c.y3, c.x4, c.y4)
        if (c.cercle) {
            (c.y3 - c.y1)<(c.x2 - c.x1)?diam = (c.y3 - c.y1) * 0.9:diam = (c.x2 - c.x1) * 0.9
            noStroke()
            fill(230, 100, 50)
            centrex = c.x1 + ((c.x2 - c.x1) * 0.5)
            centrey = c.y1 + ((c.y3 - c.y1) * 0.5)
            ellipse(centrex, centrey, diam, diam)
        }
        satdown ? c.col[1] -= 0.1 : c.col[1] += 0.1
    }
    count++; console.log(count)
    if (count % 84 == 0) { satdown = !satdown }
}