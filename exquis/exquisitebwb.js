(() => {
    let s, localcount, molnar;

    async function init() {
        s = O_currentsection;
        localcount = 0
        molnar = 420
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
            drawline()
        }
        if (localcount >= molnar * 2 && localcount < molnar * 3) {
            drawlines()
        }
        if (localcount >= molnar * 3 && localcount < molnar * 4) {
            drawlineswtriangle()
        }
        if (localcount >= molnar * 4) {
            drawlineswtriangles()
        }
        localcount++

        // Pop out of the section
        pop();
    }

    function drawlines(){
        var dice = Math.floor(random(1,6))
        for(let i=0;i<dice;i++){
            drawline()
        }
    }
    function drawtriangles(){
        var dice = Math.floor(random(1,6))
        for(let i=0;i<dice;i++){
            drawtriangle()
        }
    }

    function drawlineswtriangle(){
        drawlines()
        drawtriangle()
    }

    function drawlineswtriangles(){
        drawlines()
        drawtriangles()
    }

    function drawtriangle(){
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

    function drawtriangledeep(depth,x1,y1,x2,y2,x3,y3,x4,y4){
        noFill()
        var dice = Math.floor(random(4))
        switch (dice) {
            case 0: triangle(x1, y1, x2, y2, x3, y3)
                break;
            case 1: triangle(x1, y1, x3, y3, x4, y4)
                break;
            case 2: triangle(x1, y1, x2,y2, x4, y4)
                break;
            case 3: triangle(x2, y2, x3, y3, x4, y4)
                break;
        }
    }

    function drawline() {
        if(random()<0.1){
            stroke(0,0,100)
        }
        if(random()>0.01){
            if(random()<0.5){
            stroke(0,100,100)
        }
        else{
            stroke(180,100,100)
        }
        }
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

    // Use the name of the current js file (without the extension) as the key in the object window.
    window.exquisitebwb = { init, draw };
})();
