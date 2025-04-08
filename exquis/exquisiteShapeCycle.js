(() => {
  let s;
  let t = 0;
  let morphSpeed = 0.02;
  let spiralFactor = 0;
  let currentHue = 0;
  let baseRadius;

  async function init() {
    s = O_currentsection;
    colorMode(HSB, 360, 100, 100, 1);
    noFill();

    baseRadius = min(O_sectionwidth, O_sectionheight) * 0.25;
  }

  function draw() {
    t += morphSpeed;
    spiralFactor += 0.01;
    currentHue = (currentHue + 2) % 360;

    let centerX = s.x + O_sectionwidth / 2;
    let centerY = s.y + O_sectionheight / 2;

    // Optional: draw semi-transparent rect to slowly fade trails
    noStroke();
    fill(0, 0, 0, 0.05);
    rect(centerX - O_sectionwidth / 2, centerY - O_sectionheight / 2, O_sectionwidth, O_sectionheight);

    // Draw multiple offset shapes for the glitch effect
    for (let j = 0; j < 5; j++) {
      let localT = t + j * 0.1;
      let pulse = sin(localT * 1.5) * 0.5 + 0.5;
      let sides = floor(map(sin(localT), -1, 1, 3, 10));
      let shapeRotation = localT * 0.3;

      push();
      translate(centerX, centerY);
      rotate(shapeRotation);

      stroke((currentHue + j * 40) % 360, 100, 100, 0.8);
      strokeWeight(2);
      noFill();
      beginShape();
      for (let i = 0; i <= sides; i++) {
        let angle = map(i, 0, sides, 0, TWO_PI);
        let radiusVariation = noise(i * 0.3, localT) * 40 * pulse;
        let radius = baseRadius + radiusVariation;

        angle += spiralFactor * 20 / (radius + 1);

        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
     
    }
  }

  window.exquisiteShapeCycle = { init, draw };
})();


