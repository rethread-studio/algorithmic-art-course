(() => {
  let s, r, rinc, snowflakes = [];

  async function init() {
    s = O_currentsection;
    r = 7;
    rinc = 0.1;

    for (let i = 0; i < 60; i++) {
      snowflakes.push({
        x: random(O_sectionwidth),
        y: random(O_sectionheight),
        r: random(1, 2.5),
        speed: random(0.4, 1)
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
    fill(235, 50, 30);
    rect(0, 0, O_sectionwidth, O_sectionheight);

    // Tree trunks & foliage
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

    // Anchor point visuals
    fill(0, 0, 100);
    arc(s.x1, s.y1, r, r, 0, PI);
    arc(s.x2, s.y2, r, r, PI * 0.5, PI * 1.5);
    arc(s.x3, s.y3, r, r, PI, 2 * PI);
    arc(s.x4, s.y4, r, r, PI * 1.5, PI * 0.5);
    r += rinc;

    pop();
  }

  window.exquisiteglow = { init, draw };
})();
