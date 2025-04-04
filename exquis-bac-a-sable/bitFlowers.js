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
      this.charSet = "10"; // Character set
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

      this.x = max(0.0, min(this.x, O_sectionwidth)); // Keep within bounds
      this.y = max(0.0 + (4*(O_sectionwidth/O_sectionheight)), min(this.y, O_sectionheight)); // Keep within bounds
      // Store the new position for the path
      this.path.push({ x: this.x, y: this.y });

      // Occasionally spawn a flower at a random position along the path
      if (random() < 0.01) { // 10% chance to spawn a flower
        flowers.push(new Flower(this.x, this.y));
      }

      // Increment noise offsets for next step
      this.noiseOffsetX += 0.1;
      this.noiseOffsetY += 0.1;

      this.currentStep++;
    }

    draw() {
      fill(255, 255, 0); // Set text color to yellow
      textSize(5*(O_sectionwidth/O_sectionheight));

      for (let p of this.path) {
        // Pick a random character from the character set
        let c = this.charSet[Math.floor(Math.random() * this.charSet.length)];

        // Display the character at the path position
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
      this.petalsAngleOffset = random(TWO_PI); // Random angle offset to make it more organic
    }

    grow() {
      this.size += this.growthRate;
    }

    draw() {
      noStroke();
      fill(50, 0, 255); // Flower color (magenta)

      // Draw lines radiating from the center to resemble dandelion seeds
      strokeWeight(10); // Thin lines for a delicate look
      for (let i = 0; i < 8; i++) { // 8 lines radiating outward
        let angle = (TWO_PI / 8) * i; // Divide the circle into 8 parts
        let radius = min(this.size, 30); // Limit the growth to a maximum radius of 20
        let endX = this.x + cos(angle) * radius;
        let endY = this.y + sin(angle) * radius;

        // Draw each main line from the center outward
        line(this.x, this.y, endX, endY);

          if (radius > 10) { // Only add branches if the flower is large enough
              // Add branching lines at the end of each main line
              let branchLength = radius * 0.3; // Length of the branches
              for (let j = -1; j <= 1; j += 2) { // Two branches, one on each side
                  let branchAngle = angle + j * QUARTER_PI / 2; // Offset angle for branches
                  let branchX = endX + cos(branchAngle) * branchLength;
                  let branchY = endY + sin(branchAngle) * branchLength;

                  // Draw the branch line
                  line(endX, endY, branchX, branchY);
              }
        }
      }
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
