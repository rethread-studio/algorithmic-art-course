//artwork: bw
(() => {
  let s, r, rinc;

  async function init() {
    //this is exquisitebw
    s = O_currentsection;
    r = 7;
    rinc = 0.1;
    console.log("x: " + s.x + ", y: " + s.y + ", r :" + r)
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
    if (random() < 0.9 || O_counter % O_sectionduration == O_sectionduration - 1) {
      if(s.x1-r>0 && s.x1+r<O_sectionwidth){arc(s.x1, s.y1, r, r, 0, PI);}
      else{rect(s.x1,s.y1,O_sectionwidth * 0.1,O_sectionwidth * 0.1)}

      if(s.y2-r>0 && s.y2+r<O_sectionheight){arc(s.x2, s.y2, r, r, PI * 0.5, PI * 1.5);}
      else{rect(s.x2-O_sectionheight * 0.1,s.y2-O_sectionheight * 0.05,O_sectionheight * 0.1,O_sectionheight * 0.1)}

      if(s.x3-r>0 && s.x3+r<O_sectionwidth){arc(s.x3, s.y3, r, r, PI, 2 * PI);}
      else{rect(s.x3,s.y3-O_sectionwidth * 0.05,O_sectionwidth * 0.1,O_sectionwidth * 0.1)}

      if(s.y4-r>0 && s.y4+r<O_sectionheight){arc(s.x4, s.y4, r, r, PI * 1.5, PI * 0.5);}
      else{rect(s.x4,s.y4,O_sectionheight * 0.1,O_sectionheight * 0.1)}

    }
    r += rinc;


    // Pop out of the section
    pop();
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.exquisitebw = { init, draw };
})();
