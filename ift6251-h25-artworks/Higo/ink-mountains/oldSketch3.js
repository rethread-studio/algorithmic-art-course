let WIDTH = 700;
let HEIGHT = 400;

let drops = [];
let dropsSun = [];
let numberDrops = 1;
let numberMountains = 4;
let loop = 0;

let x = 0;
let initY = HEIGHT/5;
let oldInitY = initY;
let y = initY;

let heightSun;
let posSun;
let radiusSun;
let sunDrop = 0;

let radiusInf = 4;
let radiusSup = 6;

function setup() {
  cnv = createCanvas(WIDTH, HEIGHT);
  let sizeX = (windowWidth-width)/2;
  let sizeY = (windowHeight-height)/2;
  cnv.position(sizeX, sizeY);
  background(220);
  for (let i = 0; i < numberDrops; i++) {
    drops.push(new Drop(x,y,random(radiusInf, radiusSup)));
  }
  noStroke();

  heightSun = HEIGHT/6;
  posSun = random(50, WIDTH-50);
  radiusSun = random(WIDTH/12, WIDTH/9);
  angleMode(DEGREES);

  for (let theta = -210; theta < 30; theta ++) {
    let radius = random(radiusInf, radiusSup);
    let dr = radius/(2*radiusSun);
    let da = 200/(2*radiusSun);
    if (theta <= -160 || theta >= -20) {
      dr = radius/(0.5*radiusSun);
      da = 3;
    }
    dropsSun.push(new DropSun(posSun + radiusSun*cos(theta), heightSun + radiusSun*sin(theta), radius, dr, da));
  }
}

function draw() {
  // Draw sun
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
      y += random(-5, 5);
      y = constrain(y, oldInitY-15, initY+20);
      drops.push(new Drop(x,y,random(radiusInf, radiusSup)));
    }
    if (x >= width && numberMountains != 1) {
      x = 0;
      oldInitY = initY;
      initY = random(initY+30, oldInitY+50);
      y = initY;
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
    this.s = 1;

    this.red = 39;
    this.green = 45;
    this.blue = 56;

    this.a = 255;
  }

  move() {
    fill(this.red, this.green, this.blue, this.a);
    circle(this.x, this.y, this.r);
  }

  update() {
    this.y += this.s;
    this.x += random(-1, 1);
    this.r -= 0.1;

    this.red = map(this.r, 0, this.initR, 255, 39);
    this.green = map(this.r, 0, this.initR, 255, 45);
    this.blue = map(this.r, 0, this.initR, 255, 56);

    this.a -= 3;
  }
}

class DropSun {
  constructor(x, y, r, dr, da) {
    this.x = x;
    this.y = y;
    this.s = 1;

    this.initR = r;
    this.r = this.initR;
    this.dr = dr;
    
    this.red = random(225, 255);
    this.green = random(40,110);
    this.blue = random(15, 30);
    
    this.a = 200;
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