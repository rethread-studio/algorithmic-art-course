(() => {
    let s, points = [], seed, dir = 1, amt = 0, numPoints = 900;
    const clrs = [[330,40,70],[355,40,85],[24,50,95],[43,40,95]]

    async function init() {
        s = O_currentsection;
        seed = random(100);
        points = Array.from({length: 901}, function(_, i) {
            return {
                x: lerp(s.x4, s.x2, i/numPoints),
                y: lerp(s.y4, s.y2, i/numPoints),
                bx: lerp(s.x4, s.x2, i/numPoints),
                by: lerp(s.y4, s.y2, i/numPoints)
            };
        });
    }

    function draw() {
        push();
        translate(s.x, s.y);
        background(0,0,0,0);
        fill(0).rect(0,0,O_sectionwidth,O_sectionheight);
        
        amt = Math.min((amt + 0.02*dir), 1); 
        points.forEach(function(p) {
            p.x = p.bx;
            p.y = p.by;
        });
        const tCount = Math.max(1, floor(O_sectionwidth/15));
        const segSize = numPoints/tCount;
        for(let i=0; i<tCount; i++) {
            var st = Math.floor(i*segSize);
            var ed = Math.floor((i+1)*segSize);
            var cx = lerp(s.x4, s.x2, i/(tCount-1));
            var cy = lerp(s.y4, s.y2, i/(tCount-1));
            var r = Math.min(O_sectionheight * 0.095, O_sectionwidth * 0.095);
            
            for(let j=st; j<=ed; j++) {
                var t = (j-st)/(ed-st);
                var spiralT = lerp(0.4, 0.8, t);
                // by changing this line we can get different patterns
                var baseAngle = random(spiralT*TWO_PI + Math.sin(spiralT*Math.PI) + i*TWO_PI);
                var radius = r*(0.3+spiralT*0.7) + 
                    Math.sin(baseAngle)*Math.cos(spiralT*Math.PI*4)*20*amt + 
                    noise(t*3+seed,j*0.01);    
                points[j].x = cx + radius*Math.cos(baseAngle);
                points[j].y = cy + radius*Math.sin(baseAngle);
            }
        }
        points[0] = {x: s.x4, y: s.y4};
        points[numPoints] = {x: s.x2, y: s.y2};      
        push();
        drawingContext.beginPath();
        drawingContext.rect(0, 0, O_sectionwidth, O_sectionheight);
        drawingContext.clip();
        noFill();
        for(let i=0; i<8; i++) {
            const c = clrs[i%4];
            stroke(c[0], c[1]*0.8, min(c[2]+10,100), 200);
            strokeWeight(2);
            beginShape();
            if (i == 7 | i == 4) {
                vertex(s.x1, s.y1);
            }
            if (i== 4) {
                vertex(s.x3, s.y3);
            }
            // Rest of the points - ratio defines the length (112.5 works ~ 900/8)
            points.slice(i*(numPoints/8), (i+1)*(numPoints/8)+1).forEach(function(p) {
                vertex(p.x, p.y);
            });    
            endShape();
        }     
        pop();
        pop();
    }
    window.exquisitescratches = {init, draw};
})();
