// Canvas Configuration
let WIDTH = 1400;
let HEIGHT = 800;

let lSystem;
let numberRecursions = 7;
let sequence;
let x = 0;
let y = 0;

let numberTrees;
let trees = [];
let trunkPieces = 10;
let lenInf = 100;
let lenSup = 180;

let numberStars = 42;
let stars = [];
let numberShootingStars = 1;
let shootingStars = [];

let c1;
let c2;
let background = true;

function setGradient(c1, c2, end=height, begin=0) {
  noFill();
  for (var y = begin; y < end; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function setup() {
  WIDTH = windowWidth;
  HEIGHT = windowHeight;
  cnv = createCanvas(WIDTH, HEIGHT);
  let sizeX = (windowWidth-WIDTH)/2;
  let sizeY = (windowHeight-HEIGHT)/2;
  cnv.position(sizeX, sizeY);
  angleMode(DEGREES);
  frameRate(30);

  loadRule();

  numberTrees = floor(random(4,7));

  for (let i = 0; i < numberTrees; i++) {
    trees[i] = new Tree();
    trees[i].generate();
  }

  for (let i = 0; i < numberStars; i++) {
    stars[i] = new Stars();
  }

  for (let i = 0; i < numberShootingStars; i++) {
    shootingStars[i] = new Shooting();
  }

  c1 = color(40,15,54,255);
  c2 = color(240,159,156,255);
  setGradient(c1, c2);
}

function draw() {
  stroke(0);
  if (background) {
    c1 = color(40,15,54,255);
    c2 = color(240,159,156,255);
    setGradient(c1, c2);
    background = false;
  } else {
    setGradient(color(40,15,54,50), color(240,159,156,50), end=HEIGHT/2, begin=0);
    setGradient(color(40,15,54,200), color(240,159,156,200), end=HEIGHT, begin=HEIGHT/2);
  }
  // c1 = color(40,15,54,200);
  // c2 = color(240,159,156,200);
  // setGradient(c1, c2);

  for (let i = 0; i < numberStars; i++) {
    stars[i].update();
    stars[i].draw();
  }

  for (let i = 0; i < numberShootingStars; i++) {
    if (random() < 0.05) {
      shootingStars[i].revive()
    }
    shootingStars[i].update();
    shootingStars[i].draw();
  }

  for (let i = 0; i < numberTrees; i++) {
    push();
    stroke(0);
    trees[i].draw();
    pop();
  }
  //noLoop();
}

function loadRule() {
    // Fucking tree
    // lSystem = {
    //     "axiom" : "Z",
    //     "rules" : {
    //     "A" : "FF+[+FZ-[Z]-Z]-FF[F-[FZ]+Z]+[ZF-F+[Z]FF]R",
    //     "B" : "FF-[F-[Z]F+FZ+F[Z]]+FF-[+FF[FZ]-[FZ]]-[+F[Z]]R"
    //     },
    //     "constants" : {
    //     "[" : push,
    //     "]" : pop
    //     }
    // };

    lSystem = {
        "axiom" : "TZ",
        "rules" : {
          0 : "[+FZ[-FZ]]F[-FZ]",
          1 : "[-FZ[+FZ]]F[+FZ]",
          2 : "[[+F[FZ]][-F[FZ]]]+F[FZ]",
          3 : "[-[F[FZ]][+F[FZ]]]-F[FZ]",
          "F" : "F"
        },
        "constants" : {
          "numberRules" : 4,
          "[" : push,
          "]" : pop
        }
    };
}

function doRecursion(n) {
  let currentSeq = lSystem["axiom"];
  let nextSeq = "";
  if (n == 0) {
    return currentSeq;
  } 
  while (n != 0) {
    for (let i = 0; i < currentSeq.length; i++) {
      let variable = currentSeq[i];
      if (variable == "Z") {
        nextSeq = nextSeq.concat(lSystem["rules"][floor(random(lSystem["constants"]["numberRules"]))]);
      } else if (variable in lSystem["rules"]) {
        nextSeq = nextSeq.concat(lSystem["rules"][variable]);
      } else {
        nextSeq = nextSeq.concat(variable);
      }
    }
    currentSeq = nextSeq;
    nextSeq = "";
    n -= 1;
  }
  return currentSeq;
}

function applyRule() {
  for (let i = 0; i < sequence.length; i++) {
    let variable = sequence[i];
    if (variable == "F") {
      strokeWeight(lineWeight);
      line(x, y, x, y-scale*len);
      translate(0, -scale*len);
    } else if (variable == "T") {
      strokeWeight(lineWeight);
      drawTrunk();
    } else if (variable == "+") {
      rotate(angle+15*noise(len));
    } else if (variable == "-") {
      rotate(-angle+15*noise(len));
    } else if (variable == "[") {
      len *= 0.85;
      lineWeight *= 0.85;
      push();
    } else if (variable == "]") {
      len /= 0.85;
      lineWeight /= 0.85;
      pop();
    }
  }
}

class Stars {
  constructor() {
    this.x = random(WIDTH);
    this.y = random(20, HEIGHT/3);
    this.r = random(0.25, 3);

    this.lifeTime = floor(random(42));
  }

  update() {
    this.lifeTime += 1;
    this.r += 0.01*sin(this.lifeTime);
  }

  draw() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.r, this.r);
    noFill();
  }
}

