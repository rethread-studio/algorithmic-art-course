
let points = [];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off the edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    stroke(255);
    strokeWeight(4);
    point(this.x, this.y);
  }
}

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 150; i++) {
    points.push(new Point(random(width), random(height)));
  }
}

function draw() {
  background(0);
  for (let p of points) {
    p.update();
    p.display();
  }
}