(() => {
  let s, walkers, flowers;

  class RandomWalker {
    constructor(x, y, target, steps) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.steps = steps / 2;
      this.currentStep = 0;
      this.path = [];
      this.noiseOffsetX = random(1000);
      this.noiseOffsetY = random(1000);
      this.stepSize = 5;
      this.charSet = "10△▢✶✿";
      this.growthMap = new Map();
      this.stemColor = random(40, 70);
      let minDim = min(O_sectionwidth, O_sectionheight);
      this.textSize = 0.06 * minDim;
      this.spikes = []; // NEW: spike list
    }

    step() {
      if (this.currentStep >= this.steps) return;

      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let distance = sqrt(dx * dx + dy * dy);

      let noiseFactorX = map(noise(this.noiseOffsetX), 0, 1, -5, 5);
      let noiseFactorY = map(noise(this.noiseOffsetY), 0, 1, -5, 5);

      this.x += (dx / distance) * this.stepSize + noiseFactorX;
      this.y += (dy / distance) * this.stepSize + noiseFactorY;

        if (
            this.x > (this.textSize/6) && this.x < O_sectionwidth - (this.textSize/2) &&
            this.y > (this.textSize/2) && this.y < O_sectionheight - (this.textSize/6)
        ) {
            this.path.push({ x: this.x, y: this.y });
        }

      // Flower spawn
      if (
        random() < 0.015 &&
        this.x > 20 && this.x < O_sectionwidth - 20 &&
        this.y > 20 && this.y < O_sectionheight - 20
      ) {
        flowers.push(new Flower(this.x, this.y));
      }

      // Spikes every 8 steps
      if (this.path.length > 1 && this.path.length % 8 === 0) {
        let i = this.path.length - 1;
        let p1 = this.path[i - 1];
        let p2 = this.path[i];

        let angle = atan2(p2.y - p1.y, p2.x - p1.x);
        let offsetAngle = angle + HALF_PI;
        let direction = (this.spikes.length % 2 === 0) ? 1 : -1;

        let spikeLength = 12;
        let offsetX = cos(offsetAngle) * spikeLength * direction;
        let offsetY = sin(offsetAngle) * spikeLength * direction;

        this.spikes.push({
          x: p2.x + offsetX,
          y: p2.y + offsetY,
          angle: angle + PI * (direction < 0 ? 1 : 0)
        });
      }

      this.noiseOffsetX += 0.1;
      this.noiseOffsetY += 0.1;
      this.currentStep++;
    }

    display() {
      noStroke();
      fill(70, 100, this.stemColor);

      for (let i = 0; i < this.path.length; i++) {
        let p = this.path[i];
        let c = this.charSet[Math.floor(noise(i * 0.1, frameCount * 0.01) * this.charSet.length)];

        if (!this.growthMap.has(i)) this.growthMap.set(i, 0);
        let growth = this.growthMap.get(i);
        growth += 0.03;
        if (growth > 1.5) growth = 0.5;
        this.growthMap.set(i, growth);

        let alpha = map(growth, 0, 1.5, 0, 180);
        fill(70, 100, this.stemColor, alpha);

        textSize(growth * this.textSize);
        text(c, p.x, p.y);
      }

      // Draw spikes
      fill(70, 100, this.stemColor);
      noStroke();
      for (let spike of this.spikes) {
        push();
        translate(spike.x, spike.y);
        rotate(spike.angle);
        triangle(0, 0, -4, -10, 4, -10);
        pop();
      }
    }
  }

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 0;
    this.growthRate = 0.3;
    this.maxflowerSize = random(0.1, 0.15) * min(O_sectionwidth, O_sectionheight);
    this.rotationOffset = random(TWO_PI);
    this.petalLayers = 6;
    this.petalsPerLayer = 8;
  }

  grow() {
    this.size += this.growthRate;
    if (this.size > this.maxflowerSize) this.size = this.maxflowerSize;
  }

  drawPetal(x, y, angle, w, h, layerFraction) {
    push();
    translate(x, y);
    rotate(angle);

    // Compute red shade: outer = bright red, inner = deep red
    let hue = 0; // red hue
    let saturation = 80;
    let brightness = map(layerFraction, 0, 1, 90, 40); // darker inside, brighter outside
    fill(hue, saturation, brightness, 220);
    stroke(hue, saturation, brightness - 10, 200);
    strokeWeight(0.5);

    beginShape();
    vertex(0, 0);
    bezierVertex(-w * 0.8, -h * 0.1, -w * 0.6, -h * 0.8, 0, -h);
    bezierVertex(w * 0.6, -h * 0.8, w * 0.8, -h * 0.1, 0, 0);
    endShape(CLOSE);
    pop();
  }

  display() {
    push();
    translate(this.x, this.y);

    for (let layer = 0; layer < this.petalLayers; layer++) {
      let layerFraction = layer / this.petalLayers;
      let radius = layerFraction * this.size;
      let petalCount = this.petalsPerLayer + layer;

      for (let i = 0; i < petalCount; i++) {
        let angle = this.rotationOffset + (TWO_PI / petalCount) * i + layer * 0.2;
        let px = cos(angle) * radius;
        let py = sin(angle) * radius;

        let petalW = this.size * 0.2 * (1 + layerFraction);
        let petalH = this.size * 0.3 * (1 + layerFraction);

        this.drawPetal(px, py, angle, petalW, petalH, 1 - layerFraction); // reverse fraction so center is darker
      }
    }

    pop();
  }
}



  async function init() {
    s = O_currentsection;
    let centerX = O_sectionwidth / 2;
    let centerY = O_sectionheight / 2;
    let totalSteps = O_sectionduration;

    walkers = [
      new RandomWalker(centerX, centerY, { x: s.x1, y: s.y1 }, totalSteps),
      new RandomWalker(centerX, centerY, { x: s.x2, y: s.y2 }, totalSteps),
      new RandomWalker(centerX, centerY, { x: s.x3, y: s.y3 }, totalSteps),
      new RandomWalker(centerX, centerY, { x: s.x4, y: s.y4 }, totalSteps)
    ];

    flowers = [];
  }

  function draw() {
    push();
    translate(s.x, s.y);

    fill(0, 50);
    rect(0, 0, O_sectionwidth, O_sectionheight);

    for (let walker of walkers) {
      walker.step();
      walker.display();
    }

    for (let flower of flowers) {
      flower.grow();
      flower.display();
    }

    pop();
  }

  window.bitRoses = { init, draw };
})();
