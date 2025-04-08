let csv;
let music;
let data = [];
let index = 0;
let speed = 1;
let i = 0;

function setup() {
    createCanvas(800, 400);
    background(20);


    drawSmileYellow();
    drawSmilePink();
}


function draw() {
    if (i++ < 100 - speed) return;

    if (index < 300) {
        makeBloodPoint();
        index++;
        speed = min(speed * 1.5, 75);
        i = 0;
    } else {
        noLoop();
    }
}

function makeBloodPoint() {

        let x;
        let y = height / 2;
        let nombre_succide;
        if (index % 2 === 0) {
            x = 3 * width / 4;
            nombre_succide = floor(random(10000, 75000));
        } else {
            x = width / 4;
            nombre_succide = floor(random(2000, 20000));
        }

        let size = map(nombre_succide, 0, 75000, 5, 50);


        const colors = [
            color('#992E16'),
            color('#861C10'),
            color('#A50F34'),
            color('#B21613'),
            color('#83110C'),
            color('#C13617'),
        ];

        let bloodColor = random(colors);
        
        
        // Pour faire que les points soient dans le cercle
        let rayon = sqrt(random()) * 140;
        let angle = random(TWO_PI);
        x = x + rayon * cos(angle);
        y = y + rayon * sin(angle);


        noStroke();
        fill(bloodColor);
        ellipse(x, y, size, size);
}


function drawSmileYellow() {
    push();
    translate(width / 2, 0);
        // cercle jaune
        noStroke();
        fill(255, 207, 0);
        ellipse(width / 4, height / 2, 300, 300);
        // yeux
        fill(0);
        ellipse(width / 6, height / 3 +21, 25, 60);
        ellipse(width/2 - (width / 6), height / 3 +21, 25, 60);
        // sourire
       stroke(0);
       strokeWeight(6);
       noFill();
       arc(width / 4, width / 3, (3 * width) / 14, width / 8, 0, PI);
       fill(0);
       push();
       translate((width / 4) - ((3 * width) / 14) / 2,  width / 3);
       rotate(-PI / 6);
       ellipse(0, 0, 25, 8);
       pop();
       push();
       translate((width / 4) + ((3 * width) / 14) / 2, width / 3);
       rotate(PI / 6);
       ellipse(0, 0, 25, 8);
       pop();
       pop();
}

function drawSmilePink() {

    // cercle jaune
    noStroke();
    fill("#FF69B4");
    ellipse(width / 4, height / 2, 300, 300);
    // yeux
    fill(0);
    ellipse(width / 6, height / 3 +21, 25, 60);
    ellipse(width/2 - (width / 6), height / 3 +21, 25, 60);
    // sourire
   stroke(0);
   strokeWeight(6);
   noFill();
   arc(width / 4, width / 3, (3 * width) / 14, width / 8, 0, PI);
   fill(0);
   push();
   translate((width / 4) - ((3 * width) / 14) / 2,  width / 3);
   rotate(-PI / 6);
   ellipse(0, 0, 25, 8);
   pop();
   push();
   translate((width / 4) + ((3 * width) / 14) / 2, width / 3);
   rotate(PI / 6);
   ellipse(0, 0, 25, 8);
   pop();
}

