//artwork: bwb
(() => {
    let s, localcount, molnar,yoff;

    async function init() {
    //this is exquisitebwb
    s = O_currentsection;
        localcount = 0
        molnar = O_sectionduration*0.2
        yoff=3
    }

    function draw() {
        // Move to the section
        push();
        s.y1+=yoff;s.y3-=yoff;
        translate(s.x, s.y);

        // Create border around section
        stroke(0,0,0)
        fill(0, 0, 0);
        rect(0,0,O_sectionwidth,O_sectionheight)
        strokeWeight(yoff)
        fill(0, 0, 100);
        strokeCap(SQUARE);
        
        if (localcount < molnar) {
            drawlines()
        }
        if (localcount >= molnar && localcount < molnar * 2) {
            drawlineswtriangle()
        }
        if (localcount >= molnar * 2 && localcount < molnar * 3) {
            drawlineswtriangles()
        }
        if (localcount >= molnar * 3 && localcount < molnar * 4) {
            drawlineswtriangles()
        }
        if (localcount >= molnar * 4 && localcount < molnar * 5) {
            var dice = Math.floor(random(4))
            switch (dice) {
                case 0: drawtriangledeep(1, 0, s.x1, s.y1, s.x2, s.y2, s.x3, s.y3,true)
                    break;
                case 1: drawtriangledeep(1, 0, s.x1, s.y1, s.x3, s.y3, s.x4, s.y4,true)
                    break;
                case 2: drawtriangledeep(1, 0, s.x1, s.y1, s.x2, s.y2, s.x4, s.y4,true)
                    break;
                case 3: drawtriangledeep(1, 0, s.x2, s.y2, s.x3, s.y3, s.x4, s.y4,true)
                    break;
            }
        }
        if (localcount >= molnar * 5) {
            var dice = Math.floor(random(4))
            switch (dice) {
                case 0: drawtriangledeep(3, 0, s.x1, s.y1, s.x2, s.y2, s.x3, s.y3,true)
                    break;
                case 1: drawtriangledeep(3, 0, s.x1, s.y1, s.x3, s.y3, s.x4, s.y4,true)
                    break;
                case 2: drawtriangledeep(3, 0, s.x1, s.y1, s.x2, s.y2, s.x4, s.y4,true)
                    break;
                case 3: drawtriangledeep(3, 0, s.x2, s.y2, s.x3, s.y3, s.x4, s.y4,true)
                    break;
            }
        }
        if (O_counter % O_sectionduration == O_sectionduration - 1){
            drawtriangledeep(3, 0, s.x2, s.y2, s.x3, s.y3, s.x4, s.y4,true)
            drawtriangledeep(3, 0, s.x2, s.y2, s.x4, s.y4, s.x1, s.y1,true)

            drawtriangledeep(3, 0, s.x4, s.y4, 0, 0, s.x1, s.y1,false)
            drawtriangledeep(3, 0, s.x4, s.y4, 0, O_sectionheight, s.x3, s.y3,false)
            drawtriangledeep(3, 0, s.x2, s.y2, O_sectionwidth,0, s.x1, s.y1,false)
            drawtriangledeep(3, 0, s.x2, s.y2, O_sectionwidth,O_sectionheight, s.x4, s.y4,false)
        }
        localcount++

        // Pop out of the section
        s.y1-=yoff;s.y3+=yoff;
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
        fill(0,0,100,100)
    }

    function drawtriangle() {
        ikedastroke()
        var dice = Math.floor(random(6))
        switch (dice) {
            case 0: triangle(s.x1, s.y1, s.x2, s.y2, s.x3, s.y3)
                break;
            case 1: triangle(s.x1, s.y1, s.x3, s.y3, s.x4, s.y4)
                break;
            case 2: triangle(s.x1, s.y1, s.x2, s.y2, s.x4, s.y4)
                break;
            case 3: triangle(s.x2, s.y2, s.x3, s.y3, s.x4, s.y4)
                break;
            case 4: ellipse(O_sectionwidth*(random(0.33,0.66)),O_sectionheight*0.5,O_sectionheight*0.98,O_sectionheight*0.98)
                break;
            case 5:
                break;
        }
    }

    function drawtriangledeep(maxdepth, depth, x1, y1, x2, y2, x3, y3, inside) {
        ikedastroke()
    
        if (inside) {
            ikedafill();
        }
        else { noFill() }
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
                    drawtriangledeep(maxdepth, depth, x1, y1, x, y, x3, y3,inside)
                    drawtriangledeep(maxdepth, depth, x, y, x2, y2, x3, y3,inside)
                    break;
                case 1:
                    x = (1 - t) * x2 + (t * x3);
                    y = (1 - t) * y2 + (t * y3);
                    drawtriangledeep(maxdepth, depth, x1, y1, x, y, x3, y3,inside)
                    drawtriangledeep(maxdepth, depth, x1, y1, x2, y2, x, y,inside)
                    break;
                case 2:
                    x = (1 - t) * x3 + (t * x1);
                    y = (1 - t) * y3 + (t * y1);
                    drawtriangledeep(maxdepth, depth, x1, y1, x2, y2, x, y,inside)
                    drawtriangledeep(maxdepth, depth, x, y, x2, y2, x3, y3,inside)
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
        if (random() < 0.8) {
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

    function ikedafill() {
        if (random() < 0.6) {
            fill(0, 0, 100)
        }
        else {
            if (random() < 0.42) {
                fill(0, 100, 100,100)
            }
            else {
                fill(0, 0, 0, 100)
            }
        }
    }
    // Use the name of the current js file (without the extension) as the key in the object window.
    window.exquisitebwb = { init, draw };
})();
