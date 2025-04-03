(() => {
    let s;
    let snowflakes = [];
  
    async function init() {
      s = O_currentsection;
      for (let i = 0; i < 100; i++) {
        snowflakes.push({
          x: random(O_sectionwidth),
          y: random(O_sectionheight),
          r: random(1, 3),
          speed: random(0.5, 1.5)
        });
      }
    }
  
    function draw() {
      push();
      translate(s.x, s.y);
  
      // Background
      noStroke();
      fill(240, 50, 20); // cool bluish tone
      rect(0, 0, O_sectionwidth, O_sectionheight);
  
      // Trees
      for (let i = 0; i < 3; i++) {
        let baseX = (i + 1) * O_sectionwidth / 4 + random(-5, 5);
        fill(30, 80, 40); // trunk
        rect(baseX - 4, O_sectionheight - 30, 8, 30);
        fill(120, 100, 60); // foliage
        triangle(baseX - 15, O_sectionheight - 30, baseX + 15, O_sectionheight - 30, baseX, O_sectionheight - 65);
      }
  
      // Snowfall
      fill(0, 0, 100, 200);
      for (let flake of snowflakes) {
        ellipse(flake.x, flake.y, flake.r * 2);
        flake.y += flake.speed;
        if (flake.y > O_sectionheight) {
          flake.y = 0;
          flake.x = random(O_sectionwidth);
        }
      }
  
      // Ground snow
      fill(0, 0, 100, 120);
      ellipse(O_sectionwidth / 2, O_sectionheight + 10, O_sectionwidth + 50, 40);
  
      
    }
  
    window.exquisiteglow = { init, draw };
  })();
// This code defines an animated scene with snowflakes, trees, and glowing orbs.
// It uses the p5.js library for drawing and animation.  
