(() => {
  let s, couleurs, x, linesWidth, cx, cy, r, beta, b;

  async function init() {
    s = O_currentsection;
    var couleurs = ["red", "black", "white"];
    x = 0;
    beta = 0;
    b = 0;
  }

  function draw() {
    // Move to the section
    push();
    translate(s.x, s.y);
    fill(100, 50, 60, beta);
    noStroke();
    rect(0, 0, O_sectionwidth, O_sectionheight);
    /*
    if (O_counter % O_sectionduration >= 1) {
      //line(s.x1, s.y1, O_sectionwidth, O_sectionheight);
    }
    */

    stroke("white"); // Couleur blanche
    strokeWeight(2);
    r = 20;
    /*
    for (let a = 0; a <= 360; a += 60) {
      cx = O_sectionwidth / 2 + r * cos(a);
      cy = O_sectionheight / 2 + r * sin(a);
      line(s.x1, s.y1, cx, cy);
      line(s.x2, s.y2, cx, cy);
      line(s.x3, s.y3, cx, cy);
      line(s.x4, s.y4, cx, cy);
    }
      */
    for (let i = 0; i < 100; i++) {
      stroke("white"); // Couleur blanche
      if (s.x1 + i * 10 <= O_sectionwidth) {
        line(s.x1, s.y1, s.x1 + i * 10, O_sectionheight);
      }
    }
    noFill();
    strokeWeight(5);
    stroke((30 + 10 * beta) % 360, 80, 80, beta % 250);
    bezier(
      s.x2,
      s.y2,
      O_sectionwidth / 4,
      O_sectionheight / 4,
      O_sectionwidth / 4,
      O_sectionheight / 4,
      O_sectionwidth / 2 + b,
      O_sectionheight / 2
    );
    bezier(
      s.x4,
      s.y4,
      (3 * O_sectionwidth) / 4,
      (3 * O_sectionheight) / 4,
      (3 * O_sectionwidth) / 4,
      (3 * O_sectionheight) / 4,
      O_sectionwidth / 2 + b,
      O_sectionheight / 2
    );
    stroke("red");
    circle(O_sectionwidth / 2 + b, O_sectionheight / 2, 40);

    // fill(0, 0, 100); noStroke
    //rect(0,0,O_sectionwidth,O_sectionheught)

    // O_counter % O_sectionduration == 120; Math.floor
    //consol.log(O_sectionduration)

    beta += 0.5;
    if (O_sectionwidth / 2 + b + 20 < O_sectionwidth) {
      b += 5;
    }

    // Pop out of the section
    pop();
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.balafre = { init, draw };
})();
