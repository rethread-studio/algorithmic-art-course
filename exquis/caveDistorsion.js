(() => {
    let s, w, h;

    let steps; 
    let noiseScale; 

    let listOfStratesCurvesX;
    let nbStratesX;
    let nbCurvesX;

    let listOfStratesCurvesY;
    let nbStratesY;
    let nbCurvesY;

    let listOfStratesCurvesColor;
    let nbCurvesColor;

    let stars;
    let nbStars;
    let starSizeMin;
    let starSizeMax;
    let starSpeedMin;
    let starSpeedMax;

    async function init() {
      s = O_currentsection;
      w = O_sectionwidth;
      h = O_sectionheight;

      steps = 80; 
      noiseScale = 0.04; 

      listOfStratesCurvesX = [];
      nbStratesX = 4;
      nbCurvesX = 3;

      listOfStratesCurvesY = [];
      nbStratesY = 3;
      nbCurvesY = 3;

      listOfStratesCurvesColor = [];
      nbCurvesColor = 3;

      stars = [];
      nbStars = 150;
      starSizeMin = 1;
      starSizeMax = 4;
      starSpeedMin = 0.02;
      starSpeedMax = 0.1;

      push();
      translate(s.x, s.y);

      generateStars();
      generateStratesX();  
      generateStratesY(); 
      generateColorStrates();

      pop();
    }
  
    function draw() {
      // noLoop();

      push();
      colorMode(RGB);
      translate(s.x, s.y);
      
   


      if (frameCount % 20 == 0) {
        generateStars();
        generateStratesX();
        generateStratesY(); 
        generateColorStrates();
        noiseScale += 0.03; 
      }   


      
      for (let i = 0; i < max(listOfStratesCurvesX.length, listOfStratesCurvesY.length); i++) {
        if (i < listOfStratesCurvesX.length) {
          let strate = listOfStratesCurvesX[i];
          for (let i = 0; i < strate.length - 1; i++) {
            let n = noise(i**2);
            let c = Math.floor(n * 255);
         
            fill(c);
            stroke(0);

            beginShape();
            for (let p of strate[i]) {
              curveVertex(p.x, p.y);
            }
            for (let p of strate[i+1].slice().reverse()) {
              curveVertex(p.x, p.y)
            }
            endShape(CLOSE);
          }
        }

        if (i < listOfStratesCurvesY.length) {
          let strate = listOfStratesCurvesY[i];
          for (let i = 0; i < strate.length - 1; i++) {
            let n = noise(i**2);
            let c = Math.floor(n * 255);
         
            fill(c);
            beginShape();
            for (let p of strate[i]) {
              curveVertex(p.x, p.y);
            }
            for (let p of strate[i+1].slice().reverse()) {
              curveVertex(p.x, p.y)
            }
            endShape(CLOSE);
          }
        }
      }

      for (let strate of listOfStratesCurvesColor) {
        for (let i = 0; i < strate.length - 1; i++) {
          let n = noise(i**2);
          let c = Math.floor(n * 200);
       
          fill(random(100,255),0,0);
          beginShape();
          for (let p of strate[i]) {
            curveVertex(p.x, p.y);
          }
          for (let p of strate[i+1].slice().reverse()) {
            curveVertex(p.x, p.y)
          }
          endShape(CLOSE);
        }
      }


      // for (let star of stars) {
      //   let brightness = map(sin(frameCount * star.speed + star.phase), -1, 1, 100, 255); 
      //   noStroke();
      //   fill(brightness);
      //   ellipse(star.x, star.y, star.size);
      // }

      pop();
    }
    
    function generateStars() {
      for (let i = 0; i < nbStars; i++) {
        stars.push({
          x: random(w),  // Position X aléatoire
          y: random(h), // Position Y aléatoire
          size: random(starSizeMin, starSizeMax), // Taille de l’étoile (petite variation)
          speed: random(starSpeedMin, starSpeedMax), // Vitesse de scintillement
          phase: random(TWO_PI) // Décalage pour variation de luminosité
        });
      }
    }
    
    function generateStratesX() {
      // Découpage et répartitions des intervalles supérieur et inférieur des strates
      listOfStratesCurvesX = []
      let xTop = generateStratesAnchorX(nbStratesX);
      let xBot = generateStratesAnchorX(nbStratesX);
      let xPair = xBot.map((item, i) => ({ bot: item, top: xTop[i] }));
      //console.log(xTop, xBot, xPair)
      // Génération de l'intérieur des startes
      for (let i = 0; i < nbStratesX; i++) {
        // nbCurves fixe, le rendre semi aléatoire ?
        listOfStratesCurvesX.push(generateStrateX(xPair[i].bot.a, xPair[i].bot.b, xPair[i].top.a, xPair[i].top.b, nbCurvesX));
      }
      // noiseScale += 0.04;
    }

    function generateStratesY() {
      // Découpage et répartitions des intervalles supérieur et inférieur des strates
      listOfStratesCurvesY = []
      let yTop = generateStratesAnchorY(nbStratesY);
      let yBot = generateStratesAnchorY(nbStratesY);
      let yPair = yBot.map((item, i) => ({ bot: item, top: yTop[i] }));
    
      // Génération de l'intérieur des startes
      for (let i = 0; i < nbStratesY; i++) {
        // nbCurves fixe, le rendre semi aléatoire ?
        listOfStratesCurvesY.push(generateStrateY(yPair[i].bot.a, yPair[i].bot.b, yPair[i].top.a, yPair[i].top.b, nbCurvesY));
      }
      // noiseScale += 0.04;
    }

    function generateColorStrates() {
      listOfStratesCurvesColor = []
      
      let cPair = [];

      let a = 20;
      let b = 5;
      
      if (frameCount == O_sectionduration) {
        cPair = [{bot: {a: s.x1 + random(-a,-b), b: s.x1 + random(b,a)}, top: {a: s.x3 + random(-a,-b), b: s.x3 + random(b,a)}},
          {bot: {a: s.y2 + random(-a,-b), b: s.y2 + random(b,a)}, top: {a: s.y4 + random(-a,-b), b: s.y4 + random(b,a)}}
        ]
      }
      else {
        let a1 = random(0,w-20);
        let b1 = a1 + random(10,20)
        let a2 = random(0,w-20);
        let b2 = a2 + random(10,20)

        let a3 = random(0,h-20);
        let b3 = a3 + random(10,20)
        let a4 = random(0,h-20);
        let b4 = a4 + random(10,20)


        cPair = [{bot: {a: a1, b: b1}, top: {a: a2, b: b2}},
                  {bot: {a: a3, b: b3}, top: {a: a4, b: b4}}
               ]
      }
      

      // Génération de l'intérieur des startes
      listOfStratesCurvesColor.push(generateStrateX(cPair[0].bot.a, cPair[0].bot.b, cPair[0].top.a, cPair[0].top.b, nbCurvesColor));
      listOfStratesCurvesColor.push(generateStrateY(cPair[1].bot.a, cPair[1].bot.b, cPair[1].top.a, cPair[1].top.b, nbCurvesColor));
    }

    function generateStratesAnchorX(nbStratesX) { // Trouver comment répartir les intervalles. Collés, espacés ? 
      // Génère les points délimitant les intervalles
      let xDivision = Array.from({length: nbStratesX - 1 }, () => random(0, w));
      // Rajoute 2 points extremes (A enelver/ modifier ?)
      xDivision.push(0, w); 
      // Tri des points
      xDivision.sort((a, b) => a - b); 
      // Associations des intervalles
      xDivision = xDivision.map((a, i, arr) => i < arr.length - 1 ? { a, b: arr[i + 1] } : null).slice(0, -1);
      // Tri aléatoire des intervalles
      xDivision = [...xDivision].sort(() => Math.random() - 0.5);
      return xDivision
    }

    function generateStratesAnchorY(nbStratesY) { // Trouver comment répartir les intervalles. Collés, espacés ? 
      // Génère les points délimitant les intervalles
      let yDivision = Array.from({length: nbStratesY - 1 }, () => random(0, h));
      // Rajoute 2 points extremes (A enelver/ modifier ?)
      yDivision.push(0, h); 
      // Tri des points
      yDivision.sort((a, b) => a - b); 
      // Associations des intervalles
      yDivision = yDivision.map((a, i, arr) => i < arr.length - 1 ? { a, b: arr[i + 1] } : null).slice(0, -1);
      // Tri aléatoire des intervalles
      yDivision = [...yDivision].sort(() => Math.random() - 0.5);
      return yDivision
    }

    function generateStrateX(x1, x2, x3, x4, nbCurvesX) {
      // Attribution des coordonées X de début et de fin
      let startX =  Array.from({length: nbCurvesX - 1}, () => Math.random() * (x2 - x1) + x1).sort((a, b) => a - b);
      startX.unshift(x1);
      startX.push(x2);
      let endX =  Array.from({length: nbCurvesX - 1}, () => Math.random() * (x4 - x3) + x3).sort((a, b) => a - b);
      endX.unshift(x3);
      endX.push(x4);

      let stratesCurves = [];
      // Création de la strates initiale
      generateFirstCurveX(stratesCurves, startX[0], endX[0]);
      
      // Ajout des strates suivantes
      for (let i = 1; i < nbCurvesX + 1; i++) {
        generateNextCurveX(stratesCurves, startX[i], endX[i]);
      }
      return stratesCurves;
    
    }

    function generateStrateY(y1, y2, y3, y4, nbCurvesY) {
      // Attribution des coordonées X de début et de fin
      let startY =  Array.from({length: nbCurvesY - 1}, () => Math.random() * (y2 - y1) + y1).sort((a, b) => a - b);
      startY.unshift(y1);
      startY.push(y2);
      let endY =  Array.from({length: nbCurvesY - 1}, () => Math.random() * (y4 - y3) + y3).sort((a, b) => a - b);
      endY.unshift(y3);
      endY.push(y4);

      let stratesCurves = [];
      // Création de la strates initiale
      generateFirstCurveY(stratesCurves, startY[0], endY[0]);
      
      // Ajout des strates suivantes
      for (let i = 1; i < nbCurvesY + 1; i++) {
        generateNextCurveY(stratesCurves, startY[i], endY[i]);
      }
      return stratesCurves;
    
    }

    function generateFirstCurveX(stratesCurves, xd, xf) {
      let curve = [];
      for (let i = 0; i <= steps; i++) { // Modifier steps en curveResolution, en faire un hyperparametre ?
        let t = i / steps;
        let noiseValue = noise(i * noiseScale) * 0.4 - 0.2; // transformer 0.4 et 0.2 en hyperparamtres ? Les rendre semi- aléatoire ?
        let y = t + noiseValue * sqrt(t * (1 - t));
        y = constrain(y, 0, 1);
        let pos = createVector(map(t, 0, 1, xd, xf), map(y, 0, 1, h, 0));
        curve.push(pos);
      }
      stratesCurves.push(curve);
    }

    function generateFirstCurveY(stratesCurves, yd, yf) {
      let curve = [];
      for (let i = 0; i <= steps; i++) { // Modifier steps en curveResolution, en faire un hyperparametre ?
        let t = i / steps;
        let noiseValue = noise(i * noiseScale) * 0.4 - 0.2; // transformer 0.4 et 0.2 en hyperparamtres ? Les rendre semi- aléatoire ?
        let x = t + noiseValue * sqrt(t * (1 - t));
        x = constrain(x, 0, 1);
        let pos = createVector(map(x, 0, 1, w, 0), map(t, 0, 1, yd, yf));
        curve.push(pos);
      }
      stratesCurves.push(curve);
    }

    function generateNextCurveX(stratesCurves, xd, xf) {
      let curve = [];
      for (let i = 0; i <= steps; i++) {
        let last_pos = stratesCurves[stratesCurves.length - 1][i]
        let t = i / steps;
        let noiseValue = (noise(i * noiseScale) * 50 - 25)* sqrt(t * (1 - t));
        let x = map(t, 0, 1, xd, xf);
        x = x + noiseValue
        x = constrain(x, 0, w);
    
        let pos = createVector(x, last_pos.y);
        curve.push(pos);
      }
      stratesCurves.push(curve);
    }

    function generateNextCurveY(stratesCurves, yd, yf) {
      let curve = [];
      for (let i = 0; i <= steps; i++) {
        let last_pos = stratesCurves[stratesCurves.length - 1][i]
        let t = i / steps;
        let noiseValue = (noise(i * noiseScale) * 50 - 25)* sqrt(t * (1 - t));
        let y = map(t, 0, 1, yd, yf);
        y = y + noiseValue
        // x = constrain(x + noiseValue, last_pos.x, x + 4000);
    
        let pos = createVector(last_pos.x, y);
        curve.push(pos);
      }
      stratesCurves.push(curve);
    }

    // Use the name of the current js file (without the extension) as the key in the object window.
    window.caveDistorsion = { init, draw };
  })();
  