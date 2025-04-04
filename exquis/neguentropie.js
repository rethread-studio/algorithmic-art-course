// Author: @etiennecollin
// Repository: https://github.com/etiennecollin/ift6251

(() => {
  const STROKE_WIDTH = 2;
  const PARTICLE_COUNT = 200;
  const NOISE_TIME_SCALE = 0.01;
  const NOISE_POSITION_PARAM_SCALE = 0.03;
  const NOISE_POSITION_SCALE = 32;
  const NOISE_CONTROL_PARAM_SCALE = 0.03;
  const NOISE_CONTROL_SCALE = 128;
  const CONTROL_POINT_OFFSET = 32;

  let section;
  let meeting_points;
  let particles = [];

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

    // Initialize lines with random start positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let start_x = random(O_sectionwidth);
      let start_y = random(O_sectionheight);
      particles.push(new Particle(start_x, start_y, section));
    }
  }

  function draw() {
    // Move to the section
    push();
    translate(section.x, section.y);

    // Draw the background
    noStroke();
    if (O_counter % O_sectionduration == 1) {
      fill(background[1]);
    } else {
      fill(background[1] + "09");
    }
    rect(0, 0, O_sectionwidth, O_sectionheight);

    // Compute the progress of the animation
    let progress = (O_counter % O_sectionduration) / (O_sectionduration - 1);

    // Display particles
    for (let particle of particles) {
      particle.update(progress);
      particle.display();
    }

    // Pop from the section
    pop();
  }

  class Particle {
    constructor(start_x, start_y, section) {
      this.x = start_x;
      this.y = start_y;
      this.start_x = start_x;
      this.start_y = start_y;
      let end_point = random(meeting_points);
      this.end_x = end_point.x;
      this.end_y = end_point.y;
      this.color = color(random(gruvbox_palette));
      this.cp_offset_x =
        random() < 0.5 ? -CONTROL_POINT_OFFSET : CONTROL_POINT_OFFSET;
      this.cp_offset_y =
        random() < 0.5 ? -CONTROL_POINT_OFFSET : CONTROL_POINT_OFFSET;

      // Initialize control points with random values
      this.cp1_x =
        lerp(this.start_x, this.end_x, 0.33) +
        random(-O_sectionwidth * 0.1, O_sectionwidth * 0.1);
      this.cp1_y =
        lerp(this.start_y, this.end_y, 0.33) +
        random(-O_sectionheight * 0.1, O_sectionheight * 0.1);
      this.cp2_x =
        lerp(this.start_x, this.end_x, 0.66) +
        random(-O_sectionwidth * 0.1, O_sectionwidth * 0.1);
      this.cp2_y =
        lerp(this.start_y, this.end_y, 0.66) +
        random(-O_sectionheight * 0.1, O_sectionheight * 0.1);
    }

    update(progress) {
      let noise_factor =
        noise(
          this.x * NOISE_POSITION_PARAM_SCALE,
          this.y * NOISE_POSITION_PARAM_SCALE,
          O_counter * NOISE_TIME_SCALE,
        ) * NOISE_POSITION_SCALE;

      this.x = constrain(
        lerp(this.start_x, this.end_x, progress) +
          lerp(noise_factor, 0, progress),
        0,
        O_sectionwidth,
      );
      this.y = constrain(
        lerp(this.start_y, this.end_y, progress) +
          lerp(noise_factor, 0, progress),
        0,
        O_sectionheight,
      );

      // Generate the noise for control points
      let cp1_x_noise =
        noise(
          this.cp1_x * NOISE_CONTROL_PARAM_SCALE,
          O_counter * NOISE_TIME_SCALE,
        ) * NOISE_CONTROL_SCALE;
      let cp1_y_noise =
        noise(
          this.cp1_y * NOISE_CONTROL_PARAM_SCALE,
          O_counter * NOISE_TIME_SCALE,
        ) * NOISE_CONTROL_SCALE;
      let cp2_x_noise =
        noise(
          this.cp2_x * NOISE_CONTROL_PARAM_SCALE,
          O_counter * NOISE_TIME_SCALE,
        ) * NOISE_CONTROL_SCALE;
      let cp2_y_noise =
        noise(
          this.cp2_y * NOISE_CONTROL_PARAM_SCALE,
          O_counter * NOISE_TIME_SCALE,
        ) * NOISE_CONTROL_SCALE;

      // Update control points with noise
      this.cp1_x = constrain(
        lerp(this.start_x, this.end_x, 0.33) +
          lerp(cp1_x_noise, this.cp_offset_x, progress),
        0,
        O_sectionwidth,
      );
      this.cp1_y = constrain(
        lerp(this.start_y, this.end_y, 0.33) +
          lerp(cp1_y_noise, this.cp_offset_y, progress),
        0,
        O_sectionheight,
      );
      this.cp2_x = constrain(
        lerp(this.start_x, this.end_x, 0.66) +
          lerp(cp2_x_noise, this.cp_offset_x, progress),
        0,
        O_sectionwidth,
      );
      this.cp2_y = constrain(
        lerp(this.start_y, this.end_y, 0.66) +
          lerp(cp2_y_noise, this.cp_offset_y, progress),
        0,
        O_sectionheight,
      );
    }

    display() {
      stroke(this.color);
      strokeWeight(STROKE_WIDTH);
      noFill();
      bezier(
        this.start_x,
        this.start_y,
        this.cp1_x,
        this.cp1_y,
        this.cp2_x,
        this.cp2_y,
        this.x,
        this.y,
      );

      // fill(this.color);
      // line(this.start_x, this.start_y, this.x, this.y);
      // ellipse(this.x, this.y, particle_radius, particle_radius);
    }
  }

  window.neguentropie = { init, draw };
})();
