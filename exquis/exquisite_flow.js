(() => {
    const num = 1000;
    const particles = [];
    let s, _height, _width, focalPoints = [];
    let currentIteration = 0;

    const colors = [
        [267, 52, 100],    
        [54, 72, 97],      
        [333, 76, 100],    
        [251, 86, 100]     
    ];

    async function init() {
        s = O_currentsection;
        _height = O_sectionheight;
        _width = O_sectionwidth;

        push()
        fill(0, 0, 0);
        stroke(0, 0, 0);
        translate(s.x,s.y)
        for (let i = 0; i < num; i++) {
            particles.push(createVector(random(_width), random(_height)));
        }

        focalPoints = [
            createVector(s.x1, s.y1),
            createVector(s.x2, s.y2),
            createVector(s.x3, s.y3),
            createVector(s.x4, s.y4)
        ];
        pop()
    }

    function draw() {
        push()
        translate(s.x,s.y)
        fill(0, 0, 0, 0.01);
        noStroke();
        rect(0, 0, _width, _height);
    
        for (let c = 0; c < colors.length; c++) {
            stroke(colors[c]);
            for (let i = c; i < particles.length; i += colors.length) {
                let p = particles[i];
                point(p.x, p.y);
    
                let closest = focalPoints[0];
                let minDistSq = p5.Vector.sub(p, closest).magSq();
    
                for (let j = 1; j < focalPoints.length; j++) {
                    let dSq = p5.Vector.sub(p, focalPoints[j]).magSq();
                    if (dSq < minDistSq) {
                        minDistSq = dSq;
                        closest = focalPoints[j];
                    }
                }
    
                let dir = p5.Vector.sub(closest, p);
                dir.setMag(0.5);
                p.add(dir);
    
                if (!onScreen(p)) {
                    p.x = random(_width);
                    p.y = random(_height);
                }
            }
        }
        pop()
    }

    function onScreen(v) {
        return v.x >= 0 && v.x <= _width && v.y >= 0 && v.y <= _height;
    }

    window.exquisite_flow = { init, draw };
})();