let font;

function preload() {
    font = loadFont('./font/vermin-vibes-2-soft-font/VerminVibes2Soft-grr4.ttf');
}

// Fait le contour de la flèche principale pour pouvoir écraser les flèches qui dépassent
function draw_main_arrow() {
    x = width / 2;
    y = height / 2 - height / 5;
    angle = radians(180);
    let arrowWidth = 80;
    
    push();
    rect(x + arrowWidth, 0, width * 2, height * 2);

    translate(x, y);
    rotate(angle);
    noStroke();

    quad(-arrowWidth / 2, -height * 2, -arrowWidth / 2, 0, -arrowWidth / 2 - width * 2, 0, -width * 2, -height * 2);
    quad(arrowWidth / 2, -height * 2, arrowWidth / 2, 0, arrowWidth / 2 + width * 2, 0, width * 2, -height * 2);
    quad(-arrowWidth / 2, -400, arrowWidth / 2, -400, arrowWidth / 2, -height * 2, -arrowWidth / 2, -height * 2);
    quad(-arrowWidth / 2 - 40, 0, -width * 2, height * 2, width * 2, 120, 0, 120);
    quad(0, 120, arrowWidth / 2 + 40, 0, width * 2, -height * 2, width * 2, height * 2);
    quad(0, 120, -arrowWidth / 2 - 40, 0, -width * 2, height * 2, -width * 2, -height * 2);

    pop();
}

// Dessine une flèche perpendiculaire de manière aléatoire
function draw_perpendicular_arrow() {
    let mainArrowTop = height / 2 - height / 5 - 80;
    let mainArrowBottom = height / 2 - height / 5 + 400;

    let arrowHeight = random(mainArrowTop, mainArrowBottom);
    let arrowWidth = random(20, 100);
    let arrowLength = random(100, 300);
    let direction = random() > 0.5 ? 1 : -1;

    push();
    translate(width / 2 + random(-194, 194), arrowHeight);
    fill(random(255), random(255), random(255));
    noStroke();
    rect(0, -arrowWidth / 2, direction * arrowLength, arrowWidth);
    triangle(direction * arrowLength, -arrowWidth / 2 - 20, direction * arrowLength, arrowWidth / 2 + 20, direction * arrowLength + direction * 40, 0);
    pop();

}

function setup() {
    let div = createDiv();
    let canvas = createCanvas(800, 800);
    canvas.parent(div);
    div.style('text-align', 'center');
    background(255);
}

function draw() {
    background(0);

    nbArrow = random(84, 84 + 26);
    for (let i = 0; i < nbArrow; i++) {
        draw_perpendicular_arrow();
    }

    // si dans les 100 premières albums, met le background en Gold
    album_number = int(random(1,1000))
    if(album_number < 100){
        fill(239,191,4)
        draw_main_arrow()
    }else{
        fill(255)
        draw_main_arrow()
    }

    //écrire tous ce qui doit être écrit
    fill(0);
    textFont(font);
    textSize(128);
    textAlign(CENTER, TOP);
    text('U', width / 2 - 42-13, 10);
    text('P', width / 2 + 42+13, 10);
    text('ASCII', width / 2, height - 142);
    text('#101', width -42-13, height - 10);  
    noLoop();
}
