(() => {
  let s, r, rinc, bubbles = [];

  async function init() {
    s = O_currentsection;
    r = 7;
    rinc = 0.1;

    for (let i = 0; i < 35; i++) {
      bubbles.push({
        x: random(O_sectionwidth),
        y: random(O_sectionheight * 0.6),
        size: random(10, 25),
        speed: random(0.3, 0.6),
        hue: random(220, 280)
      });
    }
  }

  function draw() {
    s = O_currentsection;
    push();
    translate(s.x, s.y);

    // Border
    fill(0, 0, 0);
    rect(0, 0, O_sectionwidth, O_sectionheight);
    noStroke();

    // Background
    fill(220, 30, 20);
    rect(0, 0, O_sectionwidth, O_sectionheight);

    // Top anchor light (optional)
    fill(180, 50, 100, 50);
    ellipse(s.x1, s.y1, 80, 25);

    // Bubbles
    for (let i = 0; i < bubbles.length; i++) {
      let b = bubbles[i];
      stroke(b.hue, 80, 100, 150);
      strokeWeight(1.5);
      noFill();
      ellipse(b.x, b.y, b.size);

      b.y -= b.speed;
      b.x += sin(frameCount * 0.01 + i) * 0.2;

      if (b.y < 10) {
        b.y = random(O_sectionheight * 0.4, O_sectionheight * 0.6);
        b.x = random(O_sectionwidth);
      }
    }

    // Anchor arcs
    fill(0, 0, 100);
    arc(s.x1, s.y1, r, r, 0, PI);
    arc(s.x2, s.y2, r, r, PI * 0.5, PI * 1.5);
    arc(s.x3, s.y3, r, r, PI, 2 * PI);
    arc(s.x4, s.y4, r, r, PI * 1.5, PI * 0.5);
    r += rinc;

    pop();
  }

  window.exquisitebubblefield = { init, draw };
})();
