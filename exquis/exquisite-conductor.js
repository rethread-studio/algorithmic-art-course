// Global variable only used here in the orchestrator sketch
var O_widthexquis,
  O_heightexquis,
  O_canvas,
  O_policeexquise,
  O_sections,
  O_nbsectionshorizontal,
  O_nbsectionsvertical,
  O_configurationexquise,
  O_nbartworks;

// Global variables that can be used in all sketches
var O_sectionwidth; // Width of a section
var O_sectionheight; // Height of a section
var O_sectionduration; // Duration (in frames) for one section animation
var O_currentsection; // Object that has data for the section that is currently drawing
var O_counter = 0; // Global frame counter

async function setup() {
  // Load the font and the configuration file
  O_policeexquise = await loadFont("./FreeMono.otf");
  O_configurationexquise = await loadJSON("./exquisite.json");

  // Get the number of artworks
  O_nbartworks = Object.keys(O_configurationexquise).length;

  // Create the canvas
  O_widthexquis = Math.floor(windowWidth);
  O_heightexquis = Math.floor(O_widthexquis / 1.82);
  O_canvas = createCanvas(O_widthexquis, O_heightexquis);

  // Center the canvas
  let x = (windowWidth - O_widthexquis) / 2;
  let y = (windowHeight - O_heightexquis) / 2;
  O_canvas.position(x, y);
  colorMode(HSB, 360, 100, 100, 250);

  // Set the duration of a section
  O_sectionduration = 60 * 30;

  // Compute the number of sections their size
  O_nbsectionsvertical = 3;
  O_nbsectionshorizontal = 9// Math.ceil(O_nbartworks / O_nbsectionsvertical);
  O_sectionwidth = Math.floor(O_widthexquis / O_nbsectionshorizontal);
  O_sectionheight = Math.floor(O_heightexquis / O_nbsectionsvertical);

  // Initialize all sections and shuffle them
  initsections();
  O_sections = shuffle(O_sections);

  // Initialize drawing parameters
  textSize(84);
  textFont(O_policeexquise);
  stroke(0, 0, 100);
  pixelDensity(0.5)

  // Initialize the artworks
  let promises = [];
  for (let i = 0; i < O_nbartworks; i++) {
    // Initialize all sketches
    O_currentsection = O_sections[i];
    let artCode = O_configurationexquise[i].art_code;
    let promise = window[artCode]["init"]();
    promises.push(promise);
  }
  await Promise.all(promises);
}

function initsections() {
  // Initialize some variables
  O_sections = [];
  let x1, y4, id;
  id = 0;

  // Create all sections
  for (let i = 0; i < O_nbsectionshorizontal; i++) {
    for (let j = 0; j < O_nbsectionsvertical; j++) {
      // Check if we are at the beginning of a row
      if (i == 0) {
        y4 = random(O_sectionheight * 0.1, O_sectionheight * 0.9);
      } else {
        y4 = O_sections[(i - 1) * O_nbsectionsvertical + j].y2;
      }

      // Check if we are at the beginning of a column
      if (j == 0) {
        x1 = random(O_sectionwidth * 0.1, O_sectionwidth * 0.9);
      } else {
        x1 = O_sections[i * O_nbsectionsvertical + (j - 1)].x3;
      }

      // Create the section
      let section = {
        x: i * O_sectionwidth,
        y: j * O_sectionheight,
        x1: x1,
        y1: 0,
        x2: O_sectionwidth,
        y2: random(O_sectionheight * 0.1, O_sectionheight * 0.9),
        x3: random(O_sectionwidth * 0.1, O_sectionwidth * 0.9),
        y3: O_sectionheight,
        x4: 0,
        y4: y4,
        id: id,
      };

      // Add the section to the list and increment the id
      O_sections.push(section);
      id++;
    }
  }
}

let index = 0;
function draw() {
  // drawsections just draws a grid, we use it for calibration
   background(0,0,0); drawsections(true,true); 
  // drawcorpse draws the generative exquisite corspe, we use it when the grid is calibrated
  // drawcorpse()
}

function drawcorpse(){
  // Check if we are done with all the artworks
  if (O_counter == O_nbartworks * O_sectionduration) {
    noLoop();
    O_counter = 0;
    index = 0;
    return;
  }

  // Check if we need to initialize a new section
  if (O_counter % O_sectionduration == 0) {
    index++;
  }

  // Draw the current section
  if (O_counter % O_sectionduration > 0) {
    let artCode = O_configurationexquise[index - 1].art_code;
    window[artCode]["draw"]();
  }
  O_counter++;
}

function drawsections(flash,fr){
  var s
  for(index in O_sections){
    push()
    stroke(0,0,100); noFill()
    if(flash&&random()<0.05){fill(0,0,100)}
    s=O_sections[index]
    translate(s.x,s.y);
    rect(0,0,O_sectionwidth,O_sectionheight)
    pop()
  }
  if(fr){
    push()
    fill(0,0,0); noStroke()
    rect(O_widthexquis*0.37,O_heightexquis*0.5-70,O_widthexquis*0.15,84)
    stroke(110,100,100);fill(110,100,100)
    text(frameRate().toFixed(2),O_widthexquis*0.37,O_heightexquis*0.5)
    pop()
  }
}

function windowResized() {
  w = document.documentElement.clientWidth;//width of window that is available for drawing
  h = document.documentElement.clientHeight;//width of window that is available for drawing
  resizeCanvas(w, h);
}