(() => {
    let s, _height, _width, scale = 8, current_iteration = 0;

    async function init() {
        colorMode(HSB);
        s = O_currentsection;
        _height = O_sectionheight;
        _width = O_sectionwidth;
    }

    function draw() {
        if (current_iteration >= O_sectionduration)
            noLoop();
        push();
        translate(s.x, s.y);

        strokeWeight(4);
        noStroke();
        draw_colored_triangles();

        let matrix = generate_noisy_matrix();
        console.log(matrix);
        visualize_matrix(matrix);
        
        current_iteration++;
        pop();
    }

    function generate_noisy_matrix() {
        let matrix = [];
        for (let i = 0; i < _width/1.5; i++) {
            let row = [];
            for (let j = 0; j < _height/1.5; j++) {
                row.push(Math.floor(random(0, 10)));
            }
            matrix.push(row);
        }
        return matrix;
    }

    function visualize_matrix(matrix) {
        textAlign(CENTER, CENTER);

        for (let i = 0; i < matrix.length; i++) {
            fill(0, 0, 0);
            for (let j = 0; j < matrix[i].length; j++) {
                let x = 5 + j * scale;  
                let y = 5 + i * scale;
                textSize(Math.floor(random(5, 10)));

                if (x >= 0 && x <= _width && y >= 0 && y <= _height) {
                    text(matrix[i][j], x, y);
                }
            }
        }
    }

    function draw_colored_triangles() {
        fill(100, 100, 100); 
        triangle(0, 0, s.x1, s.y1, s.x4, s.y4);

        fill(200, 100, 100); 
        triangle(s.x1, s.y1, _width, 0, s.x2, s.y2);

        fill(50, 100, 100); 
        triangle(s.x2, s.y2, _width, _height, s.x3, s.y3);

        fill(150, 100, 100);
        triangle(s.x3, s.y3, 0, _height, s.x4, s.y4);
    }

    window.exquisite_noisy_matrix = { init, draw };
})();
