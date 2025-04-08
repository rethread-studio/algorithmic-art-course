let canvasWidth = 800;
let canvasHeight = 800;
let topLayer;
let bottomLayer;
let startX = -canvasWidth; // Start off-screen
let weightDifference;
let blackWeight;
let whiteWeight;
let maskGraphics; 


function setup() {
  createCanvas(canvasWidth, canvasHeight);

  topLayer = createGraphics(canvasWidth, canvasHeight); 
  bottomLayer = createGraphics(canvasWidth, canvasHeight); 

  weightDifference = random(-5, 5);
  blackWeight = random(5, 20);
  whiteWeight = blackWeight + weightDifference;

  startX = -canvasWidth; // Reset startX for drawing stripes

  // Draw top layer stripes
  while (startX < canvasWidth) {
    // Draw black stripe
    topLayer.stroke(0);
    topLayer.strokeWeight(blackWeight);
    topLayer.line(startX, 0, startX + canvasWidth, canvasHeight);
    startX += blackWeight;

    // Draw white stripe
    topLayer.stroke(255);
    topLayer.strokeWeight(whiteWeight);
    topLayer.line(startX, 0, startX + canvasWidth, canvasHeight);
    startX += whiteWeight;
  }

  startX = -canvasWidth; // Reset startX for bottom layer stripes

  // Draw bottom layer stripes in the opposite diagonal direction
  while (startX < canvasWidth) {
    // Draw black stripe
    bottomLayer.stroke(255);
    bottomLayer.strokeWeight(blackWeight);
    bottomLayer.line(startX, canvasHeight, startX + canvasWidth, 0);
    startX += blackWeight;

    // Draw white stripe
    bottomLayer.stroke(0);
    bottomLayer.strokeWeight(whiteWeight);
    bottomLayer.line(startX, canvasHeight, startX + canvasWidth, 0);
    startX += whiteWeight;
  }
  
  maskGraphics = createGraphics(width, height);
}

function draw() {
  image(topLayer, 0, 0); 
  image(bottomLayer, 0, 0); 

  // Update the mask with rotation around the canvas center
  maskGraphics.clear(); // Clear previous frames
  maskGraphics.fill(255); // White area defines the visible part

  maskGraphics.push();
  // Move the origin to the center of the canvas
  maskGraphics.translate(canvasWidth / 2, canvasHeight / 2);
  // Apply rotation
  let angle = frameCount * 0.01; // Angle increases over time for smooth rotation
  maskGraphics.rotate(angle);
  // Move back to draw shapes in correct position
  maskGraphics.translate(-canvasWidth / 2, -canvasHeight / 2);

  // Draw squares
  let halfWidth = canvasWidth / 2;
  maskGraphics.square(halfWidth, 0, halfWidth);
  maskGraphics.square(0, halfWidth, halfWidth);

  maskGraphics.pop();

  // Apply the mask to the top layer
  let maskedLayer = topLayer.get(); // Get a copy of the top layer
  maskedLayer.mask(maskGraphics);

  // Draw the masked top layer
  image(maskedLayer, 0, 0);

  // Draw triangles in the corners of the canvas
  noStroke();
  triangle(0, 0, halfWidth, 0, 0, halfWidth);
  triangle(0, halfWidth, 0, canvasHeight, halfWidth, canvasHeight);
  triangle(halfWidth, 0, canvasWidth, 0, canvasWidth, halfWidth);
  triangle(halfWidth, canvasHeight, canvasWidth, canvasHeight, canvasWidth, halfWidth);
}
