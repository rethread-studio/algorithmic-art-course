(() => {
    let s;
    let t = 0;
    let hueBase = 0;
    let particles = [];
    const PARTICLE_COUNT = 150;
    const MAX_RINGS = 6;
    let growth = 0; // Grows from 0 to 1
  
    async function init() {
      s = O_currentsection;
      colorMode(HSB, 360, 100, 100, 1);
      noFill();
  
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          baseRadius: random(20, 100),
          angle: random(TWO_PI),
          speed: random(0.005, 0.02),
          size: random(2, 6),
          orbitSpeed: random(-0.03, 0.03),
          hueOffset: random(360),
          spiralFactor: random(0.5, 2),
          pulseSpeed: random(0.05, 0.2),
        });
      }
    }
  
    function draw() {
      t += 0.01;
      hueBase = (hueBase + 0.5) % 360;
  
      const centerX = s.x + O_sectionwidth / 2;
      const centerY = s.y + O_sectionheight / 2;
  
      const maxPossibleRadius = min(O_sectionwidth, O_sectionheight) / 2 - 10;
      growth = min(growth + 0.002, 1); // Slow down growth
      const currentMaxRadius = maxPossibleRadius * growth;
  
      // Clear background with transparent fade
      noStroke();
      fill(0, 0, 0, 0.05);
      rect(s.x, s.y, O_sectionwidth, O_sectionheight);
  
      push();
      translate(centerX, centerY);
  
      // Central pulsing glow
      const pulseSize = sin(t * 2) * 5 + 15 * growth;
      fill(hueBase, 80, 100, 0.3);
      noStroke();
      ellipse(0, 0, pulseSize * 3);
      fill(hueBase, 100, 100, 0.6);
      ellipse(0, 0, pulseSize * 1.5);
  
      // Rings
      for (let r = 1; r <= MAX_RINGS; r++) {
        let ringRadius = r * currentMaxRadius / MAX_RINGS + sin(t * 0.5 + r) * 5 * growth;
        const ringHue = (hueBase + r * 30) % 360;
  
        stroke(ringHue, 80, 100, 0.4);
        strokeWeight(1.5);
        noFill();
        ellipse(0, 0, ringRadius * 2);
  
        const particlesPerRing = 20 + r * 10;
        for (let i = 0; i < particlesPerRing; i++) {
          const angle = (i / particlesPerRing) * TWO_PI + t * (0.2 + r * 0.05);
          const particleRadius = ringRadius + sin(t * 2 + i * 0.1) * 5 * growth;
          const x = cos(angle) * particleRadius;
          const y = sin(angle) * particleRadius;
  
          const hue = (ringHue + i * 2) % 360;
          const size = 2 + sin(t * 3 + i) * 1 * growth;
  
          fill(hue, 100, 100);
          noStroke();
          ellipse(x, y, size);
  
          if (i % 5 === 0) {
            stroke(hue, 50, 100, 0.3);
            line(0, 0, x, y);
          }
        }
      }
  
      // Free-floating spiral particles
      for (let p of particles) {
        p.angle += p.speed;
        const radius = constrain(p.baseRadius * growth + sin(t * p.pulseSpeed) * 0.5, 20, currentMaxRadius - 10);
        const spiralOffset = t * p.spiralFactor;
        const x = cos(p.angle + spiralOffset) * radius;
        const y = sin(p.angle + spiralOffset) * radius;
  
        const hue = (hueBase + p.hueOffset) % 360;
        const currentSize = p.size * growth + sin(t * 3) * p.size * 0.2;
  
        fill(hue, 100, 100, 0.9);
        noStroke();
        ellipse(x, y, currentSize);
  
        if (random() > 0.98) {
          fill(hue, 100, 100, 0.2);
          ellipse(x + random(-3, 3), y + random(-3, 3), currentSize * 2);
        }
      }
  
      // Energy waves (stop growing at full size)
      if (growth >= 1) {
        for (let i = 0; i < 3; i++) {
          const waveRadius = (t * 50 + i * 40) % currentMaxRadius;
          const waveAlpha = map(waveRadius, 0, currentMaxRadius, 0.5, 0);
          stroke((hueBase + i * 40) % 360, 100, 100, waveAlpha);
          strokeWeight(1.5);
          noFill();
          ellipse(0, 0, waveRadius * 2);
        }
      }
  
      pop();
  
      // Section border
      noFill();
      stroke(0, 0, 100, 1);
      strokeWeight(1);
      rect(s.x, s.y, O_sectionwidth, O_sectionheight);
    }
  
    window.exquisiteSpin = { init, draw };
})();
