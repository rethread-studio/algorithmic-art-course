//artwork: exquisiteA5

// Fais un ridgeline plot avec une inversion de couleur et une marche aleatoire qui relis les points du cadavre exquis
// Il est possible que la marche aleatoire sorte du cadre il faudra que j'adapte les bordures car cela change avec la resolution (dans la fonction constrain)

(() => {
  let s;
  let numLines = 12;
  let spacing = 20;
  let speed = 0.02;
  let second_gaussian;
  let noise_offset = [];
  let isInverted;
  let col;

  let customFC ;

  let mb_steps = 500;
  let start_1, start_2, start_3, start_4, start_5, start_6;
  let end_1, end_2, end_3, end_4, end_5, end_6;
  let mb_points_1, mb_points_2, mb_points_3, mb_points_4, mb_points_5, mb_points_6;
  let currentStep;

  function generateBrownianBridge(start, end, steps) {
    let points = [];
    let noise = [];
  
    // Génère un mouvement brownien 1D
    noise[0] = 0;
    for (let i = 1; i < steps; i++) {
      noise[i] = noise[i - 1] + randomGaussian(0, 2);
    }
  
    let W1 = noise[steps - 1];
  
    for (let i = 0; i < steps; i++) {
      let t = i / (steps - 1);
      let base = p5.Vector.lerp(start, end, t);
      let bridgeY = noise[i] - t * W1;
      points.push(createVector(base.x, constrain(base.y + bridgeY, 5, O_sectionheight-5)));
    }
    return points
  }

  function gaussian(x, x0, a, b) {
    let d = (x - x0) / a;
    return b * exp(-d * d);
  }

  async function init() {
    isInverted = false;
    currentStep = 0;
    customFC = 0;
    s = O_currentsection;
    noFill()
    strokeWeight(3);

    second_gaussian = random(0.5,1.2)
    for (let i = 0; i < int(O_sectionwidth/5*numLines); i++) {
      noise_offset.push(random());
    }

    start_1 = createVector(s.x1, s.y1);
    end_1 = createVector(s.x3, s.y3);

    start_2 = createVector(s.x4, s.y4);
    end_2 = createVector(s.x2, s.y2);

    start_3 = createVector(s.x1, s.y1);
    end_3 = createVector(s.x4, s.y4);

    start_4 = createVector(s.x2, s.y2);
    end_4 = createVector(s.x1, s.y1);

    start_5 = createVector(s.x3, s.y3);
    end_5 = createVector(s.x2, s.y2);

    start_6 = createVector(s.x4, s.y4);
    end_6 = createVector(s.x3, s.y3);

    mb_points_1 = generateBrownianBridge(start_1, end_1, mb_steps);
    mb_points_2 = generateBrownianBridge(start_2, end_2, mb_steps);
    mb_points_3 = generateBrownianBridge(start_3, end_3, mb_steps);
    mb_points_4 = generateBrownianBridge(start_4, end_4, mb_steps);
    mb_points_5 = generateBrownianBridge(start_5, end_5, mb_steps);
    mb_points_6 = generateBrownianBridge(start_6, end_6, mb_steps);
  }

  function draw() {
    if (O_sectionduration-customFC < 10) {
      isInverted = true;
    }
    push();
    translate(s.x, s.y);
    if (isInverted) {
      // noStroke()
      fill(0,0,100)
      rect(0,0,O_sectionwidth, O_sectionheight)
      col = color(0,0,0)
    }
    else {
      // noStroke()
      fill(0,0,0)
      rect(0,0,O_sectionwidth, O_sectionheight)
      col = color(0,0,100)
    }

    noFill()
    
    strokeWeight(3);
  
    for (let i = 0; i < numLines; i++) {
      let depth = map(i, 0, numLines, 1, 0); // 1 (devant) -> 0 (loin)
      let yOffset = O_sectionheight*0.8 - i * spacing;
      col.setAlpha(250 * depth)
      stroke(col); // Transparence selon la profondeur
      beginShape();
      for (let x = O_sectionwidth/4; x < 3*O_sectionwidth/4; x += 5) {
        let noiseScale = 0.01;
        let y = abs(yOffset - 
              (gaussian(x, O_sectionwidth *0.55, O_sectionwidth / 15 , (i+1)*0.05*spacing) + second_gaussian*gaussian(x, O_sectionwidth * 0.45, O_sectionwidth / 40 , (i+1)*0.05*spacing))
              *noise(x * noiseScale, i * 0.1, O_counter * speed) * 100 * depth 
              + 5*noise_offset[int(x*(i+1)/5)])+10
        vertex(x, y);
      }
      endShape();
    }
    
    stroke('#8F1600');
    noFill();
    if (isInverted) {
      beginShape();
      for (let i = 0; i < currentStep; i++) {
        let p = mb_points_1[i];
        vertex(p.x, p.y);
      }
      endShape();
      beginShape();
      for (let i = 0; i < currentStep; i++) {
        let p = mb_points_2[i];
        vertex(p.x, p.y);
      }
      endShape();
      beginShape();
      for (let i = 0; i < currentStep; i++) {
        let p = mb_points_3[i];
        vertex(p.x, p.y);
      }
      endShape();
      beginShape();
      for (let i = 0; i < currentStep; i++) {
        let p = mb_points_4[i];
        vertex(p.x, p.y);
      }
      endShape();
      beginShape();
      for (let i = 0; i < currentStep; i++) {
        let p = mb_points_5[i];
        vertex(p.x, p.y);
      }
      endShape();
      beginShape();
      for (let i = 0; i < currentStep; i++) {
        let p = mb_points_6[i];
        vertex(p.x, p.y);
      }
      endShape();
    }

    if (customFC > 300 && currentStep < mb_points_1.length) {
      currentStep++;
    } 
    
    if (customFC > 300 && (int(O_counter / 60)+1) % int(random(4,6)) == 0) {
      isInverted = !isInverted;
    }
    customFC++;
    pop();
  }
  window.exquisiteA4 = { init, draw };
})();