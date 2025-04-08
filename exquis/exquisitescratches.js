(() => {
    let s, seed, dir = 1, amt = 0, numPoints = 900;
    const clrs = [[330,40,70],[355,40,85],[24,50,95],[43,40,95]];
    let pointsLists = [];

    async function init() {
        s = O_currentsection;
        seed = random(100);
        pointsLists = [];
        amt = 0;
        for (let i = 0; i < 5; i++) {
            pointsLists[i] = Array.from({length: 901}, (_, j) => {
                return {
                    x: lerp(s.x4, s.x2, j/numPoints),
                    y: lerp(s.y4, s.y2, j/numPoints),
                    bx: lerp(s.x4, s.x2, j/numPoints),
                    by: lerp(s.y4, s.y2, j/numPoints)
                };
            });
        }
    }

    function draw() {
        push();
        translate(s.x, s.y);
        fill(0).stroke(0).rect(0, 0, O_sectionwidth, O_sectionheight);
        push();
        drawingContext.beginPath();
        drawingContext.moveTo(s.x1, s.y1);
        drawingContext.lineTo(s.x2, s.y2);
        drawingContext.lineTo(s.x3, s.y3);
        drawingContext.lineTo(s.x4, s.y4);
        drawingContext.closePath();
        drawingContext.clip();
        
        amt = Math.min((amt + 0.02 * dir), 1);
        
        // Reset base points
        pointsLists.forEach(points => {
            points.forEach(p => {
                p.x = p.bx;
                p.y = p.by;
            });
        });
        const tCount = Math.max(1, floor(O_sectionwidth / 15));
        const segSize = numPoints / tCount;
        const r = Math.min(O_sectionheight * 0.2, O_sectionwidth * 0.2);
    
        const multipliers = [
            [0, 0], [-1.5, -1.5], [1.5, 1.5], [3, 3], [-3, -3], [4.5, 4.5], [-4.5, -4.5], [6, 6], [-6, -6]
        ];
        for (let i = 0; i < tCount; i++) {
            let st = Math.floor(i * segSize);
            let ed = Math.floor((i + 1) * segSize);
            
            const centers = multipliers.map(m => {
                return {
                    x: lerp(s.x4 + m[0]*r, s.x2 + m[0]*r, i / (tCount - 1)),
                    y: lerp(s.y4 + m[1]*r, s.y2 + m[1]*r, i / (tCount - 1))
                };
            });
            for (let j = st; j <= ed; j++) {
                let t = (j - st) / (ed - st);
                let spiralT = lerp(0.4, 0.8, t);
                let baseAngle = random(spiralT * TWO_PI + Math.sin(spiralT * Math.PI) + i * TWO_PI);
                let radius = r * (0.3 + spiralT * 0.7) + 
                    Math.sin(baseAngle) * Math.cos(spiralT * Math.PI * 4) * 20 * amt + 
                    noise(t * 3 + seed, j * 0.01);
                
                for (let k = 0; k < pointsLists.length; k++) {
                    pointsLists[k][j].x = centers[k].x + radius * Math.cos(baseAngle);
                    pointsLists[k][j].y = centers[k].y + radius * Math.sin(baseAngle);
                }
            }
        }
        pointsLists.forEach(points => {
            points[0] = { x: s.x4, y: s.y4 };
            points[numPoints] = { x: s.x2, y: s.y2 };
        });
        noFill();
        for (let i = 0; i < 8; i++) {
            const c = clrs[i % 4];
            stroke(c[0], c[1] * 0.8, Math.min(c[2] + 10, 100), 200);
            strokeWeight(2);
            beginShape();
            const segment = pointsLists[0].slice(i * (numPoints / 8), (i + 1) * (numPoints / 8) + 1);
            segment.forEach(p => vertex(p.x, p.y));

            for (let k = 1; k < pointsLists.length; k++) {
                const segmentK = pointsLists[k].slice(i * (numPoints / 8), (i + 1) * (numPoints / 8) + 1);
                segmentK.forEach(p => vertex(p.x, p.y));
            }
            
            endShape();
        }
        pop();
        pop();
    }
    window.exquisitescratches = { init, draw };
})();
