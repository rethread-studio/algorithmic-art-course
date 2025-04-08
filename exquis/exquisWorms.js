(() => {
  let s;
  let numberWalkers, walkers, countWalkers, speed, period;
  let lineLengthMax, lineWeightMax;

  function epicycloidX(t, R, r, d, ss) {
    return (R+r)*cos(t/ss) - r*cos((R+r)*t/ss/r);
  }
  
  function epicycloidY(t, R, r, d, ss) {
    return (R+r)*sin(t/ss) - r*sin((R+r)*t/ss/r);
  }
  
  function epitrochoidX(t, R, r, d, ss) {
    return (R+r)*cos(t/ss) - d*cos((R+r)*t/ss/r);
  }
  
  function epitrochoidY(t, R, r, d, ss) {
    return (R+r)*sin(t/ss) - d*sin((R+r)*t/ss/r);
  }

  class Walker {
    constructor() {
      countWalkers += 1;
      // let preferredColors = [color(232, 231, 227), color(117, 116, 111), color(33, 33, 31), color(181, 114, 172), color(127, 179, 201), color(123, 201, 154), color(230, 133, 194), color(230, 133, 164)];
      let preferredColors = [color(0,0,100), color(0,100,50)];

      if (random() < 0.25) {
        this.shiftInitX = - O_sectionwidth/2 +s.x1;
        this.shiftInitY = - O_sectionheight/2 + s.y1;
      } else if (random() < 0.5) {
        this.shiftInitX = - O_sectionwidth/2 +s.x2;
        this.shiftInitY = - O_sectionheight/2 + s.y2;
      } else if (random() < 0.75) {
        this.shiftInitX = - O_sectionwidth/2 +s.x3;
        this.shiftInitY = - O_sectionheight/2 + s.y3;
      } else {
        this.shiftInitX = - O_sectionwidth/2 +s.x4;
        this.shiftInitY = - O_sectionheight/2 + s.y4;
      }

      if (random() < 0.5) {
        this.shapeX = epicycloidX;
        this.shapeY = epicycloidY;
      }
      else {
        this.shapeX = epitrochoidX;
        this.shapeY = epitrochoidY;
      }
      this.bigR = random(50, 300);
      this.smallR = random(30, 200);
      this.d = random(35, 300);
      this.ss = random(30, 100);
      this.color = preferredColors[int(random(0,preferredColors.length))];
      
      this.t = 0;
      
      this.theta = random(0,360);

      this.x = this.shapeX(this.t, this.bigR, this.smallR, this.d, this.ss);
      this.y = this.shapeY(this.t, this.bigR, this.smallR, this.d, this.ss);
      this.t++;
  
      this.nextX = this.x;
      this.nextY = this.y;

      this.drawX = this.x;
      this.drawY = this.y;
      this.drawNextX = this.nextX;
      this.drawNextY = this.nextY;
  
      this.lengthLine = random(1, lineLengthMax);
      this.weightLine = random(1, lineWeightMax);
    }
  
    move() {   
      this.x = this.nextX;
      this.y = this.nextY;
      this.nextX = this.shapeX(this.t, this.bigR, this.smallR, this.d, this.ss);
      this.nextY = this.shapeY(this.t, this.bigR, this.smallR, this.d, this.ss);

      if (this.shapeX == epicycloidX) {
        this.drawX = this.x + O_sectionwidth/2 - this.bigR + this.shiftInitX;
        this.drawY = this.y + O_sectionheight/2 + this.shiftInitY;
        this.drawNextX = this.nextX + O_sectionwidth/2 - this.bigR + this.shiftInitX;
        this.drawNextY = this.nextY + O_sectionheight/2 + this.shiftInitY;
      } else {
        this.drawX = this.x + O_sectionwidth/2 - (this.bigR + this.smallR - this.d) + this.shiftInitX;
        this.drawY = this.y + O_sectionheight/2 + this.shiftInitY;
        this.drawNextX = this.nextX + O_sectionwidth/2 - (this.bigR + this.smallR - this.d) + this.shiftInitX;
        this.drawNextY = this.nextY + O_sectionheight/2 + this.shiftInitY;
      }
      
      this.t++;
    }
  
    draw() {
      if (this.shapeX == epicycloidX) {
        stroke(this.color);
        strokeWeight(this.weightLine);
        // let newX = this.x + width/2 - this.bigR;
        // let newY = this.y + height/2;
        // let newNextX = this.nextX + width/2 - this.bigR;
        // let newNextY = this.nextY + height/2;
        line(this.drawX, this.drawY, this.drawNextX, this.drawNextY);
        this.x = this.nextX;
        this.y = this.nextY;
      } 
      else {
        stroke(this.color);
        strokeWeight(this.weightLine);
        // let newX = this.x + width/2 - (this.bigR + this.smallR - this.d);
        // let newY = this.y + height/2;
        // let newNextX = this.nextX + width/2 - (this.bigR + this.smallR - this.d);
        // let newNextY = this.nextY + height/2;
        line(this.drawX, this.drawY, this.drawNextX, this.drawNextY);
        this.x = this.nextX;
        this.y = this.nextY;
      }
    }

    onRange() {
      let shift = 5;
      if (this.drawNextX <= 0+shift || this.drawNextX > O_sectionwidth-shift || this.drawNextY <= 0+shift || this.drawNextY > O_sectionheight-shift || this.drawX <= 0+shift || this.drawX > O_sectionwidth-shift || this.drawY <= 0+shift || this.drawY > O_sectionheight-shift) {
        return false;
      } else {
        return true;
      }
    }
  }

  async function init() {
    s = O_currentsection;

    numberWalkers = 200;
    walkers = [];
    countWalkers = 0;
    speed = 1;
    period = Math.floor(random(12, 20));

    lineLengthMax = 100;
    lineWeightMax = 15;

    for (let i = 0; i < numberWalkers; i++) {
      walkers[i] = new Walker();
    }
  }

  function draw() {
    // Move to the section
    push();
    translate(s.x, s.y);

    // // Create border around section
    stroke(0,0,100);
    line(0,0,O_sectionwidth,0);
    line(0,0,0,O_sectionheight);
    line(0,O_sectionheight,O_sectionwidth,O_sectionheight);
    line(O_sectionwidth,0,O_sectionwidth,O_sectionheight);
    noStroke();

    // Draw our art
    // translate(0, -O_sectionheight);
    for (let i = 0; i < speed; i++) {
      let fc = O_counter % O_sectionduration;
      for (let walker = 0; walker < constrain(fc/period, 0, numberWalkers); walker++) {
        walkers[walker].move();
        if (walkers[walker].onRange()) {
          walkers[walker].draw();
        }
      }
      if (O_counter % O_sectionduration == O_sectionduration - 1) {
        fill(247, 77, 57);
        let r = 7;
        let rinc = 0.5;
        for (let i = 0; i < 42; i++) {
          arc(s.x1, s.y1, r, r, 0, PI);
          arc(s.x2, s.y2, r, r, PI * 0.5, PI * 1.5);
          arc(s.x3, s.y3, r, r, PI, 2 * PI);
          arc(s.x4, s.y4, r, r, PI * 1.5, PI * 0.5);
          r += rinc;
        }
      }
    }

    // Pop out of the section
    pop();
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.exquisWorms = { init, draw };
})();
