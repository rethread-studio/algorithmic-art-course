(() => {
  let s, walkers, flowers;

class RandomWalker {
    constructor(x, y, target, steps) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.steps = steps / 2;
        this.currentStep = 0;
        this.path = [];
        this.noiseOffsetX = random(1000);
        this.noiseOffsetY = random(1000);
        this.stepSize = 5;
        this.charSet = "10△▢✶✿";
        this.growthMap = new Map();
        this.stemColor = random(40, 70);
        let minDim = min(O_sectionwidth, O_sectionheight);
        this.textSize = 0.06 * minDim;
    }

    step() {
        if (this.currentStep >= this.steps) return;

        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let noiseFactorX = map(noise(this.noiseOffsetX), 0, 1, -5, 5);
        let noiseFactorY = map(noise(this.noiseOffsetY), 0, 1, -5, 5);

        this.x += (dx / distance) * this.stepSize + noiseFactorX;
        this.y += (dy / distance) * this.stepSize + noiseFactorY;

        this.x = constrain(this.x, 0.0, O_sectionwidth);
        this.y = constrain(this.y, 0.0 + (4 * (O_sectionwidth / O_sectionheight)), O_sectionheight);

        this.path.push({ x: this.x, y: this.y });

        if (
            random() < 0.01 &&
            this.x > 20 && this.x < O_sectionwidth - 20 &&
            this.y > 20 && this.y < O_sectionheight - 20
        ) {
            flowers.push(new Flower(this.x, this.y));
        }

        this.noiseOffsetX += 0.1;
        this.noiseOffsetY += 0.1;

        this.currentStep++;
    }

    display() {
        noStroke();
        fill(70, 100, this.stemColor);

        for (let i = 0; i < this.path.length; i++) {
            let p = this.path[i];
            let c = this.charSet[Math.floor(noise(i * 0.1, frameCount * 0.01) * this.charSet.length)];

            if (!this.growthMap.has(i)) this.growthMap.set(i, 0);
            let growth = this.growthMap.get(i);
            growth += 0.03;
            if (growth > 1.5) growth = 0.5;
            this.growthMap.set(i, growth);

            let alpha = map(growth, 0, 1.5, 0, 180);
            fill(70, 100, this.stemColor, alpha);

            textSize(growth * this.textSize);
            text(c, p.x, p.y);

            // Draw thorns/spikes
// Draw thorns/spikes
            if (i % 8 === 0 && i > 0 && i < this.path.length - 1) {
                let p1 = this.path[i];
                let p2 = this.path[i + 1];

                let angle = atan2(p2.y - p1.y, p2.x - p1.x);

                push();
                translate(p1.x, p1.y);
                rotate(angle);
                fill(0); // Black spike
                noStroke();
                triangle(0, 0, -5, -12, 5, -12); // Bigger and taller
                pop();
            }

        }
    }
}

class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.growthRate = 0.4;
        this.maxflowerSize = 50;
        this.petals = 8;
        this.angleOffset = random(TWO_PI);
        this.colorHue = random(330, 10); // Rose-like colors (reds and magentas)
    }

    grow() {
        this.size += this.growthRate;
        this.angleOffset += 0.01;
        if (this.size > this.maxflowerSize) {
            this.size = this.maxflowerSize;
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        noStroke();
        colorMode(HSB, 360, 100, 100, 255);

        for (let i = 0; i < this.petals; i++) {
            let angle = this.angleOffset + (TWO_PI / this.petals) * i;

            let x1 = cos(angle) * this.size * 0.1;
            let y1 = sin(angle) * this.size * 0.1;
            let x2 = cos(angle) * this.size;
            let y2 = sin(angle) * this.size;

            fill((this.colorHue + i * 10) % 360, 80, 100, 180);
            beginShape();
            vertex(0, 0);
            bezierVertex(x1, y1, x2, y2, 0, 0);
            endShape(CLOSE);
        }

        // Center core
        fill(0, 80, 100);
        ellipse(0, 0, this.size * 0.2, this.size * 0.2);

        pop();
    }
}

async function init() {
    s = O_currentsection;

    let centerX = O_sectionwidth / 2;
    let centerY = O_sectionheight / 2;

    let totalSteps = O_sectionduration;

    walkers = [
        new RandomWalker(centerX, centerY, { x: s.x1, y: s.y1 }, totalSteps),
        new RandomWalker(centerX, centerY, { x: s.x2, y: s.y2 }, totalSteps),
        new RandomWalker(centerX, centerY, { x: s.x3, y: s.y3 }, totalSteps),
        new RandomWalker(centerX, centerY, { x: s.x4, y: s.y4 }, totalSteps)
    ];

    flowers = [];
}

function draw() {
    push();
    translate(s.x, s.y);

    fill(0, 40); // Slight fade
    rect(0, 0, O_sectionwidth, O_sectionheight);

    for (let walker of walkers) {
        walker.step();
        walker.display();
    }

    for (let flower of flowers) {
        flower.grow();
        flower.display();
    }

    pop();
}

window.bitRoses = { init, draw };
})();
