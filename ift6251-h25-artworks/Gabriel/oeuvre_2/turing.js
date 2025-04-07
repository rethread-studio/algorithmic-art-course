let nombre_case_v = 21;
let nombre_case_h = 21;
let grid = [];
let colonnes , range ;
let caseLargeur, caseHauteur;
let Scale = 3.0;
let ScaleFin = 1.0;
let Compteur = 0;
let tickSound;
let lastSound = 0;
let soundInterval = 1000;

function preload() {
    tickSound = loadSound('clock.mp3');
}

function setup() {
    frameRate(30);
    createCanvas(800, 800);
    colonnes  = nombre_case_h;
    range  = nombre_case_v;
    caseLargeur = width / colonnes ;
    caseHauteur = height / range ;
    textAlign(CENTER, CENTER);
    textSize(caseLargeur * 0.5);

    for (let i = 0; i < range ; i++) {
        grid[i] = [];
        for (let j = 0; j < colonnes ; j++) {
            grid[i][j] = {
                angle: random(TWO_PI),
                speed: random(-0.05, 0.05),
                char: String.fromCharCode(65 + int(random(26))),
                couleur: random([0,1])
            };
        }
    }
}

function draw() {
    background(255);
    
    push();
    Scale = lerp(Scale, ScaleFin, 0.01);
    translate(width/2, height/2);
    scale(Scale);
    translate(-width/(2*Scale), -height/(2*Scale));
    

    for (let i = 0; i < range ; i++) {
        for (let j = 0; j < colonnes ; j++) {
            grid[i][j].angle += grid[i][j].speed;
        }
    }

    playSound();
    Compteur++;
    if (Compteur >= 15) {
        updateGrid();
        Compteur = 0;
    }
    drawGrid();
    pop();
}

function playSound() {
    if (millis() - lastSound > soundInterval) {
        tickSound.play();
        lastSound = millis();
    }
}

function updateGrid() {
    let newGrid = [];
    for (let i = 0; i < range ; i++) {
        newGrid[i] = [];
        for (let j = 0; j < colonnes ; j++) {
            let voisins = getLettreVoisins(i, j);
            let newValue = calculerLeNouveauChar(grid[i][j], voisins);
            newGrid[i][j] = {
                angle: grid[i][j].angle,
                speed: grid[i][j].speed + random(-0.005, 0.005),
                char: newValue.char,
                couleur: newValue.couleur
            };
        }
    }
    grid = newGrid;
}

function drawGrid() {
    for (let i = 0; i < range ; i++) {
        for (let j = 0; j < colonnes ; j++) {
            let x = j * caseLargeur + caseLargeur/2;
            let y = i * caseHauteur + caseHauteur/2;
            push();
            translate(x, y);
            if(grid[i][j].couleur == 0){
                noFill();
            }
            stroke(0);
            ellipse(0, 0, caseLargeur * 0.8);
            rotate(grid[i][j].angle);
            stroke(0);
            fill(0);
            triangle(caseLargeur * 0.35, 0, caseLargeur * 0.25, -5, caseLargeur * 0.25, 5);
            pop();
            fill(0);
            noStroke();
            text(grid[i][j].char, x, y);
        }
    }
}


function getLettreVoisins(i, j) {
    let voisins = [];
    for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
            if (k === 0 && l === 0) continue;
            let case_r = (i + k + range ) % range ;
            let case_c = (j + l + colonnes ) % colonnes ;
            voisins.push(grid[case_r][case_c].char);
            voisins.push(grid[case_r][case_c].couleur);
        }
    }
    return voisins;
}

function calculerLeNouveauChar(currentChar, voisins) {
    let currentValue = currentChar.char.charCodeAt() - 65;
    let sum = 0;
    let sumCouleur = 0;
    for (let i = 0; i < voisins.length; i+=2) {
        sum += (voisins[i].charCodeAt() - 65);
        sumCouleur += voisins[i+1];
    }
    let average = sum / (voisins.length/2);
    let newValue = {
        char : String.fromCharCode(65 + floor((currentValue + average) % 26)),
        couleur : 0
    }
    if ((currentChar.couleur == 1 && sumCouleur == 2) || sumCouleur == 3) {
        newValue.couleur = 1;
    }
    return newValue;
}