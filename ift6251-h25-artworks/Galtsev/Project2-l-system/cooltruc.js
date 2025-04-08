// Collaboration avec Étienne : il m'a beaucoup aidé. M'a apporté de chouettes modifications.
// Éléments intéressants que j'ai appris :
// Les variables globales. Ça n'a pas marché pendant un moment à cause de la variable globale : PI. Je l'avais définie dans  setup. Au lieu que ce soit à l'extérieur
// de la fonction. Au tout début
// reset Matrix
// background
// la fonction button à incorporer
//Références :
// https://www.youtube.com/watch?v=z7LeTu94qEc&ab_channel=ProgrammingChaos
// Jolie couleur bleu : stroke(10, 0, 100);
var string = "S";
var length = 15;
var angle;
var sentences;
var x;
var px;
var py;
var pz;

function setup() {
  createCanvas(windowWidth, windowHeight);

  x = [1, 2, 3, 4, 5];
  angle = PI / x[1];
  px = 0;
  py = height;
  pz = 0;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (frameCount == 1) {
    background(0);
    for (let i = 0; i < 10; i++) {
      string = grammar(string);
    }
  }
  express();
  if (frameCount % 4 == 0) {
    for (let i = 0; i < 10; i++) {
      stroke("white");
      strokeWeight(random(3));
      positionX = random(windowWidth);
      positionY = random(windowHeight);
      lengthLine = random(100, 1000);
      line(positionX, positionY, positionX, positionY + lengthLine);
    }
  }
  px = px + 9;
  py = py - 15;
}

function grammar(s) {
  sentences = ["FrFrF", "FlFrFrFlF"];
  var init = "";
  for (let i of s) {
    switch (i) {
      case "S":
        init += "F";
        break;
      case "F":
        init += sentences[1];
        break;
      default:
        init += i;
        break;
    }
  }
  return init;
}
function express() {
  stroke(10, 0, 100);
  if (pz > 10) {
    pz = 0;
  }
  strokeWeight(3 + pz);
  pz += 0.5;
  //background(0 + px);
  //px += 2;
  background(0);
  resetMatrix();
  translate(0, windowHeight); //mettre un translate global dans draw pour tout faire bouger
  //stroke(255, 100);
  translate(px, py);

  for (let i of string) {
    switch (i) {
      case "F":
        line(0, 0, length, 0);
        translate(length, 0);
        break;
      case "l":
        rotate(-angle);
        break;
      case "r":
        rotate(angle);

        break;
    }
  }
  resetMatrix();
}
