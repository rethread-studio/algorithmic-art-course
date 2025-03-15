//global variable only used here in the orchestrator sketch
var O_widthexquis,
  O_heightexquis,
  O_canvas,
  O_policeexquise,
  O_sections,
  O_nbsectionshorizontal,
  O_nbsectionsvertical,
  O_configurationexquise;
//global variables that can be used in all sketches
var O_sectionwidth; //width of a section
var O_sectionheight; //height of a section
var O_sectionduration; //duration (in frames) for one section animation
var O_currentsection; //object that has data for the section that is currently drawing
var O_counter = 0; //global frame counter

function preload() {
  O_policeexquise = loadFont("./FreeMono.otf");
  O_configurationexquise = loadJSON("./exquisite.json");
}

function setup() {
  O_widthexquis = Math.floor(windowWidth * 0.8);
  O_heightexquis = Math.floor(O_widthexquis / 1.82);
  O_canvas = createCanvas(O_widthexquis, O_heightexquis);
  O_nbsectionsvertical = 3;
  O_nbsectionshorizontal = Math.ceil(
    Object.keys(O_configurationexquise).length / O_nbsectionsvertical,
  );
  O_sectionduration = 60 * 2;

  // center the canvas
  var x = (windowWidth - O_widthexquis) / 2;
  var y = (windowHeight - O_heightexquis) / 2;
  O_canvas.position(x, y);
  colorMode(HSB, 360, 100, 100, 250);

  // initialize all sections and shuffle their order
  O_sectionwidth = Math.floor(O_widthexquis / O_nbsectionshorizontal);
  O_sectionheight = Math.floor(O_heightexquis / O_nbsectionsvertical);
  initsections();
  O_sections = shuffle(O_sections);
  textSize(84);
  textFont(O_policeexquise);
  stroke(0, 0, 100);
}

function initsections() {
  O_sections = [];
  var x1, y1, x2, y2, x3, y3, x4, y4, id;
  id = 0;
  for (var i = 0; i < O_nbsectionshorizontal; i++) {
    for (var j = 0; j < O_nbsectionsvertical; j++) {
      if (i == 0) {
        y4 = random(O_sectionheight * 0.1, O_sectionheight * 0.9);
      } else {
        y4 = O_sections[(i - 1) * O_nbsectionsvertical + j].y2;
      }
      if (j == 0) {
        x1 = random(O_sectionwidth * 0.1, O_sectionwidth * 0.9);
      } else {
        x1 = O_sections[i * O_nbsectionsvertical + (j - 1)].x3;
      }
      var s = {
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
      O_sections.push(s);
      id++;
    }
  }
}

var index = 0;

async function draw() {
  var functionName, fn;
  if (
    O_counter ==
    Object.keys(O_configurationexquise).length * O_sectionduration
  ) {
    //background(0, 0, 0)
    noLoop();
    O_counter = 0;
    index = 0;
  } else {
    if (O_counter % O_sectionduration == 0) {
      O_currentsection = O_sections[index];
      artCode = O_configurationexquise[index].art_code;
      await window[artCode]["init"]();
      index++;
    }
    if (O_counter % O_sectionduration > 0) {
      artCode = O_configurationexquise[index - 1].art_code;
      await window[artCode]["draw"]();
    }
    O_counter++;
  }
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
