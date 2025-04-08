window.wordFlowparticles = {};

(() => {
    let s;
    let particles = [];
    let frameCount = 0;
    let isFinalState = false;
    let finalStateWords = [];
    let noiseScale = 0.01;
    let lastFrameTime = 0; 
    
    let words = [
        // Original words
        "code", "art", "flow", "generative", "design", 
        "pattern", "noise", "beauty", "random", "chaos", 
        "order", "rhythm", "harmony", "balance", "steady",
        "St34dy", "One", "Cyflowe", "Precious", "Christopher",
        
        // Programming concepts
        "function", "variable", "loop", "array", "object",
        "create", "render", "animate", "transform", "pixel",
        "vector", "matrix", "color", "gradient", "texture",
        "shader", "geometry", "canvas", "context", "draw",
        "update", "mouse", "keyboard", "event", "computer",
        "algorithm", "data", "structure", "input", "output",
        
        // Generative art terms
        "emergent", "complexity", "evolution", "organic", "recursive",
        "parametric", "stochastic", "fractal", "swarm", "cellular",
        "vector", "mesh", "agent", "field", "visualization",
        
        // Aesthetic terms
        "elegant", "minimal", "complex", "ethereal", "vibrant",
        "dynamic", "geometric", "fluid", "structured", "layered",
        "Melodic", "chaotic"
    ];
    
    const config = {
        numParticles: 30,
        speed: 2.0,
        textSize: 20,
        noiseInfluence: 2.0,
        lifespanMin: 30,        // Minimum frames a particle lives
        lifespanMax: 60,        // Maximum frames a particle lives
        fadeInFrames: 20,        // Frames to fade in: time to full opacity 
        fadeOutFrames: 40,       // Frames to fade out: time to zero opacity
        finalFrameAt: 0.8,       // When to capture final frame (0-1)
        baseHue: 170,
        hueCycleSpeed: 0.5,      // How quickly hue cycles
        showDebugPoints: false,  // Show the anchor points
        strictBoundary: false,    // Use strict boundary enforcement
        showBoundary: false,      // Show section boundary for debugging
        safeMargin: 45,          // Safe margin from edges (increased)
        finalMessageSize: 36,    // Size of the final message
        finalMessageOutlineWidth: 3, // Width of the outline
        forceInsideSectionOnInit: true, // Force all particles to start inside
        edgeBiasStrength: -2.0,   // Strength of the edge bias (higher = stronger push)
        debugMode: false          // Enable debug mode to see frame information
    };
    
    class WordParticle {
        constructor(x, y, word) {
            this.word = word;
            this.size = random(config.textSize * 0.7, config.textSize * 1.3);
            this.wordWidth = this.word.length * (this.size * 0.6);
            // Ensure starting position is within bounds (relative to section)
            this.pos = createVector(
                constrain(x, config.safeMargin + this.wordWidth/2, O_sectionwidth - config.safeMargin - this.wordWidth/2),
                constrain(y, config.safeMargin + this.size/2, O_sectionheight - config.safeMargin - this.size/2)
            );
            this.prevPos = this.pos.copy();
            this.vel = createVector(random(-1, 1), random(-1, 1));
            this.acc = createVector(0, 0);
            this.lifespan = random(config.lifespanMin, config.lifespanMax);
            this.age = 0;
            this.hue = (config.baseHue + random(-30, 30)) % 360;
            this.rotation = random(-0.3, 0.3);
            this.rotationSpeed = random(-0.01, 0.01);
            this.isOutOfBounds = false;
            this.opacity = 0;
        }
        
        update() {
            this.prevPos = this.pos.copy();
            this.age++;
            this.rotation += this.rotationSpeed;
            
            // Apply flow field force
            const angle = this.calculateFlowAngle(this.pos.x, this.pos.y);
            const force = p5.Vector.fromAngle(angle);
            
            // Add a bias toward center when near edges
            this.applyEdgeBias();
            
            force.mult(config.noiseInfluence);
            this.acc.add(force);
            
            // Update position
            this.vel.add(this.acc);
            this.vel.limit(config.speed * (1 + noise(this.age * 0.01) * 0.5));
            this.pos.add(this.vel);
            this.acc.mult(0);
            
            this.handleBoundaries();
            
            this.hue = (this.hue + config.hueCycleSpeed) % 360;
            
            this.opacity = this.calculateOpacity();

        }
        
        // This is implemented in order to prevent words from going out of section bounds
        // Bias force toward center when near edges
        applyEdgeBias() {
            const halfWidth = this.wordWidth / 2;
            const edgeMargin = config.safeMargin * 2; // Distance from edge to start applying inward force
            let bias = createVector(0, 0);
            
            // Calculate distance from edges
            const distFromLeft = this.pos.x - (halfWidth);
            const distFromRight = O_sectionwidth - (this.pos.x + halfWidth);
            const distFromTop = this.pos.y;
            const distFromBottom = O_sectionheight - (this.pos.y);
            
            // Horizontal bias
            if (distFromLeft < edgeMargin) {
                bias.x = map(distFromLeft, 0, edgeMargin, config.edgeBiasStrength, 0);
            } else if (distFromRight < edgeMargin) {
                bias.x = map(distFromRight, 0, edgeMargin, -config.edgeBiasStrength, 0);
            }
            
            // Vertical bias
            if (distFromTop < edgeMargin) {
                bias.y = map(distFromTop, 0, edgeMargin, config.edgeBiasStrength, 0);
            } else if (distFromBottom < edgeMargin) {
                bias.y = map(distFromBottom, 0, edgeMargin, -config.edgeBiasStrength, 0);
            }
            
            this.acc.add(bias);
        }
        
        calculateFlowAngle(x, y) {
            // Create a flow field based on Perlin noise
            const scale = noiseScale;
            const noiseVal = noise(x * scale, y * scale, frameCount * 0.002);
            return noiseVal * TWO_PI * 2;
        }
        
        handleBoundaries() {
            const margin = config.safeMargin / 4;
            const halfWidth = this.wordWidth / 2;
            const halfHeight = this.size / 2;
            let wasFixed = false;
            
            // Check if particle is out of bounds considering word dimensions
            if (this.pos.x - halfWidth < margin) {
                this.pos.x = margin + halfWidth;
                this.vel.x = abs(this.vel.x) * 0.5; // Bounce with damping
                wasFixed = true;
            } else if (this.pos.x + halfWidth > O_sectionwidth - margin) {
                this.pos.x = O_sectionwidth - margin - halfWidth;
                this.vel.x = -abs(this.vel.x) * 0.5; // Bounce with damping
                wasFixed = true;
            }
            
            if (this.pos.y - halfHeight < margin) {
                this.pos.y = margin + halfHeight;
                this.vel.y = abs(this.vel.y) * 0.7; // Bounce with damping
                wasFixed = true;
            } else if (this.pos.y + halfHeight > O_sectionheight - margin) {
                this.pos.y = O_sectionheight - margin - halfHeight;
                this.vel.y = -abs(this.vel.y) * 0.7; // Bounce with damping
                wasFixed = true;
            }
            if (wasFixed) {
                this.vel.rotate(random(-PI/3, PI/3)); // Add some random rotation
                this.vel.mult(random(1.1, 1.3));
                
                if (random() < 0.10) {
                    this.isOutOfBounds = true;
                    this.age = this.lifespan - 15;
                    this.pos.x = random(config.safeMargin + halfWidth, O_sectionwidth - config.safeMargin - halfWidth);
                    this.pos.y = random(config.safeMargin + halfHeight, O_sectionheight - config.safeMargin - halfHeight);
                }
            } else {
                
                this.isOutOfBounds = false;
            }
        }
        
        isAlive() {
            return this.age < this.lifespan && !this.isOutOfBounds;
        }
        
        calculateOpacity() {
            // Fade in at start
            if (this.age < config.fadeInFrames) {
                return map(this.age, 0, config.fadeInFrames, 0, 200);
            }
            // Fade out at end
            else if (this.age > this.lifespan - config.fadeOutFrames) {
                return map(this.age, this.lifespan - config.fadeOutFrames, this.lifespan, 200, 0);
            }
            // Full opacity in middle
            else {
                return 200;
            }
        }
        
        display() {
            // Don't display if out of bounds
            if (this.isOutOfBounds) return;
            
            push();
            textSize(this.size);
            textFont('FreeMono');
            textAlign(CENTER, CENTER);
            
            const speed = this.vel.mag();
            const brightness = map(speed, 0, config.speed * 1.5, 70, 90);
            fill(this.hue, 80, brightness, this.opacity);
            
            translate(this.pos.x, this.pos.y);
            rotate(this.rotation);
            strokeWeight(0.5);
            text(this.word, 0, 0);
            pop();
        }
        
        getFinalStateData() {
            if (this.isOutOfBounds) return null;
            
            const x = constrain(this.pos.x, config.safeMargin, O_sectionwidth - config.safeMargin);
            const y = constrain(this.pos.y, config.safeMargin, O_sectionheight - config.safeMargin);
            
            return {
                x: x,
                y: y,
                word: this.word,
                hue: this.hue,
                size: this.size,
                rotation: this.rotation,
                speed: this.vel.mag()
            };
        }
    }

    function createParticleInSection() {
        const word = words[Math.floor(random(words.length))];

        // Estimate word width
        const tempSize = random(config.textSize * 0.7, config.textSize * 1.3);
        const estimatedWidth = word.length * (tempSize * 0.6);
        
        // Create with more conservative boundary
        const halfWidth = estimatedWidth / 2;
        const halfHeight = tempSize / 2;
        const x = random(config.safeMargin + halfWidth, O_sectionwidth - config.safeMargin - halfWidth);
        const y = random(config.safeMargin + halfHeight, O_sectionheight - config.safeMargin - halfHeight);

        return new WordParticle(x, y, word);

    }
    
    function createParticlesFromAnchors() {
        particles = [];
        
        const startPoints = [];
        
        function addAnchorPoint(x, y) {
            const boundedX = constrain(x, config.safeMargin, O_sectionwidth - config.safeMargin);
            const boundedY = constrain(y, config.safeMargin, O_sectionheight - config.safeMargin);
            startPoints.push({x: boundedX, y: boundedY});
        }
        
        if (config.forceInsideSectionOnInit) {            
            addAnchorPoint(s.x1, s.y1);
            addAnchorPoint(s.x2, s.y2);
            addAnchorPoint(s.x3, s.y3);
            addAnchorPoint(s.x4, s.y4);

            // Add the four corners of the section to ensure better edge coverage
            addAnchorPoint(config.safeMargin, config.safeMargin);
            addAnchorPoint(config.safeMargin, O_sectionheight - config.safeMargin);
            addAnchorPoint(O_sectionwidth - config.safeMargin, config.safeMargin);
            addAnchorPoint(O_sectionwidth - config.safeMargin, O_sectionheight - config.safeMargin);
        }
        
        // Create evenly distributed random points inside the section to ensure good coverage
        const gridCols = 8;
        const gridRows = 8;
        for (let i = 0; i < gridCols; i++) {
            for (let j = 0; j < gridRows; j++) {
                const cellWidth = O_sectionwidth / gridCols;
                const cellHeight = O_sectionheight / gridRows;
                
                // Add some random jitter within the cell
                const x = (i + random(0.2, 0.8)) * cellWidth;
                const y = (j + random(0.2, 0.8)) * cellHeight;
                
                startPoints.push({x, y});
            }
        }
        
        // Create particles at these starting points
        for (let i = 0; i < config.numParticles; i++) {
            const pointIndex = i % startPoints.length;
            const point = startPoints[pointIndex];
            
            const word = words[Math.floor(random(words.length))];
            
            // Create particle with small random offset from starting point
            const particle = new WordParticle(
                point.x + random(-15, 15), 
                point.y + random(-15, 15), 
                word
            );
            
            // Randomize starting age
            particle.age = random(0, particle.lifespan * 0.3);
            
            particles.push(particle);
        }
    }
    
    function captureParticleStates() {
        finalStateWords = [];
        
        for (let particle of particles) {
            const state = particle.getFinalStateData();
            if (state !== null) {
                finalStateWords.push(state);
            }
        }
        
        // Add the special message particle
        finalStateWords.push({
            x: O_sectionwidth/2,
            y: O_sectionheight/2,
            word: "CODE IS ...",
            hue: 120,
            size: config.finalMessageSize,
            rotation: 0,
            speed: 0,
            isMainMessage: true
        });
        
        isFinalState = true;
        
        // console.log("Final state captured with", finalStateWords.length, "words at frame", frameCount);
    }
    
    function displayFinalFrame() {
        // Draw a semi-transparent background
        fill(20, 20, 25, 230);
        rect(0, 0, O_sectionwidth, O_sectionheight);
        
        // Draw each stored word with reduced opacity
        for (let wordState of finalStateWords) {
            push();
            
            // Set text properties
            textSize(wordState.size);
            textFont(wordState.isMainMessage ? 'monospace' : 'sans-serif');
            textAlign(CENTER, CENTER);
            
            // Is this the main message?
            const isMainMessage = wordState.isMainMessage;
            
            if (isMainMessage) {
                push();
                
                // Position at center
                translate(wordState.x, wordState.y);
                
                // Bg glow
                noStroke();
                fill(120, 80, 60, 40);
                for (let i = 0; i < 3; i++) {
                    ellipse(0, 0, 260 + i*20, 100 + i*20);
                }

                // Draw outer glow
                for (let i = 5; i > 0; i--) {
                    let alpha = map(i, 0, 5, 10, 40);
                    strokeWeight(i);
                    stroke(0, 255, 0, alpha);
                    noFill();
                    text(wordState.word, 0, 0);
                }
                
                // Draw outline
                strokeWeight(config.finalMessageOutlineWidth);
                stroke(0, 255, 0, 30);
                fill(0, 0, 0, 0); // Transparent fill
                text(wordState.word, 0, 0);
                
                // Draw the text
                noStroke();
                fill(0, 255, 0, 220); // Vibrant green
                text(wordState.word, 0, 0);
                
                pop();
            } else {
                // Regular word styling with reduced opacity
                noStroke();
                fill(wordState.hue, 80, 80, 80);
                
                translate(wordState.x, wordState.y);
                rotate(wordState.rotation);
                
                text(wordState.word, 0, 0);
            }
            
            pop();
        
        }
        // Draw a bezier curve to connect the words and anchor points in O_currentsection
        push();
        stroke(113, 246, 201, 60); // rgba(113, 246, 201, 230)
        strokeWeight(2);
        noFill();
        beginShape();
        for (let wordState of finalStateWords) {
            if (!wordState.isMainMessage) {
                vertex(wordState.x, wordState.y);
            }
        }
        endShape();
        
        stroke(39, 245, 227, 100);  //rgba(39, 245, 227, 200)
        strokeWeight(1.5);
        noFill();
        // Draw bezier curves between the anchor points
        bezier(
            s.x1, s.y1,
            s.x2, s.y2,
            s.x3, s.y3,
            s.x4, s.y4
        );
        bezier(
            s.x2, s.y2,
            s.x3, s.y3,
            s.x4, s.y4,
            s.x1, s.y1
        );
        bezier(
            s.x3, s.y3,
            s.x4, s.y4,
            s.x1, s.y1,
            s.x2, s.y2
        );
        bezier(
            s.x4, s.y4,
            s.x1, s.y1,
            s.x2, s.y2,
            s.x3, s.y3
        );
        pop();
    }
    
    // Initialize the animation
    async function init() {
        console.log("Initializing word flow field...");
        try {
            s = O_currentsection;
            frameCount = 0;
            isFinalState = false;
            finalStateWords = [];
            lastFrameTime = Date.now();
            
            // Initialize particles
            createParticlesFromAnchors();
            
            noiseScale = random(0.005, 0.015);
            
            console.log("Word flow field initialized with", particles.length, "particles");
            return Promise.resolve();
        } catch (err) {
            console.error("Error in wordFlowparticles init:", err);
            return Promise.resolve(); // Still resolve to prevent blocking other modules
        }
    }
    
    function draw() {
        try {
            frameCount++;
            
            // Throttle frame rate if needed
            const now = Date.now();
            const elapsed = now - lastFrameTime;
            lastFrameTime = now;
            
            // Get current section progress (0-1)
            const sectionProgress = (O_counter % O_sectionduration) / O_sectionduration;
            
            push();
            translate(s.x, s.y);
            
            // If we've reached the point to capture final frame and haven't done so yet
            if (sectionProgress >= config.finalFrameAt && !isFinalState) {
                captureParticleStates();
            }
            
            if (isFinalState) {
                displayFinalFrame();
            } else {
                
                // Semi-transparent background for trailing effect
                fill(20, 20, 25, 30);
                rect(0, 0, O_sectionwidth, O_sectionheight);
                
                // Update and display particles
                let activeParticles = 0;
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.update();
                    p.display();
                    
                    if (!p.isOutOfBounds) activeParticles++;
                    
                    // Remove dead particles and replace them
                    if (!p.isAlive()) {
                        // Create a completely new particle within the section
                        particles[i] = createParticleInSection();
                    }
                }
            }
            
            pop();
        } catch (err) {
            console.error("Error in wordFlowparticles draw:", err);
        }
    }
    
    // Register functions with the window.wordFlowparticles object
    window.wordFlowparticles = { init, draw };
})();