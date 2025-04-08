(() => {
  let s, d, w, h;;
  let impact;
  let cracks;
  let arks;

  let images = [];
  let nbTextures = 10;
  let iter = 1;

  async function init() {

    // Important variables
    cracks = [];
    impact = [];
    images = [];
    arks = [{ r: 10, startAngle: 0, endAngle: 2 * Math.PI }];
    s = O_currentsection;
    d = O_sectionduration;
    w = O_sectionwidth;
    h = O_sectionheight;

    // Déplacement au centre de la section
    push();
    translate(s.x + w / 2, s.y + h / 2);

    // Générer les impacts
    generateImpact();

    // Générer les cracks pour 4 points
    let points = [
      { x: s.x1 - w / 2, y: s.y1 - h / 2 },
      { x: s.x2 - w / 2, y: s.y2 - h / 2 },
      { x: s.x3 - w / 2, y: s.y3 - h / 2 },
      { x: s.x4 - w / 2, y: s.y4 - h / 2 },
    ];
    for (let p of points) {
      generateCrack(p.x, p.y);
    }

    // Générer des cracks de bordure
    cracks.push({ p1: { x: -w / 2, y: -h / 2 }, p2: { x: w / 2, y: -h / 2 } });
    cracks.push({ p1: { x: -w / 2, y: h / 2 }, p2: { x: w / 2, y: h / 2 } });
    cracks.push({ p1: { x: -w / 2, y: -h / 2 }, p2: { x: -w / 2, y: h / 2 } });
    cracks.push({ p1: { x: w / 2, y: -h / 2 }, p2: { x: w / 2, y: h / 2 } });

    // Générer d'autres points
    let nbPoints = Math.floor(O_sectionduration/6);
    // let nbPoints = 10;
    for (let i = 0; i < nbPoints; i++) {
      let x = random(-w / 2 + 100, w / 2 - 100);
      let y = random(-h / 2 + 50, h / 2 - 50);
      while (x ** 2 + y ** 2 < 10 ** 2) {
        x = random(-w / 2, w / 2);
        y = random(-h / 2, h / 2);
      }

      generateCrack(x, y);
      generateArk(x, y);
      cracks.at(-1).ark = arks.at(-1);
    }

    pop();

    console.log(O_sectionduration, nbPoints)
  }

  function draw() {
    console.log(frameCount)
    push();

    colorMode(RGB);
    translate(s.x + w/2, s.y + h/2);

    fill(0);
    rect(-w/2, -h/2, w, h);
  

    if (frameCount % 3 == 0) {
      iter += 1;
    }  

    let cracksCopy = JSON.parse(JSON.stringify(cracks.slice(8, cracks.length)));
    cracksCopy.sort((a, b) => b.ark.r - a.ark.r);

    drawImpact();
    drawCracks();
    drawArks();  

    for (let i = 0; i < min(iter, cracksCopy.length); i++) {
      applyTexture(cracksCopy[i]);
    }

    
        
    pop();

  }

  function applyTexture(c, k) {
    let r1 = dist(0, 0, c.p1.x, c.p1.y);
    let r2 = dist(0, 0, c.p2.x, c.p2.y);

    fill(c.c[0], c.c[1], c.c[2]);

    beginShape();

    for (let angle = c.ark.startAngle; angle <= c.ark.endAngle; angle += 0.05) {
      let ix = cos(angle) * r1;
      let iy = sin(angle) * r1;
      vertex(ix, iy);
    }
  
    for (let angle = c.ark.endAngle; angle >= c.ark.startAngle; angle -= 0.05) {
      let ix = cos(angle) * r2;
      let iy = sin(angle) * r2;
      vertex(ix, iy);
    }

    endShape(CLOSE)
    
  }

  function drawCracks(){
    stroke(255);
    strokeWeight(1);
    for (let i = 0; i < cracks.length; i++){
      let crack = cracks[i];
      if (i < 4) {strokeWeight(3);}
      else {strokeWeight(1);}
      line(crack.p1.x, crack.p1.y, crack.p2.x, crack.p2.y);
    }
  }

  function drawImpact() {
    stroke(255);
    for (let imp of impact) {
      line(imp.p1.x, imp.p1.y, imp.p2.x, imp.p2.y);
    } 
  }

  function drawArks(){
    noFill();
    stroke(255);
    for (let ark of arks) {
      if(ark.crack==cracks[4]){stroke(255,0,0)}
      arc(0, 0, 2*ark.r, 2*ark.r, ark.startAngle, ark.endAngle);
      stroke(255)
    }
  }  

  function generateImpact(){
    let nbLines = 8;
    let r = 50;
  
    for (let i = 0; i < nbLines; i++) {
      let angleP1 = i*2*Math.PI/nbLines;
      let angleP2 = (i+1)*2*Math.PI/nbLines;
  
      if (i==0) {
        impact.push({p1: {x: (r)*Math.cos(angleP1), y: (r)*Math.sin(angleP1)}, p2: {x: (r)*Math.cos(angleP2), y: (r)*Math.sin(angleP2)}});
      }
      else if (i==nbLines-1) {
        impact.push({p1: impact.at(-1).p2, p2: impact.at(0).p1});
      }
      else{
        impact.push({p1: impact.at(-1).p2, p2: {x: (r)*Math.cos(angleP2), y: (r)*Math.sin(angleP2)}});
      }
    }
  }

  function generateArk(x1, y1) {
    let r = dist(0, 0, x1, y1);   
    let startTheta = normalizeAngle(atan2(y1, x1));
    let res = {x: null, y:null, theta: Infinity};
    let D = Infinity

    for (let crack of cracks) {
      if (crack.p1.x!=x1 || crack.p1.y!=y1) {
        let cur = collideLineArc(r, crack)
        if (cur.theta==Infinity) {continue}
        
        let delta = cur.theta - startTheta;
        if (delta > Math.PI) {
          delta -= 2 * Math.PI; 
        } 
        else if (delta < -Math.PI) {
          delta += 2 * Math.PI; 
        }
          
        
        if (abs(delta) < abs(D)) {
          res = cur;
          D = delta;
        }
      }
    }
    
    if(res.theta==Infinity)  {
      arks.push({r: r, startAngle: startTheta, endAngle: startTheta + 2*Math.PI}) 
    }
    else{
      arks.push({r: r, startAngle: min(startTheta, startTheta + D), endAngle: max(startTheta, startTheta + D)}) 
    }
  }

  
  function collideLineArc(r, crack) {
    let x1 = crack.p1.x;
    let x2 = crack.p2.x;
    let y1 = crack.p1.y;
    let y2 = crack.p2.y;

    let a = (x2-x1)**2 + (y2-y1)**2;
    let b = 2*(x1*(x2-x1) + y1*(y2-y1));
    let c = x1**2 + y1**2 - r**2

    let delta = b**2-4*a*c;
    let sols = [];

    if (delta == 0) {
      sols = [-b/(2*a)];
    }
    else {
      sols = [(-b+Math.sqrt(delta))/(2*a), (-b-Math.sqrt(delta))/(2*a)];
    }

    let coords = [];
    for (let sol of sols) {
      coords.push({x: x1 + sol*(x2-x1), y: y1 + sol*(y2-y1), theta: normalizeAngle(atan2(y1 + sol*(y2-y1), x1 + sol*(x2-x1)))})
    }

    // console.log(delta)
    // console.log(sols)


    for(let i = 0; i < sols.length; i++) {  
      if (sols[i] <= 1 && sols[i] >= 0) {
        // fill(255);
        // circle(coords[i].x, coords[i].y, 25, 25);
        return coords[i];
      }
    }

    return {x: null, y:null, theta: Infinity}
  }


  function generateCrack(x1, y1) {
    let r, g, b;
    arks.sort((a, b) => b.r - a.r);
    for (let ark of arks) {
      let p = collideArcLine(x1, y1, ark.r, ark.startAngle, ark.endAngle)
      if (p!=null) {
        r = random(255); 
        g = random(255);  
        b = random(255);
        cracks.push({p1: {x: x1, y:y1}, p2: {x: p.x, y: p.y}, c: [r, g, b]})
        return
      }
      
    }
  
    for (let imp of impact) {
      let intersection = collideLineLine(x1, y1, 0, 0, imp.p1.x, imp.p1.y, imp.p2.x, imp.p2.y, true)
      if (!intersection["x"]==false) {
        r = random(255); 
        g = random(255);  
        b = random(255);
        cracks.push({p1: {x: x1, y:y1}, p2: {x: intersection["x"], y: intersection["y"]}, c: [r, g, b]})
        return
      }
    }
  }

  function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4,calcIntersection) {

    var intersection;
  
    // calculate the distance to intersection point
    var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
  
      if(this._collideDebug || calcIntersection){
        // calc the point where the lines meet
        var intersectionX = x1 + (uA * (x2-x1));
        var intersectionY = y1 + (uA * (y2-y1));
      }
  
      if(this._collideDebug){
        this.ellipse(intersectionX,intersectionY,10,10);
      }
  
      if(calcIntersection){
        intersection = {
          "x":intersectionX,
          "y":intersectionY
        }
        return intersection;
      }else{
        return true;
      }
    }
    if(calcIntersection){
      intersection = {
        "x":false,
        "y":false
      }
      return intersection;
    }
    return false;
  }

  function collideArcLine(x1, y1, r, startAngle, endAngle) {
    let a = x1**2 + y1**2;
    let b = -2*(x1**2 + y1**2);
    let c = x1**2 + y1**2 - r**2
  
    let delta = b**2-4*a*c;
    let sols = [];
  
    if (delta == 0) {
      sols = [-b/(2*a)];
    }
    else {
      sols = [(-b+Math.sqrt(delta))/(2*a), (-b-Math.sqrt(delta))/(2*a)];
    }
    let points = [];
    for (let sol of sols) {
      points.push({x: (1-sol)*x1, y: (1-sol)*y1, theta: normalizeAngle(atan2((1-sol)*y1, (1-sol)*x1))})
    }
  
  
    for(let i = 0; i < sols.length; i++) {  
      if (sols[i] <= 1 && sols[i] >= 0 && points[i].theta <= endAngle && points[i].theta >= startAngle) {
        return {x: points[i].x, y: points[i].y}
      }
    }
  
    return null
  }
  
  function normalizeAngle(angle) {
    return (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.shatteredAperture = { init, draw };
})();
