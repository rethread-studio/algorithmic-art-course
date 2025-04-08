let drops = [];
let dropsSun = [];
//let dropsLake = [];
let numberDrops = 1;
let numberMountains = 4;
let loop = 0;
let WIDTH = 900;
let HEIGHT = 400;
let x = 0;
let initY = HEIGHT/4;
let oldInitY = initY;
let y = initY;

let heightSun;
let posSun;
let radiusSun;
let sunDrop = 0;

let end = false;

function setup() {
  cnv = createCanvas(WIDTH, HEIGHT);
  let sizeX = (windowWidth-width)/2;
  let sizeY = (windowHeight-height)/2;
  cnv.position(sizeX, sizeY);
  background(220);
  for (let i = 0; i < numberDrops; i++) {
    drops.push(new Drop(x,y,random(8, 12),random(0,10)));
    //dropsLake.push(new DropLake(0, HEIGHT - HEIGHT/4, 10, 0, 0.02, 2));
  }
  noStroke();

  heightSun = HEIGHT/6+30;
  posSun = random(50, WIDTH-50);
  radiusSun = random(75, 100);
  angleMode(DEGREES);

  for (let theta = -210; theta < 30; theta ++) {
    let dr = 0.02;
    let da = 2;
    if (theta <= -160 || theta >= -20) {
      dr = 0.1;
      da = 3;
    }
    dropsSun.push(new DropSun(posSun + radiusSun*cos(theta), heightSun + radiusSun*sin(theta), 10, 0, dr, da));
  }
}

function draw() {
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
  else {
    if (end == false) {
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
        if (initY == oldInitY) {
          y += random(-10, 10);
          y = constrain(y, oldInitY-30, initY+30);
        }
        else {
          y += random(-5,5);
          y = constrain(y, oldInitY-20, initY+20);
        }
        drops.push(new Drop(x,y,random(8, 12),random(0,10)));
      }
      if (x >= width && numberMountains != 0) {
        x = 0;
        oldInitY = initY;
        initY = random(initY+20, oldInitY+50);
        y = initY;
        numberMountains --;
      }
      if (numberMountains == 0) {
        end = true;
        x = 0;
      }
    }
    // else {
    //   noStroke();
    //   for (let i = dropsLake.length-1; i >= 0; i--) {
    //     dropsLake[i].move();
    //     if (dropsLake[i].r <= 0) {
    //       dropsLake.splice(i, 1);
    //       continue;
    //     }
    //     dropsLake[i].update();
    //   }
    //   loop++;
    //   if (loop % 2 == 0) {
    //     numberDrops += 1;
    //     x += 1;
    //     y += random(-5,5);
    //     y = constrain(y, (HEIGHT-HEIGHT/4)-20, (HEIGHT-HEIGHT/4)+20);
    //     dropsLake.push(new DropLake(x, y, 10, 0, 0.02, 2));
    //   }
    // }
  }
}

class Drop {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.initR = r;
    this.r = this.initR;
    this.s = 1;
    this.c = c;
    this.a = 255;
  }

  move() {
    fill(this.c, this.a);
    circle(this.x, this.y, this.r);
  }

  update() {
    this.y += this.s;
    this.x += random(-1, 1);
    this.r -= 0.1;
    this.a -= 3;
    this.c += 3;
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
    this.a = 255;
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

class DropLake {
  constructor(x, y, r, c, dr, da) {
    this.x = x;
    this.y = y;
    this.dr = dr;
    this.da = da;
    this.initR = r;
    this.r = this.initR;
    this.s = 1;
    this.red = random(70, 100);
    this.green = random(120,140);
    this.blue = random(150, 170);
    this.a = 255;
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