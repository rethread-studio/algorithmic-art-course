(() => {
  let s;
  let bubbles = [];

  async function init() {
    s = O_currentsection;

    // Create soft, scattered bubbles
    for (let i = 0; i < 40; i++) {
      bubbles.push({
        x: random(O_sectionwidth),
        y: random(O_sectionheight * 0.6),
        size: random(10, 30),
        speed: random(0.2, 0.5),
        hue: random(220, 280)
      });
    }
  }

  function draw() {
    s = O_currentsection;
    push();
    translate(s.x, s.y);

    // Clip to section
    drawingContext.beginPath();
    drawingContext.rect(0, 0, O_sectionwidth, O_sectionheight);
    drawingContext.clip();

    // Calm, sky-like background
    fill(220, 30, 20);
    rect(0, 0, O_sectionwidth, O_sectionheight);

    // Glow at top anchor point (x1, y1) to link with tree
    noStroke();
    fill(180, 50, 100, 50);
    ellipse(s.x1, s.y1, 80, 25);

    // Bubbles floating in top space
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

    pop();
  }

  window.exquisitebubblefield = { init, draw };
})();
