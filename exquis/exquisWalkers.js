(() => {
  let s;
  let numberWalkers, walkers, countWalkers, speed, period;
  let lineLengthMax, lineWeightMax;

  class Walker {
    constructor() {
      countWalkers += 1;
      if (random() < 0.25) {
        this.x = s.x1;
        this.y = s.y1;
      } else if (random() < 0.5) {
        this.x = s.x2;
        this.y = s.y2;
      } else if (random() < 0.75) {
        this.x = s.x3;
        this.y = s.y3;
      } else {
        this.x = s.x4;
        this.y = s.y4;
      }

      this.r = random(0,255);
      this.g = random(0,255);
      this.b = random(0,255);
      
      this.nextX = this.x;
      this.nextY = this.y;
  
      this.lengthLine = random(25, lineLengthMax);
      this.weightLine = random(10, lineWeightMax);
    }
  
    move() {   
      this.x += random(-1,1);
      this.y += random(-1,1);

      this.x = constrain(this.x, 0, O_sectionwidth);
      this.y = constrain(this.y, 0, O_sectionheight);
      
      this.r += random(-1,1);
      this.g += random(-1,1);
      this.b += random(-1,1);

      this.r = constrain(this.r, 0, 255);
      this.g = constrain(this.g, 0, 255);
      this.b = constrain(this.b, 0, 255);
    }
  
    draw() {
      stroke(this.r, this.g, this.b);
      point(this.x, this.y);
    }
  }

  async function init() {
    s = O_currentsection;

    numberWalkers = 300;
    walkers = [];
    countWalkers = 0;
    speed = 600;
    period = 20;

    lineLengthMax = 100;
    lineWeightMax = 25;

    for (let i = 0; i < numberWalkers; i++) {
      walkers[i] = new Walker();
    }
  }

  function draw() {
    // Move to the section
    push();
    colorMode(RGB);
    translate(s.x, s.y);

    // // Create border around section
    stroke(0,0,100);
    line(0,0,O_sectionwidth,0);
    line(0,0,0,O_sectionheight);
    line(0,O_sectionheight,O_sectionwidth,O_sectionheight);
    line(O_sectionwidth,0,O_sectionwidth,O_sectionheight);
    noStroke();

    // Draw our art
    for (let i = 0; i < speed; i++) {
      let fc = O_counter % O_sectionduration;
      for (let walker = 0; walker < constrain(fc/period, 0, numberWalkers); walker++) {
        walkers[walker].move();
        walkers[walker].draw();
      }
    }

    // Pop out of the section
    pop();
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.exquisWalkers = { init, draw };
})();
