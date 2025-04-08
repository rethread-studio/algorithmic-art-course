(() => {
  let s;
  let t = 0;
  let morphSpeed = 0.02;
  let spiralFactor = 0;
  let currentHue = 0;

  async function init() {
    s = O_currentsection; 
    colorMode(HSB, 360, 100, 100, 1);
    noFill();
  }

  function draw() {
    t += morphSpeed;
    spiralFactor += 0.005;
    currentHue = (currentHue + 0.5) % 360;

    let pulse = sin(t * 1.5) * 0.5 + 0.5;
    let baseRadius = 180 * pulse;
    let sides = floor(map(sin(t), -1, 1, 3, 10));
    let shapeRotation = t * 0.3;


    fill(0, 0.1); 
    rect(0, 0, width, height); 

    push();
    translate(s.x, s.y);
    rotate(shapeRotation);

    stroke(currentHue, 80, 100, 0.8);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i <= sides; i++) {
      let angle = map(i, 0, sides, 0, TWO_PI);
      let radiusVariation = noise(i * 0.2, t) * 50 * pulse;
      let radius = baseRadius + radiusVariation;

      angle += spiralFactor * 20 / (radius + 1);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;

      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  window.exquisiteShapeCycle = { init, draw };
})();
