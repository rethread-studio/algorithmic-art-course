(() => {
  let s;
  let snowflakes = [];

  async function init() {
    s = O_currentsection;
    for (let i = 0; i < 80; i++) {
      snowflakes.push({
        x: random(O_sectionwidth),
        y: random(O_sectionheight),
        r: random(1, 3),
        speed: random(0.4, 1)
      });
    }
  }

  function draw() {
    s = O_currentsection;
    push();
    translate(s.x, s.y);

    drawingContext.beginPath();
    drawingContext.rect(0, 0, O_sectionwidth, O_sectionheight);
    drawingContext.clip();

    fill(235, 50, 30);
    rect(0, 0, O_sectionwidth, O_sectionheight);

    // Trees
    for (let i = 0; i < 3; i++) {
      let x = (i + 1) * O_sectionwidth / 4;
      fill(30, 90, 40);
      rect(x - 3, O_sectionheight - 30, 6, 30);
      fill(120, 100, 60);
      triangle(x - 15, O_sectionheight - 30, x + 15, O_sectionheight - 30, x, O_sectionheight - 60);
    }

    // Snow
    fill(0, 0, 100, 180);
    for (let f of snowflakes) {
      ellipse(f.x, f.y, f.r * 2);
      f.y += f.speed;
      if (f.y > O_sectionheight) {
        f.y = 0;
        f.x = random(O_sectionwidth);
      }
    }

    // Ground snow
    fill(0, 0, 100, 120);
    ellipse(O_sectionwidth / 2, O_sectionheight + 10, O_sectionwidth + 50, 40);

    // Anchor point portal at bottom center (x3, y3)
    let pulse = map(sin(frameCount * 0.05), -1, 1, 60, 100);
    noStroke();
    fill(220, 80, 100, 50);
    ellipse(s.x3, s.y3, pulse, 20);

    pop();
  }

  window.exquisiteglow = { init, draw };
})();