class Shooting {
  constructor() {
    this.fallingSide = random();
    this.x = random(50, WIDTH-50);
    this.y = random(20, HEIGHT/3);
    this.r = random(0.25, 3);
    this.fallingSpeed = random(0.5, 2);

    this.lifeTime = random(30, 80);
    this.lifeReduction = 1;
    this.dead = true;
  }

  revive() {
    if (this.dead) {
      this.fallingSide = random();
      this.x = random(50, WIDTH-50);
      this.y = random(20, HEIGHT/3);
      this.r = random(0.5, 3);
      this.fallingSpeed = 1;

      this.lifeTime = floor(random(30, 80));
      this.lifeReduction = 1;
      this.dead = false;
    }
  }

  update() {
    if (this.fallingSide < 0.5) {
      this.x -= 2;
    } else {
      this.x += 2;
    }
    this.y += this.fallingSpeed;
    this.lifeTime -= this.lifeReduction;
    if (this.lifeTime <= 0) {
      this.dead = true;
    }
  }

  draw() {
    if (!this.dead) {
      noStroke();
      fill(255);
      ellipse(this.x, this.y, this.r, this.r);
      noFill();
    }
  }
}

class Tree {
  constructor() {
    this.sequence = "";
    this.scale = random(0.2, 0.3);
    this.len = random(lenInf, lenSup);
    this.lw = map(this.len, lenInf, lenSup, 9, 15);
    this.angle = 35;
    this.posX = random(WIDTH);
    this.posY = random(HEIGHT, HEIGHT+50);

    this.windAngle = random(6,15);
    this.windSpeed = random(0.01, 0.04);
    this.rigidity = map(this.len, 10, lenSup, 1.0, 0.2);
    this.windDiff = this.windAngle*(noise(frameCount*this.windSpeed)-0.05)*this.rigidity;

    this.trunkAngles = [];
  }

  generate() {
    this.sequence = doRecursion(numberRecursions);
    console.log(this.sequence);

    for (let i = 0; i < trunkPieces; i++) {
      this.trunkAngles[i] = random(-5,5);
    }
  }

  drawTrunk() {
    for (let i = 0; i < trunkPieces; i++) {
      strokeWeight(this.lw);
      rotate(this.trunkAngles[i]);
      line(x, y, x, y-this.len/trunkPieces);
      translate(0, -this.len/trunkPieces);
      this.lw *= 0.9;
    }
  }

  draw() {
    translate(this.posX, this.posY);
    for (let i = 0; i < this.sequence.length; i++) {
      let variable = this.sequence[i];
      if (variable == "F") {
        strokeWeight(this.lw);
        line(x, y, x, y-this.scale*this.len);
        translate(0, -this.scale*this.len);
      } else if (variable == "T") {
        strokeWeight(this.lw);
        this.drawTrunk();
      } else if (variable == "+") {
        this.rigidity = map(this.len, 10, lenSup, 1.0, 0.2);
        this.windDiff = this.windAngle*(noise(frameCount*this.windSpeed)-0.05)*this.rigidity;
        rotate(this.angle+15*noise(this.len)+this.windDiff);
      } else if (variable == "-") {
        this.rigidity = map(this.len, 10, lenSup, 1.0, 0.2);
        this.windDiff = this.windAngle*(noise(frameCount*this.windSpeed)-0.05)*this.rigidity;
        rotate(-this.angle+15*noise(this.len)+this.windDiff);
      } else if (variable == "[") {
        this.len *= 0.85;
        this.lw *= 0.8;
        push();
      } else if (variable == "]") {
        this.len /= 0.85;
        this.lw /= 0.8;
        pop();
      }
    }
    this.lw /= 0.9**trunkPieces;
  }
}
