(() => {
    var s, lines = [], seed, dir = 1, amt = 0, numPoints = 900;
    var linesConfig = [
        {x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2'},
        {x1: 'x3', y1: 'y3', x2: 'x4', y2: 'y4'},
        {x1: 'x2', y1: 'y2', x2: 'x4', y2: 'y4'}
    ];
    async function init() {
        s = O_currentsection;
        seed = random(100);
        lines = linesConfig.map(function(config) {
            return Array.from({length: numPoints + 1}, function(_, i) {
                return {
                    x: lerp(s[config.x1], s[config.x2], i/numPoints),
                    y: lerp(s[config.y1], s[config.y2], i/numPoints),
                    bx: lerp(s[config.x1], s[config.x2], i/numPoints),
                    by: lerp(s[config.y1], s[config.y2], i/numPoints)
                };
            });
        });
    }
    function processLine(points, x1, y1, x2, y2) {
        var tCount = Math.floor(O_sectionwidth/2);
        var segSize = numPoints/tCount; 
        for(var i = 0; i < tCount; i++) {
            var st = Math.floor(i*segSize);
            var ed = Math.floor((i+1)*segSize);
            var cx = lerp(x1, x2, i/(tCount-1));
            var cy = lerp(y1, y2, i/(tCount-1));
            var maxR = O_sectionwidth*0.25*amt;
            var r = Math.min(maxR, cx, cy, O_sectionwidth-cx, cy, O_sectionheight-cy);

            for(var j = st; j <= ed; j++) {
                var t = (j-st)/(ed-st);
                var spiralT = lerp(0.1, 0.8, t);
                // by changing this line we can get different patterns
                var baseAngle = random(spiralT*TWO_PI + Math.sin(spiralT*Math.PI) + i*TWO_PI);
                var radius = r*(0.3+spiralT*0.7) + 
                    Math.sin(baseAngle)*Math.cos(spiralT*Math.PI*4)*20*amt + 
                    noise(t*3+seed,j*0.01);    
                points[j].x = cx + radius*Math.cos(baseAngle);
                points[j].y = cy + radius*Math.sin(baseAngle);
            }
        }
    }
    function applyConstraints(points) {
        for(var iter = 0; iter < 6; iter++) {
            points.slice(1,-1).forEach(function(p, i) {
                var prev = points[i];
                var dx = p.x - prev.x;
                var dy = p.y - prev.y;
                var dist = Math.hypot(dx, dy);
                var maxDist = O_sectionwidth/numPoints; // this can also be changed to get different patterns
                if(dist > maxDist) {
                    var s = maxDist/dist;
                    prev.x += dx*(1-s)*0.5;
                    prev.y += dy*(1-s)*0.5;
                    p.x -= dx*(1-s)*0.5;
                    p.y -= dy*(1-s)*0.5;
                }
            });
        }
    }
    function draw() {
        push();
        translate(s.x, s.y);
        background(0,0,0,0);
        fill(0).rect(0,0,O_sectionwidth,O_sectionheight);
        amt = Math.min((amt + 0.002*dir), 1);
        // Reset all lines to base positions
        lines.forEach(function(line) {
            line.forEach(function(p) {
                p.x = p.bx;
                p.y = p.by;
            });
        });
        lines.forEach(function(line, idx) {
            var config = linesConfig[idx];
            var x1 = s[config.x1];
            var y1 = s[config.y1];
            var x2 = s[config.x2];
            var y2 = s[config.y2];
            processLine(line, x1, y1, x2, y2);
            applyConstraints(line);
        });
        push();
        drawingContext.beginPath();
        drawingContext.rect(0, 0, O_sectionwidth, O_sectionheight);
        drawingContext.clip();
        noFill().stroke(240,20,95).strokeWeight(1);
        
        lines.forEach(function(line) {
            beginShape();
            line.forEach(function(p) {
                curveVertex(p.x, p.y);
            });
            endShape();
        }); 
        pop();
        pop();
    }
    window.exquisitegibberish = {init, draw};
})();
