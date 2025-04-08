let besuText = "c o m . f a s t e r x m l : c l a s s m a t e : 1 . 5 . 1 ,   c o m . g i t h u b . j k n a c k : h a n d l e b a r s - h e l p e r s : 4 . 3 . 1"
let commonText = input_text = "c o m . f a s t e r x m l . j a c k s o n : j a c k s o n - b o m : 2 . 1 8 . 0 c o m . g i t h u b . b e n - m a n e s . c a f f e i n e : c a f f e i n e : 3 . 1 . 8";
let tekuText = "c o m . e t h l o . t i m e : i t u : 1 . 7 . 0 c o m . f a s t e r x m l . j a c k s o n . c o r e : j a c k s o n - a n n o t a t i o n s : 2 . 1 8 . 2";


let besuColor;
let tekuColor;
let commonColor;

const noiseScale = 0.01;
let besuParticles = [];
let tekuParticles = [];
let commonParticles = [];
let currentIteration = 0; 

function setup() {
    createCanvas(1500, 800);
    colorMode(HSB);
    background(0, 0, 0);

    besuText = besuText + " " + besuText + " " + besuText; 
    commonText = commonText + " " + commonText + " " + commonText;
    tekuText = tekuText + " " + tekuText + " " + tekuText;   

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

// Ensure particles stay inside the canvas
function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}


