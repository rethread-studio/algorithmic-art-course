//artwork: exquisiteA5

// Simule un timelaps d'etoile en faisant bouger uniquement les etoiles dans le polygone represente par les points du cadavre exquis, dans le cas ou le polygone 
// n'est pas suffisament visible je pourrais lui ajouter les bordures
(() => {
    let stars;
    let numStars = 2000;
    let pivot;
    let border = [];
    let angleStep = 0.001;
    let s;

    class Star {
        constructor(x, y, r) {
            this.pos = createVector(x, y);
            this.r = r;
            this.trail = []; // stocke les positions précédentes
            this.maxTrailLength = 20;
        }

        update() {
            // Calculer la position relative par rapport au pivot
            let relative = p5.Vector.sub(this.pos, pivot);
            // Appliquer une rotation d'un petit angle
            let rotated = createVector(
              relative.x * cos(angleStep) - relative.y * sin(angleStep),
              relative.x * sin(angleStep) + relative.y * cos(angleStep)
            );
            let nextPos = p5.Vector.add(rotated, pivot);
            
            // Si la prochaine position est dans la bordure, on l'accepte
            if (pointInPolygon(nextPos, border)) {
                this.trail.push(this.pos.copy());
              // Limiter le trail pour éviter l'accumulation infinie
                if (this.trail.length > this.maxTrailLength) {
                    this.trail.shift(); // supprime le plus ancien point
                }
                this.pos = nextPos.copy();
            }
        }

        show() {
          // Dessiner la trace si elle existe
            // stroke(0, 0, 100, 150);
            // noFill();
            // beginShape();
            // for (let p of this.trail) {
            //     vertex(p.x, p.y);
            // }
            // endShape();

          // Dessiner l'étoile
            fill(0,  0, 100);
            noStroke();
            ellipse(this.pos.x, this.pos.y, this.r);
        }
    }

    function pointInPolygon(pt, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            let xi = poly[i].x, yi = poly[i].y;
            let xj = poly[j].x, yj = poly[j].y;
            let intersect = ((yi > pt.y) != (yj > pt.y)) &&
            (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi + 0.00001) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    

    async function init() {
        s = O_currentsection
        stars = []
        border = [
            createVector(s.x1 , s.y1),
            createVector(s.x2 , s.y2),
            createVector(s.x3 , s.y3),
            createVector(s.x4 , s.y4)
        ];

        for (let i = 0; i < numStars; i++) {
            stars.push(new Star(random(O_sectionwidth), random(O_sectionheight), random(1,3)));
        }

        let insideStars = stars.filter(s => pointInPolygon(s.pos, border));
        if (insideStars.length > 0) {
            pivot = random(insideStars).pos.copy();
        } else {
        pivot = createVector(O_sectionwidth / 2, O_sectionheight / 2);
        }
    }

    function draw() {
      // Move to the section
        push();
        
        translate(s.x, s.y);
        fill(0,0,0, 0.01)
        rect(0,0,O_sectionwidth, O_sectionheight)

        // noFill();
        // stroke(0,0, 100, 15);
        strokeWeight(2);
        // beginShape();
        // for (let pt of border) {
        //     vertex(pt.x, pt.y);
        // }
        // vertex(s.x1, s.y1)
        // endShape()

        for (let s of stars) {
            s.update();
            s.show();
        }

        

      // Pop out of the section
        pop();
    }

    // Use the name of the current js file (without the extension) as the key in the object window.
    window.exquisiteA5= { init, draw };
    })();