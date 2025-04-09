// Question : le background noir va au-delà de ma section. Et quand mes lignes sortent de l'écran, elles apparaissent dans
//les autres sections

(() => {
  let s, q1, q2, q3, q4, x, duration;

  class Quadri {
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, color) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.x3 = x3;
      this.y3 = y3;
      this.x4 = x4;
      this.y4 = y4;
      this.quadColor = color;
      this.speed = 1; // Adjust for faster/slower movement
      this.direction = 1; // 1 = moving down, -1 = moving up
    }

    update(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
      // Move bottom points up and down
      this.x1 += p1x;
      this.y1 += p1y;
      this.x2 += p2x;
      this.y2 += p2y;
      this.x3 += p3x;
      this.y3 += p3y;
      this.x4 += p4x;
      this.y4 += p4y;

      // Reverse direction at a certain range

      if (this.y3 >= O_sectionheight + 20 || this.y3 <= O_sectionheight - 20) {
        this.direction *= -1;
      }
    }

    display() {
      fill(this.quadColor);
      stroke(0);
      quad(
        this.x1,
        this.y1,
        this.x2,
        this.y2,
        this.x3,
        this.y3,
        this.x4,
        this.y4
      );
    }
  }

  async function init() {
    s = O_currentsection;
    x = 0;
    duration = O_sectionduration / 4;

    if (s) {
      q1 = new Quadri(
        s.x1,
        s.y1,
        s.x1 + 20,
        s.y1,
        s.x1 + 20,
        O_sectionheight,
        s.x1 + 10,
        O_sectionheight,
        "red"
      );
      q2 = new Quadri(
        s.x2,
        s.y2,
        s.x2,
        s.y2 + 15,
        0,
        s.y2 + 15,
        0,
        s.y2,
        "white"
      );
      q3 = new Quadri(
        s.x3,
        s.y3,
        s.x3 - 10,
        s.y3,
        s.x3 - 10,
        0,
        s.x3,
        0,
        "yellow"
      );
      q4 = new Quadri(
        s.x4,
        s.y4,
        s.x4,
        s.y4 - 10,
        O_sectionwidth,
        s.y4 - 10,
        O_sectionwidth,
        s.y4,
        "blue"
      );
    }
  }

  function draw() {
    if (!s || !q1) return;

    push();
    translate(s.x, s.y);
    fill(0, 0, 0);
    noStroke();
    rect(0, 0, O_sectionwidth, O_sectionheight);

    //q1.update(); // Update the position of the bottom half
    //q1.display();

    let step = O_counter % O_sectionduration;
    if (step >= 1) {
      if (
        q1.x3 + ((O_sectionwidth - (s.x1 + 20)) / duration) <=
        O_sectionwidth
      ) {
        q1.update(
          0,
          0,
          0,
          0,
          ((O_sectionwidth - (s.x1 + 20)) / duration),
          0,
          ((O_sectionwidth - (s.x1 + 20)) / duration),
          0
        );
      }
      q1.display();
    }
    if (step >= O_sectionduration / 4) {
      //console.log(s.y2 - x / 20);
      //console.log(s.y2 - x / 20 >= 0);

      if (q2.y4 - (O_sectionheight - s.y4) / duration >= 0) {
        q2.update(
          0,
          0,
          0,
          0,
          0,
          -(O_sectionheight - s.y4) / duration,
          0,
          -(O_sectionheight - s.y4) / duration
        ); // Update the position of the bottom half
      }
      q2.display();
    }

    if (step >= O_sectionduration / 2) {
      if (q3.x4 + x / 40 <= O_sectionwidth) {
        q3.update(0, 0, 0, 0, x / 40, 0, x / 40, 0); // Update the position of the bottom half
      }
      q3.display();
    }
    if (step >= (3 * O_sectionduration) / 4) {
      if (q4.y4 + (O_sectionheight - s.y4) / duration <= O_sectionheight) {
        q4.update(
          0,
          0,
          0,
          0,
          0,
          (O_sectionheight - s.y4) / duration,
          0,
          (O_sectionheight - s.y4) / duration
        );
      }
      q4.display();
    }
    x += 1;

    pop();
  }

  window.stella = { init, draw };
})();
