(() => {
  let s, r, rinc;

  async function init() {
    s = O_currentsection;
    r = 7;
    rinc = 0.5;
  }

  function draw() {
    // Move to the section
    push();
    translate(s.x, s.y);

    // Create border around section
    fill(0, 0, 0);
    rect(0, 0, O_sectionwidth, O_sectionheight);
    fill(0, 0, 100);
    noStroke();

    // Draw our art
    arc(s.x1, s.y1, r, r, 0, PI);
    arc(s.x2, s.y2, r, r, PI * 0.5, PI * 1.5);
    arc(s.x3, s.y3, r, r, PI, 2 * PI);
    arc(s.x4, s.y4, r, r, PI * 1.5, PI * 0.5);
    r += rinc;

    // Pop out of the section
    pop();
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.exquisitebw = { init, draw };
})();
