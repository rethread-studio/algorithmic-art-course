
let fireworks = [];//A list of all fireworks.
let gravity;
let trails = [];//A list of trails left behind by fireworks
//let explosionSound;//Stores firework explosion sound
//let soundPlayed = false;

//load external assets 
function preload() {
  // explosionSound = loadSound('firework.mp3', () => {
  //   soundPlayed = true;
  // }); 
}

//initialize the canvas and varaibles,Runs once at the start of the program
function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 0.2 ); //creates a gravity force that pulls objects downward 
  //userStartAudio(); 
}

//This function is the main loop that runs continuously. It controls animation, movement, and rendering.(60 seconds)
function draw() {
  background(10, 10, 30, 25); //Creates a fading effect where old fireworks slowly disappear
  
  if (random(1) < 0.05) { // 5% chance per frame to create a firework
    fireworks.push(new Firework());// Add a firework to the list so it can be updated and displayed.
  }
  
  //This loops through all the fireworks, updates them, displays them, and removes the ones that are finished.
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
  
  //This loops through all the trails, updates them, displays them, and removes the ones that are finished.
  for (let i = trails.length - 1; i >= 0; i--) {
    trails[i].update();
    trails[i].show();
    if (trails[i].done()) {
      trails.splice(i, 1);
    }
  }
}

class Firework {
  constructor() {
    this.firework = new Particle(random(width), height, true);
    this.exploded = false;
    this.particles = [];
    trails.push(new Trail(this.firework.pos.x, this.firework.pos.y));
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    // if (soundPlayed) {
    //   explosionSound.play(); // Play explosion sound
    // }
    for (let i = 0; i < 150; i++) { // More particles for a bigger explosion
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, false);
      this.particles.push(p);
    }
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (let p of this.particles) {
      p.show();
    }
  }
}

//A firework particle (the rocket) → It moves upward before exploding. 
//Explosion particles (sparks) → After the firework explodes, particles spread in all directions.
class Particle {
  constructor(x, y, firework) {
    this.pos = createVector(x, y);
    this.firework = firework; //if true it's a rocket,
    this.lifespan = 255;//The opacity of the particle 
    //random2D():generate a random vector
    this.vel = firework ? createVector(0, random(-15, -10)) : p5.Vector.random2D().mult(random(3, 12));//stores how fast and in which direction the particle is moving
    this.acc = createVector(0, 0);//The acceleration applied to the particle (like gravity).
    this.color = color(random(255), random(255), random(255));//Random color for each particle.
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.95);//slows down 
      this.lifespan -= 5;//Becomes more transparent over time
    }
    this.vel.add(this.acc);//Adds acceleration to velocity.
    this.pos.add(this.vel);//Moves the particle.
    this.acc.mult(0);
  }

  done() {
    return this.lifespan < 0;//lifespan becomes negative, the particle disappears
  }

  show() {
    stroke(this.color);
    if (!this.firework) {
      strokeWeight(3);
      stroke(this.color, this.lifespan);
    } else {
      strokeWeight(5);
    }
    point(this.pos.x, this.pos.y);
  }
}

class Trail {
  constructor(x, y) {
    this.path = [];
    this.lifespan = 255;
    this.color = color(255, 100);
    this.pos = createVector(x, y);
  }

  update() {
    this.path.push({ x: this.pos.x, y: this.pos.y });
    if (this.path.length > 10) {
      this.path.shift();
    }
    this.lifespan -= 10;
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    noFill();
    stroke(this.color, this.lifespan);
    strokeWeight(2);
    beginShape();
    for (let p of this.path) {
      vertex(p.x, p.y);//creates a smooth line connecting multiple points
    }
    endShape();
  }
}