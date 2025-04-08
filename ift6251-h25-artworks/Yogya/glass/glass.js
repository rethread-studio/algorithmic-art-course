let voronoi;
let diagram;
let points = [];
let centerX, centerY;
let bounds;
let expansionRate = 10;
let maxPoints = 500;
let delay = 30;
let lastUpdated = 0;
let cellColors = {};
let isRunning = false;
let startButton;
let hues = [180, 220, 270, 320, 40];

let notes = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.00, // A5
  987.77, // B5
  1046.50 // C6
];

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  centerX = width / 2;
  centerY = height / 2;
  voronoi = new Voronoi();
  bounds = {xl: 0, xr: width, yt: 0, yb: height}; 
}

function draw() {
  background(255);
  drawVoronoi();
  controlVoronoi();
}

function initializeVoronoi() {
  points = [{x: centerX, y: centerY}];
  diagram = voronoi.compute(points, bounds);
  assignCellColors();
}

function drawVoronoi() {
  if (diagram) {
    for (let cell of diagram.cells) {
      let color = cellColors[cell.site.x + "," + cell.site.y];
      fill(color.hue, color.saturation, color.brightness, color.alpha);
      stroke(255, 30);
      strokeWeight(1);
      beginShape();
      for (let halfedge of cell.halfedges) {
        let glitch = random(0, 1);
        let startPoint = halfedge.getStartpoint();
        if (glitch < 0.995) {
          vertex(startPoint.x, startPoint.y);
        }
      }
      endShape(CLOSE);
    }
  }
}

function controlVoronoi() {
  if (frameCount - lastUpdated >= delay && points.length < maxPoints) {
    expandVoronoi();
    lastUpdated = frameCount;
  }
}

function expandVoronoi() {
  let newPoints = [];
  for (let i = 0; i < expansionRate; i++) {
    if (points.length < maxPoints) {
      let angle = random(TWO_PI);
      let radius = random(points.length) * 2;
      let x = centerX + cos(angle) * radius;
      let y = centerY + sin(angle) * radius;
      newPoints.push({x, y});
    }
  }
  points = points.concat(newPoints);
  diagram = voronoi.compute(points, bounds);
  assignCellColors();
}

function assignCellColors() {
  for (let cell of diagram.cells) {
    if (!(cell.site.x in cellColors)) {
      let hue = random(hues);
      let saturation = random(30, 50);
      let brightness = random(85, 100);
      let alpha = random(40, 80);
      cellColors[cell.site.x + "," + cell.site.y] = {hue, saturation, brightness, alpha};
    }
  }
}
