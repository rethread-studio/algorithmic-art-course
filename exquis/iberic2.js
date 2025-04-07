(() => {
    let s;

    async function init() {
        //this is exquisitered

        s = O_currentsection;


    }

    function draw() {
        // background(0);

        // Move to the section
        push();
        translate(s.x, s.y);

        // Create border around section
        fill(0, 0, 0);
        // stroke(red);
        strokeWeight(3);  
        noStroke();
        rect(0, 0, O_sectionwidth, O_sectionheight);
        // clip(0, 0, O_sectionwidth, O_sectionheight);

        // fill(0, 0, 100);

        // Coordonnées estimées à partir de l’image
        let A = createVector(s.x1, s.y1);
        let B = createVector(s.x2, s.y2);
        let C = createVector(s.x3, s.x3);
        let D = createVector(s.x4, s.x4);

        // Dessin des points
        // fill(0, 0, 100);
        // ellipse(s.x1, s.y1, 8);
        // ellipse(s.x2, s.y2, 8);
        // ellipse(s.x3, s.y3, 8);
        // ellipse(s.x4, s.y4, 8);
        // stroke(255);
        


        let nbLignes = random(200);
        let rayonMax = 150;

        // angleMode(RADIANS);
        // stroke(255,0,255);
        stroke(random(255), random(100), random(100));
        line(O_sectionwidth / 2, O_sectionheight / 2, s.x1, s.y1);
        line(O_sectionwidth / 2, O_sectionheight / 2, s.x2, s.y2);
        line(O_sectionwidth / 2, O_sectionheight / 2, s.x3, s.y3);
        line(O_sectionwidth / 2, O_sectionheight / 2, s.x4, s.y4);

        noFill();

        translate(O_sectionwidth / 2, O_sectionheight / 2);

        let t = millis() * 0.002; // temps pour animer

        for (let i = 0; i < nbLignes; i++) {
            let angle = TWO_PI * i / nbLignes;

            // variation de la longueur avec une sinusoïde + un petit décalage pour chaque ligne
            let offset = sin(t + i * 100);
            let rayon = map(random(offset), -1, 1, 50, rayonMax);

            let a = cos(angle) * rayon;
            let b = sin(angle) * rayon;

            // line(0, 0, a, b);

            if (
                a >= -O_sectionwidth / 2 && a <= O_sectionwidth / 2 &&
                b >= -O_sectionheight / 2 && b <= O_sectionheight / 2
            ) {
                line(0, 0, a, b);
            }

        }

        if (O_counter % O_sectionduration == O_sectionduration - 1) {
            // line(s.x1, s.y1, s.x, s.y);
            // line(s.x2, s.y2, 0, 0);
            // line(0, 0, s.x2, s.y2);
            // line(0, 0, s.x4, s.y4);
        }

        // Pop out of the section
        pop();
    }

    // Use the name of the current js file (without the extension) as the key in the object window.
    window.iberic2 = { init, draw };
})();
