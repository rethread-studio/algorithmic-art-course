(() => {
  let s, walkers, flowers;

  class RandomWalker {
    constructor(x, y, target, steps) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.steps = steps;
      this.currentStep = 0;
      this.path = [];
      this.noiseOffsetX = random(1000); // For Perlin noise-based movement
      this.noiseOffsetY = random(1000);
      this.stepSize = 5; // Determines the amount of movement per step
      this.charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"; // Character set
    }

    step() {
      if (this.currentStep >= this.steps) return;

      // Calculate direction towards the target
      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      // Add Perlin noise-based randomness to movement
      let noiseFactorX = map(noise(this.noiseOffsetX), 0, 1, -2, 2);
      let noiseFactorY = map(noise(this.noiseOffsetY), 0, 1, -2, 2);

      // Move with randomness but also toward the target
      this.x += (dx / distance) * this.stepSize + noiseFactorX;
      this.y += (dy / distance) * this.stepSize + noiseFactorY;

      // Store the new position for the path
      this.path.push({ x: this.x, y: this.y });

      // Occasionally spawn a flower at a random position along the path
      if (random() < 0.1) { // 10% chance to spawn a flower
        flowers.push(new Rose(this.x, this.y));
      }

      // Increment noise offsets for next step
      this.noiseOffsetX += 0.1;
      this.noiseOffsetY += 0.1;

      this.currentStep++;
    }

    draw() {
      fill(255, 255, 0); // Set text color to yellow
      textSize(16);

      for (let p of this.path) {
        // Pick a random character from the character set
        let c = this.charSet[Math.floor(Math.random() * this.charSet.length)];

        // Display the character at the path position
        text(c, p.x, p.y);
      }
    }
  }

  class Rose {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 0; // Start with a small size
      this.growthRate = 0.3; // Rate at which the flower grows
      this.numPetals = 6; // Number of petals in the rose
      this.petalsAngleOffset = random(TWO_PI); // Random angle offset to make it more organic
    }

    grow() {
      this.size += this.growthRate;
    }

    draw() {
      noStroke();
      fill(255, 0, 255); // Flower color (magenta)

      // Draw petals in a spiral pattern to resemble a rose
      for (let angle = 0; angle < TWO_PI; angle += PI / 12) { // Spiral with multiple rotations
        let radius = this.size * (angle / (TWO_PI * 3)); // Gradually increase radius
        let petalX = this.x + cos(angle + this.petalsAngleOffset) * radius;
        let petalY = this.y + sin(angle + this.petalsAngleOffset) * radius;

        // Draw each petal as an ellipse
        ellipse(petalX, petalY, this.size * 0.4, this.size * 0.6); // Petals with slight elongation
      }

      // Draw the center of the rose
      fill(255, 100, 200); // Slightly different color for the center
      ellipse(this.x, this.y, this.size * 0.5, this.size * 0.5);
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
    fill(0, 0, 0);
    rect(0, 0, O_sectionwidth, O_sectionheight);

    // Update and draw all walkers
    for (let walker of walkers) {
      walker.step();
      walker.draw();
    }

    // Update and draw all flowers
    for (let flower of flowers) {
      flower.grow(); // Grow each flower
      flower.draw(); // Draw each flower
    }

    pop();
  }

  window.bitFlowers = { init, draw };
})();
