(() => {
    let s, lines = [], seed, dir = 1, amt = 0, numPoints = 200;
    let linesConfig = [];
    let maxDist, segSize, tCount;

    async function init() {
        s = O_currentsection;
        seed = random(100);
        lines = [];
        amt = 0;
        linesConfig = [];
        
        maxDist = O_sectionwidth / numPoints * 3;
        tCount = Math.floor(O_sectionwidth / 1.5);
        segSize = numPoints / tCount;
        
        const numLines = 8;
        const gap = Math.floor(O_sectionheight / numLines);
        const baseColor = [[0, 0, 0], [0, 100, 100], [240, 100, 100]];

        for (let i = 0; i < numLines; i++) {
            const yPos = i * gap;
            linesConfig.push({x1: 0, y1: yPos, x2: O_sectionwidth, y2: yPos, color: random(baseColor)});
        }
    
        linesConfig.push({x1: s.x3, y1: s.y3, x2: s.x4, y2: s.y4, color: [[0, 0, 0]]});
        linesConfig.push({x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2, color: [[0, 0, 0]]});

        lines = linesConfig.map(config => {
            const points = new Array(numPoints + 1);
            const x1 = config.x1;
            const y1 = config.y1;
            const x2 = config.x2;
            const y2 = config.y2;
            const invNumPoints = 1 / numPoints;
            
            for (let i = 0; i <= numPoints; i++) {
                const t = i * invNumPoints;
                const x = x1 + (x2 - x1) * t;
                const y = y1 + (y2 - y1) * t;
                points[i] = {
                    x: x,
                    y: y,
                    bx: x,
                    by: y
                };
            }
            
            return {
                points: points,
                color: config.color
            };
        });
    }

    function processLine(points, x1, y1, x2, y2) {
        const tCountInv = 1 / (tCount - 1);
        const maxRAmt = O_sectionwidth * 0.10 * amt;
        const TWO_PI_constant = TWO_PI;
        const PI_constant = Math.PI;
        
        for(let i = 0; i < tCount; i++) {
            const st = Math.floor(i * segSize);
            const ed = Math.floor((i + 1) * segSize);
            const cx = x1 + (x2 - x1) * i * tCountInv;
            const cy = y1 + (y2 - y1) * i * tCountInv;
            const r = Math.min(maxRAmt, cx, cy, O_sectionwidth - cx, O_sectionheight - cy);
            const stToEdRange = 1 / Math.max(1, ed - st);

            for(let j = st; j <= ed; j++) {
                const t = (j - st) * stToEdRange;
                const spiralT = 0.1 + 0.5 * t;
                
                const baseAngle = random(
                    spiralT * TWO_PI_constant * 1.5 + 
                    Math.sin(spiralT * PI_constant * 1.2) + 
                    i * TWO_PI_constant
                );
                
                const sinBaseAngle = Math.sin(baseAngle);
                const cosBaseAngle = Math.cos(baseAngle);
                const sinTerm = sinBaseAngle * Math.cos(spiralT * PI_constant * 5) * 25 * amt;
                const noiseTerm = noise(t * 3 + seed, j * 0.02) * 1.5;
                
                const radius = r * (0.3 + spiralT * 0.7) + sinTerm + noiseTerm;
                
                points[j].x = cx + radius * cosBaseAngle;
                points[j].y = cy + radius * sinBaseAngle;
            }
        }
    }

    function applyConstraints(points) {
        const maxDistSq = maxDist * maxDist;
        const halfCorrection = 0.5;
        
        for(let iter = 0; iter < 8; iter++) {
            for(let i = 1; i < points.length - 1; i++) {
                const p = points[i];
                const prev = points[i - 1];
                const dx = p.x - prev.x;
                const dy = p.y - prev.y;
                const distSq = dx * dx + dy * dy;
                
                if(distSq > maxDistSq) {
                    const s = maxDist / Math.sqrt(distSq);
                    const correction = (1 - s) * halfCorrection;
                    const dxCorrection = dx * correction;
                    const dyCorrection = dy * correction;
                    
                    prev.x += dxCorrection;
                    prev.y += dyCorrection;
                    p.x -= dxCorrection;
                    p.y -= dyCorrection;
                }
            }
        }
    }

    function draw() {
        push();
        translate(s.x, s.y);
        
        fill(42, 10, 93).stroke(0).rect(0, 0, O_sectionwidth, O_sectionheight);
        amt = Math.min((amt + 0.0005 * dir), 1);

        for(let i = 0; i < lines.length; i++) {
            const points = lines[i].points;
            for(let j = 0; j < points.length; j++) {
                const p = points[j];
                p.x = p.bx;
                p.y = p.by;
            }
        }
        
        for(let idx = 0; idx < lines.length; idx++) {
            const lineObj = lines[idx];
            const config = linesConfig[idx];
            processLine(lineObj.points, config.x1, config.y1, config.x2, config.y2);
            applyConstraints(lineObj.points);
        }
        
        push();
        drawingContext.beginPath();
        drawingContext.moveTo(s.x1, s.y1);
        drawingContext.lineTo(s.x2, s.y2);
        drawingContext.lineTo(O_sectionwidth, O_sectionheight);
        drawingContext.lineTo(s.x3, s.y3);
        drawingContext.lineTo(s.x4, s.y4);
        drawingContext.closePath();
        drawingContext.clip();
        
        noFill();
        strokeWeight(4);
        push();
        for(let i = 0; i < lines.length; i++) {
            const lineObj = lines[i];
            const color = lineObj.color;
            const points = lineObj.points;
            
            stroke(color[0], color[1], color[2]);
            beginShape();
            
            if (points.length > 2) {
                curveVertex(points[0].x, points[0].y);
            }
            
            for(let j = 0; j < points.length; j++) {
                curveVertex(points[j].x, points[j].y);
            }
            
            if (points.length > 2) {
                curveVertex(points[points.length-1].x, points[points.length-1].y);
            }
            
            endShape();
        }
        
        pop();
        pop();
        pop();
    }

    window.exquisitegibberish = {init, draw};
})();
