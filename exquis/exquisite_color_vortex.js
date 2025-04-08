(() => {
    let s, _height, _width;

    const colors = [
        [251, 86, 100],
        [267, 52, 100],
        [54, 72, 97],      
        [333, 76, 100],
    ];

    async function init() {
        s = O_currentsection;
        _height = O_sectionheight;
        _width = O_sectionwidth;
    }

    function draw() {
        push();
        translate(s.x, s.y);
        fill(0, 0, 0);
        rect(0, 0, _width, _height);
        strokeWeight(4); 

        draw_lines();

        pop();
    }

    function drawSectionTriangles() {  
        triangle(0, 0, s.x1, s.y1, s.x4, s.y4);
        triangle(s.x1, s.y1, _width, 0, s.x2, s.y2);
        triangle(s.x2, s.y2, _width, _height, s.x3, s.y3);
        triangle(s.x3, s.y3, 0, _height, s.x4, s.y4);
    }

    function draw_lines() {
        for (let i = 0; i < O_sectionduration; i++) {
            const color = colors[i % colors.length];
            stroke(...color);

            const randX = random(_width);
            const randY = random(_height);
            line(_width / 2, _height / 2, randX, randY);

            if (i == O_sectionduration - 1)
                drawSectionTriangles()
        }
    }

    window.exquisite_color_vortex = { init, draw };
})();
