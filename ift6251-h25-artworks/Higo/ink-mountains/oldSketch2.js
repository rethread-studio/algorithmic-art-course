let WIDTH = 900;
let HEIGHT = 400;

let drops = [];
let dropsSun = [];
let numberDrops = 1;
let numberMountains = 3;
let loop = 0;
let x = 0;

let initY = HEIGHT/3;
let oldInitY = initY;
let y = initY;

let startPoint = 0;
let previousStartPoint;
let endPoint = WIDTH;
let previousEndPoint;

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
  // First drop
  //startPoint = random(0, WIDTH/6);
  //previousStartPoint = startPoint;
  //endPoint = random(WIDTH - WIDTH/6, WIDTH);
  //previousEndPoint = endPoint;
  for (let i = 0; i < numberDrops; i++) {
    drops.push(new Drop(startPoint,y,random(radiusInf, radiusSup)));
  }
  noStroke();

  heightSun = HEIGHT/6+30;
  posSun = random(50, WIDTH-50);
  //radiusSun = random(75, 100);
  radiusSun = random(WIDTH/12, WIDTH/9);
  angleMode(DEGREES);

  // Construct the sun
  for (let theta = -210; theta < 30; theta ++) {
    let dr = 0.016*(WIDTH/radiusSun/2);
    let da = 0.01*(WIDTH/radiusSun/2);
    if (theta <= -160 || theta >= -20) {
      dr = 0.035*(WIDTH/radiusSun);
      da = 0.1*(WIDTH/radiusSun);
    }
    dropsSun.push(new DropSun(posSun + radiusSun*cos(theta), heightSun + radiusSun*sin(theta), 10, 0, dr, da));
  }
}

function draw() {
  // Drawing Sun
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

  // Drawing mountains
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
      y += random(-5,5);
      y = constrain(y, oldInitY-15, initY+20);
      drops.push(new Drop(x,y,random(radiusInf, radiusSup)));
    }
    if (x >= endPoint && numberMountains != 0) {
      //previousStartPoint = startPoint;
      //previousEndPoint = endPoint;
      //startPoint = random(0, WIDTH/6);
      //endPoint = random(WIDTH - WIDTH/6, WIDTH);
      x = startPoint;
      oldInitY = initY;
      initY = random(initY+30, initY+50);
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
    this.lifeReduction = random(0.15, 0.3)*(this.initR/4)*(this.y/HEIGHT);
    this.s = 1;
  
    this.red = 39;
    this.green = 45;
    this.blue = 56;

    this.lifeSpan = ((5/(numberMountains+1))*0.85*this.y - 0.3*HEIGHT)/HEIGHT;
    this.a = 255*this.lifeSpan;
  }

  move() {
    fill(this.red, this.green, this.blue, this.a);
    circle(this.x, this.y, this.r);
  }

  update() {
    this.y += this.s;
    this.x += random(-1, 1);
    this.r -= this.lifeReduction;
    this.red = map(this.r, 0, this.initR, 255, 39);
    this.green = map(this.r, 0, this.initR, 255, 45);
    this.blue = map(this.r, 0, this.initR, 255, 56);
    this.lifeSpan = ((5/(numberMountains+1))*0.85*this.y - 0.3*HEIGHT)/HEIGHT;
    this.a = 255*this.lifeSpan;
  }
}

class DropSun {
  constructor(x, y, r, c, dr, da) {
    this.x = x;
    this.y = y;
    this.dr = dr;
    this.da = da;
    this.initR = r;
    this.r = this.initR;
    this.s = 1;
    this.red = random(225, 255);
    this.green = random(40,110);
    this.blue = random(15, 30);
    this.a = 50;
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