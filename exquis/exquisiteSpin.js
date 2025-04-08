(() => {
  let s;
  let t = 0;
  let hueBase = 0;
  let particles = [];
  const PARTICLE_COUNT = 150;
  const MAX_RINGS = 8;

  async function init() {
      s = O_currentsection;
      colorMode(HSB, 360, 100, 100, 1);
      noFill();
      
      // Initialize particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
              radius: random(20, 200),
              angle: random(TWO_PI),
              speed: random(0.005, 0.02),
              size: random(2, 8),
              orbitSpeed: random(-0.03, 0.03),
              hueOffset: random(360),
              spiralFactor: random(0.5, 2),
              pulseSpeed: random(0.05, 0.2)
          });
      }
  }

  function draw() {
      t += 0.01;
      hueBase = (hueBase + 0.5) % 360;
      const centerX = O_sectionwidth / 2;
      const centerY = O_sectionheight / 2;

      push();
      translate(s.x + centerX, s.y + centerY);
      
      // Draw pulsing center glow
      const pulseSize = sin(t * 2) * 5 + 15;
      fill(hueBase, 80, 100, 0.3);
      noStroke();
      ellipse(0, 0, pulseSize * 3);
      fill(hueBase, 100, 100, 0.6);
      ellipse(0, 0, pulseSize * 1.5);
      
      // Draw dynamic rings
      for (let r = 1; r <= MAX_RINGS; r++) {
          const ringRadius = r * 30 + sin(t * 0.5 + r) * 15;
          const ringHue = (hueBase + r * 30) % 360;
          
          stroke(ringHue, 80, 100, 0.4);
          strokeWeight(1.5);
          noFill();
          ellipse(0, 0, ringRadius * 2);
          
          // Draw ring particles
          const particlesPerRing = 60 + r * 20;
          for (let i = 0; i < particlesPerRing; i++) {
              const angle = (i / particlesPerRing) * TWO_PI + t * (0.2 + r * 0.05);
              const particleRadius = ringRadius + sin(t * 2 + i * 0.1) * 10;
              const x = cos(angle) * particleRadius;
              const y = sin(angle) * particleRadius;
              
              const hue = (ringHue + i * 2) % 360;
              const size = 2 + sin(t * 3 + i) * 1.5;
              
              fill(hue, 100, 100);
              noStroke();
              ellipse(x, y, size);
              
              // Draw connecting lines
              if (i % 5 === 0) {
                  stroke(hue, 50, 100, 0.3);
                  line(0, 0, x, y);
              }
          }
      }
      
      // Draw free-floating particles
      for (let p of particles) {
          p.angle += p.speed;
          p.radius += sin(t * p.pulseSpeed) * 0.5;
          
          const spiralOffset = t * p.spiralFactor;
          const x = cos(p.angle + spiralOffset) * p.radius;
          const y = sin(p.angle + spiralOffset) * p.radius;
          
          const hue = (hueBase + p.hueOffset) % 360;
          const currentSize = p.size + sin(t * 3) * p.size * 0.3;
          
          fill(hue, 100, 100, 0.9);
          noStroke();
          ellipse(x, y, currentSize);
          
          // Occasionally emit trails
          if (random() > 0.97) {
              fill(hue, 100, 100, 0.3);
              ellipse(x + random(-5, 5), y + random(-5, 5), currentSize * 3);
          }
      }
      
      // Draw radial energy waves
      for (let i = 0; i < 3; i++) {
          const waveRadius = (t * 50 + i * 40) % (max(centerX, centerY) * 1.5);
          const waveAlpha = map(waveRadius, 0, max(centerX, centerY) * 1.5, 0.8, 0);
          stroke(hueBase + i * 40, 100, 100, waveAlpha);
          strokeWeight(1.5);
          noFill();
          ellipse(0, 0, waveRadius * 2);
      }
      
      pop();
  }

  window.exquisiteSpin = { init, draw };
})();