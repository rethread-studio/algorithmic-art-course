let besuText = "";
let tekuText = "";
let commonText = "";
let besuColor;
let tekuColor;
let commonColor;

function preload() {
    besuText = loadStrings('data/besu_filtered_dependencies.txt');
    commonText = loadStrings('data/overlap_with_version-25.1.0.txt');
    tekuText = loadStrings('data/teku_filtered_dependencies.txt');
}

const noiseScale = 0.01;
let besuParticles = [];
let tekuParticles = [];
let commonParticles = [];
let currentIteration = 0; 

function setup() {
    createCanvas(1500, 800);
    colorMode(HSB);
    background(0, 0, 0);

    // Join all text lines into a single paragraph
    besuText = besuText.join(' ');
    commonText = commonText.join(' ');
    tekuText = tekuText.join(' ');

    besuColor = color(320, 100, 100);  
    commonColor = color(50, 100, 100); 
    tekuColor = color(200, 100, 100);  

    let clusterHeight = height / 6; // Small height range for clustering
    let spacing = height / 4; // Center spacing for each cluster

    // Besu 
    for (let i = 0; i < besuText.length; i++) {
        besuParticles.push({ pos: createVector(random(width), random(spacing - clusterHeight, spacing + clusterHeight)), col: besuColor, letter: besuText[i] });
    }
    // Common 
    for (let i = 0; i < commonText.length; i++) {
        commonParticles.push({ pos: createVector(random(width), random(2 * spacing - clusterHeight, 2 * spacing + clusterHeight)), col: commonColor, letter: commonText[i] });  
    }
    // Teku 
    for (let i = 0; i < tekuText.length; i++) {
        tekuParticles.push({ pos: createVector(random(width), random(3 * spacing - clusterHeight, 3 * spacing + clusterHeight)), col: tekuColor, letter: tekuText[i] });
    }
}

function draw() {
    if (currentIteration === 1){
        drawParticles(currentIteration);
        currentIteration++; 
        return;
    }
    else if (currentIteration < 80) {
        currentIteration++; 
        return;
    }
    background(0, 0, 0, 0.01);
    drawParticles(currentIteration);
}

function drawParticles(i) {
    // Draw and update Besu particles
    for (let p of besuParticles) {
        stroke(p.col);
        fill(0);
        text(p.letter, p.pos.x, p.pos.y);
        updateParticle(p);
    }

    // Draw and update Common particles
    for (let p of commonParticles) {
        stroke(p.col);
        fill(0);
        text(p.letter, p.pos.x, p.pos.y);
        updateParticle(p);
    }

    // Draw and update Teku particles
    for (let p of tekuParticles) {
        stroke(p.col);
        fill(0);
        text(p.letter, p.pos.x, p.pos.y);
        updateParticle(p);
    }
}


// Perlin Noise
function updateParticle(p) {
    let n = noise(p.pos.x * noiseScale, p.pos.y * noiseScale);
    let a = TAU * n;
    p.pos.x += cos(a);
    p.pos.y += sin(a);

    if (!onScreen(p.pos)) {
        p.pos.x = random(width);
        p.pos.y = random(height);
    }
}


// Sinusoidal Waves
// let time = 0;

// function updateParticle(p) {
//     p.pos.x += sin(time + p.pos.y * 0.01) * 2;
//     p.pos.y += cos(time + p.pos.x * 0.01) * 2;
    
//     time += 0.001;
// }

// // Cellular Automata
// function updateParticle(p, index) {
//     let n = (index % 2 === 0) ? 1 : -1;
//     p.pos.x += n * 2;
//     p.pos.y += sin(p.pos.x * 0.01) * 2;
// }

// // Brownian Motion (Random Walk)
// function updateParticle(p) {
//     p.pos.x += random(-1, 1);
//     p.pos.y += random(-1, 1);
// }


// Ensure particles stay inside the canvas
function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
