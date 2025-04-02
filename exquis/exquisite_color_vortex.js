(() => {
    let s, _height, _width;

    const colors = [
        [267, 52, 100],    
        [54, 72, 97],      
        [333, 76, 100],    
        [251, 86, 100]     
    ];

    async function init() {
        colorMode(HSB);
        s = O_currentsection;
        _height = O_sectionheight;
        _width = O_sectionwidth;
    }

    function draw() {
        push();
        translate(s.x, s.y);
        fill(0, 0, 0);
        fill(0, 0, 0);

        strokeWeight(4);
        triangle(0, 0, s.x1, s.y1, s.x4, s.y4);
        triangle(s.x1, s.y1, _width, 0, s.x2, s.y2);
        triangle(s.x2, s.y2, _width, _height, s.x3, s.y3);
        triangle(s.x3, s.y3, 0, _height, s.x4, s.y4);

        draw_lines();

        pop();
    }

    function draw_lines() {
        let current_i = 0;

        while (current_i < O_sectionduration) {
            line(
                _width / 2,
                _height / 2, 
                random(_width), 
                random(_height)
            );
    
            let randomColor = colors[Math.floor(random(colors.length))];        
            stroke(randomColor[0], randomColor[1], randomColor[2]);
            strokeWeight(Math.floor(random(2, 7)));
    
            triangle(0, 0, s.x1, s.y1, s.x4, s.y4);
            triangle(s.x1, s.y1, _width, 0, s.x2, s.y2);
            triangle(s.x2, s.y2, _width, _height, s.x3, s.y3);
            triangle(s.x3, s.y3, 0, _height, s.x4, s.y4);

            current_i++;
        }
    }
  
    window.exquisite_color_vortex = { init, draw };
})();