(() => {
    var s, lines = [], seed, dir = 1, amt = 0, numPoints = 900;
    var linesConfig = [];

    async function init() {
        s = O_currentsection;
        seed = random(100);

        var numLines = 8;
        var gap = Math.floor(O_sectionheight / numLines);
        var baseColor = [[0, 0, 0], [0, 100, 100], [240, 100, 100]];

        for (var i = 0; i < numLines; i++) {
            var yPos = i * gap;
            linesConfig.push({x1: 0, y1: yPos, x2: O_sectionwidth, y2: yPos, color: random(baseColor)});
        }
    
        linesConfig.push({x1: s.x3, y1: s.y3, x2: s.x4, y2: s.y4, color: [[0, 0, 0]]});
        linesConfig.push({x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2, color: [[0, 0, 0]]});

        lines = linesConfig.map(function(config) {
            return {
                points: Array.from({length: numPoints + 1}, function(_, i) {
                    return {
                        x: lerp(config.x1, config.x2, i/numPoints),
                        y: lerp(config.y1, config.y2, i/numPoints),
                        bx: lerp(config.x1, config.x2, i/numPoints),
                        by: lerp(config.y1, config.y2, i/numPoints)
                    };
                }),
                color: config.color
            };
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
            var maxR = O_sectionwidth*0.10*amt;
            var r = Math.min(maxR, cx, cy, O_sectionwidth-cx, O_sectionheight-cy);

            for(var j = st; j <= ed; j++) {
                var t = (j-st)/(ed-st);
                var spiralT = lerp(0.1, 0.8, t);
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
                var maxDist = O_sectionwidth/numPoints; 
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
        fill(42, 10, 93).stroke(0).rect(0,0,O_sectionwidth,O_sectionheight);
        amt = Math.min((amt + 0.001*dir), 1);
        lines.forEach(function(lineObj) {
            lineObj.points.forEach(function(p) {
                p.x = p.bx;
                p.y = p.by;
            });
        });
        lines.forEach(function(lineObj, idx) {
            var config = linesConfig[idx];
            var x1 = config.x1;
            var y1 = config.y1;
            var x2 = config.x2;
            var y2 = config.y2;
            processLine(lineObj.points, x1, y1, x2, y2);
            applyConstraints(lineObj.points);
        });
        push();
        drawingContext.beginPath();
        drawingContext.moveTo(s.x1, s.y1);
        drawingContext.lineTo(s.x2, s.y2);
        drawingContext.lineTo(O_sectionwidth, O_sectionheight);
        drawingContext.lineTo(s.x3, s.y3);
        drawingContext.lineTo(s.x4, s.y4);
        drawingContext.closePath();
        drawingContext.clip();
        noFill().strokeWeight(4);
        push();
        
        lines.forEach(function(lineObj) {
            var color = lineObj.color;
            stroke(color[0], color[1], color[2]);
            beginShape();
            lineObj.points.forEach(function(p) {
                curveVertex(p.x, p.y);
            });
            endShape();
        }); 
        pop();
        pop();
    }
    window.exquisitegibberish = {init, draw};
})();
