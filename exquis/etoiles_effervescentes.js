// Author: @etiennecollin
// Repository: https://github.com/etiennecollin/ift6251

(() => {
  const PARTICLE_ARRIVAL_RADIUS = 20;
  const PARTICLE_COUNT = 3000;
  const PARTICLE_SIZE = 6;
  const NOISE_PARAM_SCALE = 0.02;
  const NOISE_TIME_SCALE = 0.1;
  const NOISE_SCALE = 0;
  const MAX_SPEED = 2;
  const ATTRACTION_STRENGTH = 400;

  let section;
  let particles;
  let meeting_points;

  const background = ["#1d2021", "#282828"];
  const gruvbox_palette = [
    "#fb4934",
    "#b8bb26",
    "#fabd2f",
    "#83a598",
    "#d3869b",
    "#8ec07c",
    "#fe8019",
    "#cc241d",
    "#98971a",
    "#d79921",
    "#458588",
    "#b16286",
    "#689d6a",
    "#d65d0e",
  ];

  async function init() {
    // Set some global variables
    section = O_currentsection;
    meeting_points = [
      { x: section.x1, y: section.y1 }, // Top edge
      { x: section.x2, y: section.y2 }, // Right edge
      { x: section.x3, y: section.y3 }, // Bottom edge
      { x: section.x4, y: section.y4 }, // Left edge
    ];

    // Create particles at the meeting points
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x = random(0, O_sectionwidth);
      let y = random(0, O_sectionheight);
      particles.push(new Particle(x, y));
    }
  }

  function draw() {
    // Move to the section
    push();
    translate(section.x, section.y);

    // Draw the background
    stroke(background[1]);
    strokeWeight(PARTICLE_SIZE);
    if (O_counter % O_sectionduration == 1) {
      fill(background[1]);
    } else {
      fill(background[1] + "42");
    }
    rect(0, 0, O_sectionwidth, O_sectionheight);

    // Update and draw each particle
    for (let particle of particles) {
      // Skip if the particle has arrived at a meeting point
      if (particle.arrived) {
        particle.display();
        continue;
      }
      particle.update();
      particle.check_arrival();
      particle.check_edges();
      particle.display();
    }

    // Pop from the section
    pop();
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.velocity = createVector(0, 0);
      this.acceleration = createVector(0, 0);
      this.color = color(random(gruvbox_palette));
      this.arrived = false;
    }

    update() {
      // Apply attraction force from each meeting point
      for (let mp of meeting_points) {
        let direction = createVector(mp.x - this.x, mp.y - this.y);
        let distance = direction.mag();

        // Normalize the direction vector and apply an attraction force
        direction.normalize();

        // Inverse-square law for the attraction force strength
        let force = direction.mult(
          ATTRACTION_STRENGTH / (Math.pow(distance, 2) + 1),
        );

        this.acceleration.add(force);
      }

      // Noise field
      let noise_x =
        (noise(this.x * NOISE_PARAM_SCALE, O_counter * NOISE_TIME_SCALE) -
          0.5) *
        NOISE_SCALE;
      let noise_y =
        (noise(this.y * NOISE_PARAM_SCALE, O_counter * NOISE_TIME_SCALE) -
          0.5) *
        NOISE_SCALE;
      let force = createVector(noise_x, noise_y);
      this.acceleration.add(force);

      // Apply force
      this.velocity.add(this.acceleration);
      this.velocity.limit(MAX_SPEED);
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Constrain to canvas
      this.x = constrain(this.x, 0, O_sectionwidth);
      this.y = constrain(this.y, 0, O_sectionheight);

      // Reset acceleration for next update
      this.acceleration.mult(0);
    }

    check_arrival() {
      for (let mp of meeting_points) {
        if (
          abs(this.x - mp.x) <= random(1, PARTICLE_ARRIVAL_RADIUS) &&
          abs(this.y - mp.y) <= random(1, PARTICLE_ARRIVAL_RADIUS)
        ) {
          this.arrived = true;
        }
      }
    }

    check_edges() {
      // Check if particle hits any edge of the canvas
      if (this.x <= 0 || this.x >= O_sectionwidth) {
        this.x = constrain(this.x, 1, O_sectionwidth - 1); // Constrain to the edge
        this.velocity.x *= -1; // Reverse x velocity (bounce)
      }
      if (this.y <= 0 || this.y >= O_sectionheight) {
        this.y = constrain(this.y, 1, O_sectionheight - 1); // Constrain to the edge
        this.velocity.y *= -1; // Reverse y velocity (bounce)
      }
    }

    display() {
      stroke(this.color);
      strokeWeight(PARTICLE_SIZE);
      point(this.x, this.y);
    }
  }

  window.etoiles_effervescentes = { init, draw };
})();
