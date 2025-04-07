// Size of the canvas
let WIDTH = 700;
let HEIGHT = 400;

// Drops and mountains
let drops = [];
let dropsSun = [];
let numberDrops = 1;
let numberMountains;
let loop = 0;

// Position of drops
let x;
let totalX;
let y;
let initY;
let noiseLevel;
let noiseScale;
let seed;

// Size of the sun
let heightSun;
let posSun;
let radiusSun;
let sunDrop = 0;

// Radius of drops
let radiusInf = 4;
let radiusSup = 6;

// Better without it 
// // Background music
// let backgroundSound;

// function preload() {
//   soundFormats('mp3');
//   let r = random();
//   if (r < 0.33) {
//     backgroundSound = loadSound("music/music1.mp3");
//   } else if (r < 0.66) {
//     backgroundSound = loadSound("music/music2.mp3");
//   } else {
//     backgroundSound = loadSound("music/music3.mp3");
//   }
// }

function setup() {
  // Create canvas
  cnv = createCanvas(WIDTH, HEIGHT);
  let sizeX = (windowWidth-width)/2;
  let sizeY = (windowHeight-height)/2;
  cnv.position(sizeX, sizeY);
  // background(220);
  background(235, 224, 197);
  //backgroundMusic();

  // Seed used for Perlin noise
  seed = random(width*height);
  noiseLevel = random(50, 100);
  noiseScale = random(0.01, 0.03);

  // First drop
  let r = random();
  if (r < 0.5) {
    numberMountains = 3;
  } else {
    numberMountains = 4;
  }
  x = 0;
  totalX = 0;
  initY = random(HEIGHT/7, HEIGHT/5);
  y = initY + noiseLevel*noise(noiseScale*seed);

  for (let i = 0; i < numberDrops; i++) {
    drops.push(new Drop(x,y,random(radiusInf, radiusSup)));
  }
  noStroke();

  // Settings Sun 
  heightSun = HEIGHT/5;
  posSun = random(50, WIDTH-50);
  radiusSun = random(WIDTH/12, WIDTH/9);
  angleMode(DEGREES);

  // Sun drops
  for (let theta = -195; theta < 15; theta ++) {
    let radius = random(radiusInf, radiusSup);
    // Different dr and da according of the angle theta = drops don't run the same way
    let dr = radius/(2*radiusSun);
    let da = 200/(2*radiusSun);
    if (theta <= -155 || theta >= -25) {
      dr = radius/(0.6*radiusSun);
      da = 200/(0.6*radiusSun);;
    }
    dropsSun.push(new DropSun(posSun + radiusSun*cos(theta), heightSun + radiusSun*sin(theta), radius, dr, da));
  }
}

// function backgroundMusic() {
//   backgroundSound.play();
//   backgroundSound.loop();
//   backgroundSound.setVolume(0.05);
//   userStartAudio(true);
// }

function draw() {
  // Draw sun | loop allows to draw the sun only once and then draw the mountains
  if (loop == 0) {
    if (sunDrop < dropsSun.length-1) {
      sunDrop ++;
    }
    for (let i = sunDrop-1; i >= 0; i--) {
      dropsSun[i].move();
      if (dropsSun[i].r <= 0 || dropsSun[i].a <= 0) {
        dropsSun.splice(i, 1);
        sunDrop--;
        continue;
      }
      dropsSun[i].update();
    }

    if (sunDrop == 0) {
      loop++;
    }
  }

  // Draw mountains
  else {
    noStroke();
    for (let i = drops.length-1; i >= 0; i--) {
      drops[i].move();
      if (drops[i].r <= 0) {
        drops.splice(i, 1);
        continue;
      }
      drops[i].update();
    }
    loop++;
    if (loop % 2 == 0) {
      numberDrops += 1;
      x += 1;
      totalX += 1;
      y = initY + noiseLevel*noise(noiseScale*(seed+totalX));
      drops.push(new Drop(x,y,random(radiusInf, radiusSup)));
    }
    if (x >= width && numberMountains != 1) {
      x = 0;
      seed = random(width*height);
      initY += random(30, 50);
      noiseLevel += random(10, 20);
      y = initY + noiseLevel*noise(noiseScale*(seed+totalX));
      numberMountains --;
    }
  }
}

class Drop {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;

    this.initR = r;
    this.r = this.initR;
    // The speed of reduction of the redius
    this.lifeReductionStep = 0;
    this.lifeReduction = this.lifeReductionStep*2/height;
    this.s = 1;
  
    this.red = 39;
    this.green = 45;
    this.blue = 56;

    // Specific value chosen to make the drop vanished not too fast
    this.lifeSpan = (this.y/(1.66*height));
    this.initA = random(200,255);
    this.a = this.initA*this.lifeSpan;
  }

  move() {
    fill(this.red, this.green, this.blue, this.a);
    circle(this.x, this.y, this.r);
  }

  update() {
    this.y += this.s;
    this.x += random(-1, 1);

    this.lifeReductionStep += this.s;
    this.lifeReduction = this.lifeReductionStep*2/height;
    this.r -= this.lifeReduction;

    this.red = map(this.r, 0, this.initR, 255, 39);
    this.green = map(this.r, 0, this.initR, 255, 45);
    this.blue = map(this.r, 0, this.initR, 255, 56);

    this.lifeSpan = (this.y/(1.66*height))
    this.a = this.initA*this.lifeSpan;
  }
}

// Kind of a copy of the previous class but with a simpler configuration
class DropSun {
  constructor(x, y, r, dr, da) {
    this.x = x;
    this.y = y;
    this.s = 1;

    this.initR = r;
    this.r = this.initR;
    this.dr = dr;
    
    this.red = 193 + random(-5, 5);
    this.green = 43 + random(-5, 5);
    this.blue = 23 + random(-5, 5);
    
    this.a = random(150, 180);
    this.da = da;
  }

  move() {
    fill(this.red, this.green, this.blue, this.a);
    circle(this.x, this.y, this.r);
  }

  update() {
    this.y += this.s;
    this.x += random(-1, 1);
    this.r -= this.dr;
    this.a -= this.da;
    this.c += 3;
  }
}