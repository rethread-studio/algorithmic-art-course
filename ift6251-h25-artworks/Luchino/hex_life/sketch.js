const side = 800; // w & h of canva
const nb = 35 // number of hexagons in top line
const fr = 5; // frame rate

// Calcul des constantes géométriques
const apo = side / (2 * nb);
const sq3 = Math.sqrt(3);
const radius = 2 * apo / sq3;
const radius2 = radius / 2;

// calcul du nombre d'hexagones par ligne et colone 
const nb_rows = 2 * nb - 1;
const nb_cols = nb

var pos = 0 // position dans la liste 'alive' (états)

// grille des cases hexagonales
let grid = new Array(nb_rows).fill().map(() => new Array(nb_cols).fill());
var started = false;

var nb_iteration = 0;
var max_nb_iteration = 100;


function setup() {
  createCanvas(0, 0);
  // pour pas avoir le default canvas et pouvoir centrer le bouton

  colorMode(HSB, 360, 100, 100, 250)
  frameRate(fr)

  const button = select('#startButton'); // run quand on appuie sur le bouton
  button.mousePressed(() => {
    createCanvas(side, side);
    button.hide();
    start()
  });
  max_nb_iteration = random(nb/2,nb);
  console.log(max_nb_iteration);

  make_grid()
  initiate()
}

function draw() {
  background("black")
  if (started) {
    draw_grid()
    update_all()
    if (nb_iteration >= max_nb_iteration){
      noLoop()
    }
    nb_iteration++;
  } 
}

function start() {
  started = true
}

// pour dessiner un hexagone
function draw_hex(hex) {

  if (hex.alive[pos]) {
    
    const p = hex.points;
    
    noStroke()

    fill(270+random(-30,30),90+random(-10,10),70+random(-10,10))
    
    beginShape();
    vertex(p[0][0], p[0][1])
    vertex(p[1][0], p[1][1])
    vertex(p[2][0], p[2][1])
    vertex(p[3][0], p[3][1])
    vertex(p[4][0], p[4][1])
    vertex(p[5][0], p[5][1])
    endShape();
  } 

}

function draw_grid() {
  grid.forEach(i => {
    i.forEach(j => {
      if (j !== undefined) {
        draw_hex(j);
      }
    });
  });
}

// pour obtenir les points d'un hexagone basé sur son centre
function get_points(x, y) {
  return [
    [x - apo, y - radius2],
    [x, y - apo * 2 / sq3],
    [x + apo, y - radius2],
    [x + apo, y + radius2],
    [x, y + apo * 2 / sq3],
    [x - apo, y + radius2]
  ]
}

// pour créer la grille
function make_grid() {
  for (var i = 0; i < nb_rows; i++) {
    for (var j = (i % 2); j < nb_cols; j += 2) {
      grid[i][j] = make_hex(i, j);
    }
  }
  for (var i = 0; i < nb_rows; i++) {
    for (var j = (i % 2); j < nb_cols; j += 2) {
      if (i - 1 >= 0) {
        if (j - 1 >= 0) {
          grid[i][j].links.push([i - 1, j - 1])
        } if (j + 1 < nb_cols) {
          grid[i][j].links.push([i - 1, j + 1])
        }
      }
      if (i - 2 >= 0) {
        grid[i][j].links.push([i - 2, j])
      }
      if (i + 1 < nb_rows) {
        if (j - 1 >= 0) {
          grid[i][j].links.push([i + 1, j - 1])
        } if (j + 1 < nb_cols) {
          grid[i][j].links.push([i + 1, j + 1])
        }
      }
      if (i + 2 < nb_rows) {
        grid[i][j].links.push([i + 2, j])
      }
    }
  }
}

// pour créer l'objet hexagone
function make_hex(i, j) {
  var x = (i + 1) * apo
  var y = apo * 2 / sq3 + j * (apo * 2 / sq3 + radius2) + 50// offset pour centrer
  return {
    i: i,
    j: j,
    x: x,
    y: y,
    links: [],
    alive: [false, false],
    points: get_points(x, y)
  }
}

function initiate() {
  var ci = Math.floor(nb_rows / 2)
  var cj = Math.floor(nb_cols / 2)
  if(ci%2){
    if(!(cj%2)){
      cj--
    }
  } else {
    if((cj%2)){
      cj--
    }
  }

  if (random()> 0.5){
    grid[ci][cj].alive[0] = true // center
  }
  var is = []
  var js = []
  for (let a = 0; a < random(5,7); a++) {
    let i = Math.floor(random(8))
    let j = random([0,2,4,6,8])
    if(i%2){j++}
    if (!is.includes(i) || !js.includes(j)){
      grid[ci - i][cj - j].alive[0] = true
      grid[ci + i][cj - j].alive[0] = true
      if(random()>0.5){
        if (j!=cj){
          grid[ci - i][cj + j].alive[0] = true
          grid[ci + i][cj + j].alive[0] = true
        }
      }
    }
    is.push(i)
    js.push(j)
  }
}

function update_cell(cell) {
  var cnt = 0
  cell.links.forEach(link => {
    if (grid[link[0]][link[1]].alive[pos]) {
      cnt += 1
    }
  });
  if (cell.alive[pos]){
    if (cnt < 2 || cnt > 3) {
      cell.alive[(pos + 1) % 2] = false;
    } else {
      cell.alive[(pos + 1) % 2] = true;
    }
  } else {
    if (cnt == 2) {
      cell.alive[(pos + 1) % 2] = true;
    } else {
      cell.alive[(pos + 1) % 2] = false;
    }
  } 
}

function update_all() {
  grid.forEach(i => {
    i.forEach(j => {
      if (j !== undefined) {
        update_cell(j);
      }
    });
  });
  pos = (pos + 1) % 2
}