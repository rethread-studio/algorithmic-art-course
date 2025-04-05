let csv;
let music;
let data = [];
let index = 0;
let speed = 1;
let i = 0;


function preload() {
    music = loadSound("MoonlightSonata.mp3");
    csv = loadTable("suicides_stats_clean.csv", "csv", "header");
}

function setup() {
    createCanvas(800, 400);
    background(20);

    for (let i = 0; i < csv.getRowCount(); i++) {
        let year = int(csv.getString(i, "year"));
        let sex = csv.getString(i, "sex");
        let age = csv.getString(i, "age");
        let nombre_succide = csv.getString(i, "suicides_no");

        data.push({
            year: year,
            sex: sex,
            age: age,
            nombre_succide: nombre_succide
        });
    }

    drawSmileYellow();
    drawSmilePink();
}

function mousePressed() {
    if (!music.isPlaying()) {
        music.play();
    }
}


function draw() {
    if (i++ < 100 - speed) return;

    if (index < data.length) {
        makeBloodPoint(data[index]);
        index++;
        speed = min(speed * 1.5, 75);
        i = 0;
    } else {
        noLoop();
    }
}

function makeBloodPoint(data) {

        let size = map(data.nombre_succide, 0, 75000, 5, 50);


        let bloodColor;
        switch (data.age) {
            case "5-14 years":
            bloodColor = color('#C13617');
            break;
            case "15-24 years":
            bloodColor = color('#B21613');
            break;
            case "25-34 years":
            bloodColor = color('#A50F34');
            break;
            case "35-54 years":
            bloodColor = color('#992E16');
            break;
            case "55-74 years":
            bloodColor = color('#861C10');
            break;
            case "75+ years":
            bloodColor = color('#83110C');
            break;
            default:
            bloodColor = color('#000000');
            break;
        }
        
        let x;
        let y = height / 2;
        if (data.sex === "male") {
            x = 3 * width / 4;
        } else {
            x = width / 4;
        }
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

