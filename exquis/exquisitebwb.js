(() => {
    let s, localcount, molnar;

    async function init() {
        s = O_currentsection;
        localcount = 0
        molnar = 300
        console.log(s.x, s.y)
    }

    function draw() {
        // Move to the section
        push();
        translate(s.x, s.y);

        // Create border around section
        fill(0, 0, 0);
        rect(0, 0, O_sectionwidth, O_sectionheight);
        fill(0, 0, 100);
        noStroke();

        if (localcount < molnar) {
            drawline()
        }
        if (localcount >= molnar && localcount < molnar * 2) {
            drawlines()
        }
        if (localcount >= molnar * 2 && localcount < molnar * 3) {
            drawlineswtriangle()
        }
        if (localcount >= molnar * 3 && localcount < molnar * 4) {
            drawlineswtriangles()
        }
        if (localcount >= molnar * 4 && localcount < molnar * 5) {
            var dice = Math.floor(random(4))
            switch (dice) {
                case 0: drawtriangledeep(1, 0, s.x1, s.y1, s.x2, s.y2, s.x3, s.y3)
                    break;
                case 1: drawtriangledeep(1, 0, s.x1, s.y1, s.x3, s.y3, s.x4, s.y4)
                    break;
                case 2: drawtriangledeep(1, 0, s.x1, s.y1, s.x2, s.y2, s.x4, s.y4)
                    break;
                case 3: drawtriangledeep(1, 0, s.x2, s.y2, s.x3, s.y3, s.x4, s.y4)
                    break;
            }
        }
        if (localcount >= molnar * 5) {
            var dice = Math.floor(random(4))
            switch (dice) {
                case 0: drawtriangledeep(3, 0, s.x1, s.y1, s.x2, s.y2, s.x3, s.y3)
                    break;
                case 1: drawtriangledeep(3, 0, s.x1, s.y1, s.x3, s.y3, s.x4, s.y4)
                    break;
                case 2: drawtriangledeep(3, 0, s.x1, s.y1, s.x2, s.y2, s.x4, s.y4)
                    break;
                case 3: drawtriangledeep(3, 0, s.x2, s.y2, s.x3, s.y3, s.x4, s.y4)
                    break;
            }
        }
        localcount++

        // Pop out of the section
        pop();
    }

    function drawlines() {
        var dice = Math.floor(random(1, 6))
        for (let i = 0; i < dice; i++) {
            drawline()
        }
    }
    function drawtriangles() {
        var dice = Math.floor(random(1, 6))
        for (let i = 0; i < dice; i++) {
            drawtriangle()
        }
    }

    function drawlineswtriangle() {
        drawlines()
        drawtriangle()
    }

    function drawlineswtriangles() {
        drawlines()
        drawtriangles()
    }

    function drawtriangle() {
        ikedastroke()
        noFill()
        var dice = Math.floor(random(4))
        switch (dice) {
            case 0: triangle(s.x1, s.y1, s.x2, s.y2, s.x3, s.y3)
                break;
            case 1: triangle(s.x1, s.y1, s.x3, s.y3, s.x4, s.y4)
                break;
            case 2: triangle(s.x1, s.y1, s.x2, s.y2, s.x4, s.y4)
                break;
            case 3: triangle(s.x2, s.y2, s.x3, s.y3, s.x4, s.y4)
                break;
        }
    }

    function drawtriangledeep(maxdepth, depth, x1, y1, x2, y2, x3, y3) {
        ikedastroke()
        noFill()
        triangle(x1, y1, x2, y2, x3, y3)
        if (depth < maxdepth) {
            depth++
            var dice = Math.floor(random(3))
            var x, y, t
            t = random()
            switch (dice) {
                case 0:
                    x = (1 - t) * x1 + (t * x2);
                    y = (1 - t) * y1 + (t * y2);
                    drawtriangledeep(maxdepth, depth, x1, y1, x, y, x3, y3)
                    drawtriangledeep(maxdepth, depth, x, y, x2, y2, x3, y3)
                    break;
                case 1:
                    x = (1 - t) * x2 + (t * x3);
                    y = (1 - t) * y2 + (t * y3);
                    drawtriangledeep(maxdepth, depth, x1, y1, x, y, x3, y3)
                    drawtriangledeep(maxdepth, depth, x1, y1, x2, y2, x, y)
                    break;
                case 2:
                    x = (1 - t) * x3 + (t * x1);
                    y = (1 - t) * y3 + (t * y1);
                    drawtriangledeep(maxdepth, depth, x1, y1, x2, y2, x, y)
                    drawtriangledeep(maxdepth, depth, x, y, x2, y2, x3, y3)
                    break;
            }
        }
    }

    function drawline() {
        ikedastroke()
        var dice = Math.floor(random(6))
        switch (dice) {
            case 0: line(s.x1, s.y1, s.x2, s.y2)
                break;
            case 1: line(s.x1, s.y1, s.x3, s.y3)
                break;
            case 2: line(s.x1, s.y1, s.x4, s.y4)
                break;
            case 3: line(s.x2, s.y2, s.x3, s.y3)
                break;
            case 4: line(s.x2, s.y2, s.x4, s.y4)
                break;
            case 5: line(s.x3, s.y3, s.x4, s.y4)
                break;
        }
    }

    function ikedastroke() {
        if (random() < 0.9) {
            stroke(0, 0, 100)
        }
        else {
            if (random() < 42) {
                stroke(0, 100, 100)
            }
            else {
                stroke(180, 100, 100)
            }
        }
    }

    // Use the name of the current js file (without the extension) as the key in the object window.
    window.exquisitebwb = { init, draw };
})();
