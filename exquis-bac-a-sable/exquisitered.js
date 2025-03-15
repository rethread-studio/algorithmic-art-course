(() => {
  let s;

  async function init() {
    s = O_currentsection;
  }

  function draw() {
    let r = random();

    // Move to the section
    push();
    translate(s.x, s.y);

    // Draw our art
    if (r > 0.42) {
      fill(0, 100, 100);
      noStroke();
      quad(s.x1, s.y1, s.x2, s.y2, s.x3, s.y3, s.x4, s.y4);
    } else {
      fill(0, 0, 0);
      rect(0, 0, O_sectionwidth, O_sectionheight);
    }
    if (O_counter % O_sectionduration == O_sectionduration - 1) {
      fill(0, 100, 100);
      noStroke();
      quad(s.x1, s.y1, s.x2, s.y2, s.x3, s.y3, s.x4, s.y4);
    }

    // Pop out of the section
    pop();
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.exquisitered = { init, draw };
})();
