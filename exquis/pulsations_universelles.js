// Author: @etiennecollin
// Repository: https://github.com/etiennecollin/ift6251

(() => {
  const WAVE_SPEED = 1;
  const WAVE_GENERATION_INTERVAL = 16;
  const WAVE_LIFETIME = 360;
  const STROKE_WIDTH = 8;

  let section;
  let meeting_points;
  let waves;

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
    waves = [];
    meeting_points = [
      { x: section.x1, y: section.y1 + 1, angle: 0 },
      { x: section.x2 - 1, y: section.y2, angle: PI / 2 },
      { x: section.x3, y: section.y3 - 1, angle: PI },
      { x: section.x4 + 1, y: section.y4, angle: -PI / 2 },
    ];
  }

  function draw() {
    // Move to the section
    push();
    translate(section.x, section.y);

    // Draw the background
    stroke(background[1]);
    strokeWeight(STROKE_WIDTH * 2);
    if (O_counter % O_sectionduration == 1) {
      fill(background[1]);
    } else {
      fill(background[1] + "FF");
    }
    rect(0, 0, O_sectionwidth, O_sectionheight);

    if (O_counter % WAVE_GENERATION_INTERVAL == 0) {
      // Add new waves
      for (let meeting_point of meeting_points) {
        waves.push(new Wave(meeting_point, 100));
      }

      // Remove old waves
      if (O_counter % O_sectionduration >= WAVE_LIFETIME) {
        for (let i = 0; i < meeting_points.length; i++) {
          waves.shift();
        }
      }
    }

    // Draw and update each wave
    for (let wave of waves) {
      wave.update();
      wave.display();
    }

    // Pop from the section
    pop();
  }

  class Wave {
    constructor(info, num_particles) {
      this.x = info.x;
      this.y = info.y;
      this.num_particles = num_particles;
      this.particles = [];
      this.lifetime = 0;
      this.color = color(random(gruvbox_palette));

      // Initialize particles
      // They start at an edge and move in a circular path
      // So they cover PI radians
      let angle_delta = PI / this.num_particles;
      for (let i = 0; i < this.num_particles; i++) {
        let angle = info.angle + i * angle_delta;
        let px = this.x;
        let py = this.y;
        let vx = cos(angle) * WAVE_SPEED;
        let vy = sin(angle) * WAVE_SPEED;
        this.particles.push(new Particle(px, py, vx, vy));
      }
    }

    update() {
      this.lifetime++;
      for (let particle of this.particles) {
        particle.update();
        particle.check_edges();
      }
    }

    display() {
      let wave_color = lerpColor(
        this.color,
        color(background[1]),
        this.lifetime / WAVE_LIFETIME,
      );
      stroke(wave_color);
      strokeWeight(STROKE_WIDTH);

      noFill();
      beginShape();
      for (let particle of this.particles) {
        vertex(particle.x, particle.y);
      }
      endShape();
    }
  }

  class Particle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
    }

    update() {
      this.x = constrain(this.x + this.vx, 1, O_sectionwidth - 1);
      this.y = constrain(this.y + this.vy, 1, O_sectionheight - 1);
    }

    check_edges() {
      // Check if particle hits any edge of the canvas
      if (this.x <= 1 || this.x >= O_sectionwidth - 1) {
        this.x = constrain(this.x, 1, O_sectionwidth - 1); // Constrain to the edge
        this.vx *= -1; // Reverse x velocity (bounce)
      }
      if (this.y <= 1 || this.y >= O_sectionheight - 1) {
        this.y = constrain(this.y, 1, O_sectionheight - 1); // Constrain to the edge
        this.vy *= -1; // Reverse y velocity (bounce)
      }
    }
  }

  window.pulsations_universelles = { init, draw };
})();
