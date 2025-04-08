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
        this.noiseOffsetX = random(1000); // For Perlin noise-based movement
        this.noiseOffsetY = random(1000);
        this.stepSize = 5; // Determines the amount of movement per step
        this.charSet = "10△▢✶✿"; // Character set
        this.growthMap = new Map(); // Map to track growth of letters
        this.stemColor = random(40, 70);
        let minDim = min(O_sectionwidth, O_sectionheight);
        this.textSize = 0.06 * minDim
    }

    step() {
        if (this.currentStep >= this.steps) return;

        // Calculate direction towards the target
        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Add Perlin noise-based randomness to movement
        let noiseFactorX = map(noise(this.noiseOffsetX), 0, 1, -5, 5);
        let noiseFactorY = map(noise(this.noiseOffsetY), 0, 1, -5, 5);

        // Move with randomness but also toward the target
        this.x += (dx / distance) * this.stepSize + noiseFactorX;
        this.y += (dy / distance) * this.stepSize + noiseFactorY;

        if (
            this.x > (this.textSize/6) && this.x < O_sectionwidth - (this.textSize/2) &&
            this.y > (this.textSize/2) && this.y < O_sectionheight - (this.textSize/6)
        ) {
            this.path.push({ x: this.x, y: this.y });
        }

        // Store the new position for the path

        // Occasionally spawn a flower at a random position along the path
        if (
            random() < 0.01 &&
            this.x > 20 && this.x < O_sectionwidth - 20 &&
            this.y > 20 && this.y < O_sectionheight - 20
        ) {
            // 10% chance to spawn a flower, ensuring it's not too close to the borders
            flowers.push(new Flower(this.x, this.y));
        }

        // Increment noise offsets for next step
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
            if (growth > 1.5) growth = 0.5; // Loop growth
            this.growthMap.set(i, growth);

            let alpha = map(growth, 0, 1.5, 0, 180);

            textSize(growth * this.textSize); // Adjust text size based on growth
            text(c, p.x, p.y);
        }
    }
}

  class Flower {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 0; // Start with a small size
      this.growthRate = 0.3; // Rate at which the flower grows
      this.numPetals = 6; // Number of petals in the rose
      this.maxflowerSize = random(0.1,0.15)*min(O_sectionwidth, O_sectionheight); // Maximum size of the flower
      this.petalsAngleOffset = random(TWO_PI); // Random angle offset to make it more organic
    }

    grow() {
        this.size += this.growthRate;
        this.petalsAngleOffset += 0.02; // Rotate the petals slightly over time
        if (this.size > this.maxflowerSize) {
            this.size = this.maxflowerSize; // Cap the size to avoid excessive growth
        }
    }
      display() {
            let petalColor = color((frameCount + this.x) % 360, 80, 100, 180);
            fill(petalColor); // Semi-transparent green for the stem
            stroke(255, 0, 0); // Red color for the rose
            strokeWeight(1);

            // Draw a rose-like pattern using polar coordinates
            beginShape();
            for (let angle = 0; angle < TWO_PI; angle += 0.1) {
                let r = this.size * cos(this.numPetals * angle + this.petalsAngleOffset);
                let x = this.x + r * cos(angle);
                let y = this.y + r * sin(angle);
                vertex(x, y);
            }
            endShape(CLOSE);
        }
}


  async function init() {
    s = O_currentsection;

    let centerX = O_sectionwidth / 2;
    let centerY = O_sectionheight / 2; // Adjusted for proper center position

    let totalSteps = O_sectionduration; // Number of steps the walkers will take

    // Create 4 walkers, each with a different target point
    walkers = [
      new RandomWalker(centerX, centerY, { x: s.x1, y: s.y1 }, totalSteps),
      new RandomWalker(centerX, centerY, { x: s.x2, y: s.y2 }, totalSteps),
      new RandomWalker(centerX, centerY, { x: s.x3, y: s.y3 }, totalSteps),
      new RandomWalker(centerX, centerY, { x: s.x4, y: s.y4 }, totalSteps)
    ];

    // Initialize an empty array to store flowers
    flowers = [];
  }

  function draw() {
    push();
    translate(s.x, s.y);

    // Create border around section
    fill(0,50); // White translucent fade
    rect(0, 0, O_sectionwidth, O_sectionheight);
    // Update and draw all walkers
    for (let walker of walkers) {
      walker.step();
      walker.display();
    }

    // Update and draw all flowers
    for (let flower of flowers) {
      flower.grow(); // Grow each flower
      flower.display(); // Draw each flower
    }

    pop();
  }

  window.bitFlowers = { init, draw };
})();
