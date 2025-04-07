// Canvas Configuration
let WIDTH = 600;
let HEIGHT = 600;

let lSystem;
let ruleNum = 2;
let numberRecursions = 4;
let sequence;
let x = 0;
let y = 0;
let len = 10;

function setup() {
  cnv = createCanvas(WIDTH, HEIGHT);
  let sizeX = (windowWidth-WIDTH)/2;
  let sizeY = (windowHeight-HEIGHT)/2;
  cnv.position(sizeX, sizeY);
  angleMode(DEGREES);

  loadRule();
  sequence = doRecursion(numberRecursions);
  // let numberOne = 0;
  // while (sequence[numberOne] != "[") {
  //   numberOne += 1;
  // }
  // len = HEIGHT/(2*numberOne);
  // console.log(sequence);
  background(0);
}

function draw() {
  strokeWeight(1);
  stroke(255);
  // if (min(floor(frameCount/100), 5) == 5) {
  //   noLoop();
  // }
  // sequence = doRecursion(5);
  // push();
  // translate(WIDTH/2, HEIGHT/2);
  // for (let theta = 0; theta < 360; theta+=360/5) {
  //   push();
  //   rotate(theta);
  //   applyRule();
  //   pop();
  // }
  // pop();
  translate(WIDTH/2, HEIGHT);
  //rotate(random(-25, 25));
  applyRule();
  noLoop();
}

function loadRule() {
  if (ruleNum == 0) {
    // Fractal Binary Tree
    lSystem = {
      "axiom" : "0",
      "rules" : {
        "1" : "11",
        "0" : "1[0]0"
      },
      "constants" : {
        "[" : push,
        "]" : pop  
      }
    };
  } else if (ruleNum == 1) {
    // Fractal Plant
    lSystem = {
      "axiom" : "X",
      "rules" : {
        "X" : "F+[[X]-X]-F[-FX]+X",
        "F" : "FF"
      },
      "constants" : {
        "[" : push,
        "]" : pop
      }
    };
  } else if (ruleNum == 2) {
    // Fucking tree
    lSystem = {
      "axiom" : "Z",
      "rules" : {
        "A" : "F+[+FZ-[Z]-Z]-F[F-[FZ]+Z]+[ZF-F+[Z]F]R",
        "B" : "F-[F-[Z]F+FZ+F[Z]]+F-[+F[FZ]-[FZ]]-[+F[Z]]R",
        "F" : "FF"
      },
      "constants" : {
        "[" : push,
        "]" : pop
      }
    };
  }
}

function doRecursion(n) {
  let currentSeq = lSystem["axiom"];
  let nextSeq = "";
  if (n == 0) {
    return currentSeq;
  } 
  while (n != 0) {
    for (let i = 0; i < currentSeq.length; i++) {
      let variable = currentSeq[i];
      if (variable == "Z") {
        if (random() > 0.5) {
          nextSeq = nextSeq.concat(lSystem["rules"]["A"]);
        } else {
          nextSeq = nextSeq.concat(lSystem["rules"]["B"]);
        }
      } else if (variable == "R") {
        if (random() > 0.4) {
          if (random() > 0.5) {
            nextSeq = nextSeq.concat(lSystem["rules"]["A"]);
          } else {
            nextSeq = nextSeq.concat(lSystem["rules"]["B"]);
          }
        }
      } else if (variable in lSystem["rules"]) {
        nextSeq = nextSeq.concat(lSystem["rules"][variable]);
      } else {
        nextSeq = nextSeq.concat(variable);
      }
    }
    currentSeq = nextSeq;
    nextSeq = "";
    n -= 1;
  }
  return currentSeq;
}

function applyRule() {
  for (let i = 0; i < sequence.length; i++) {
    let variable = sequence[i];
    if (ruleNum == 0) {
      if (variable == "0") {
        line(x, y, x, y-len/1.5);
      } else if (variable == "1") {
        line(x, y, x, y-len);
        translate(0, -len);
      } else if (variable == "[") {
        lSystem["constants"][variable]();
        rotate(30);
      } else if (variable == "]") {
        lSystem["constants"][variable]();
        rotate(-30);
      }
    } else if (ruleNum == 1) {
      len = 3;
      if (variable == "F") {
        line(x, y, x, y-len);
        translate(0, -len);
      } else if (variable == "+") {
        rotate(25);
      } else if (variable == "-") {
        rotate(-25);
      } else if (variable == "[") {
        push();
      } else if (variable == "]") {
        pop();
      }
    } else if (ruleNum == 2) {
      if (variable == "F") {
        line(x, y, x, y-len);
        translate(0, -len);
      } else if (variable == "+") {
        rotate(25+2*noise(0.001*len, 0.003*i));
      } else if (variable == "-") {
        rotate(-25+2*noise(0.001*len, 0.003*i));
      } else if (variable == "[") {
        len *= 0.8;
        push();
      } else if (variable == "]") {
        len /= 0.8;
        pop();
      }
    }
  }
}

// Does not work well 
function applyIterRule(step) {
  for (let i = 0; i < step; i++) {
    let variable = sequence[i];
    if (ruleNum == 0) {
      if (variable == "0") {
        line(x, y, x, y-len/1.5);
      } else if (variable == "1") {
        line(x, y, x, y-len);
        translate(0, -len);
      } else if (variable == "[") {
        lSystem["constants"][variable]();
        rotate(45);
      } else if (variable == "]") {
        lSystem["constants"][variable]();
        rotate(-45);
      }
    } else if (ruleNum == 1) {
      len = 3;
      if (variable == "F") {
        if (i == step-1) {
          line(x, y, x, y-len);
        }
        translate(0, -len);
      } else if (variable == "+") {
        rotate(25);
      } else if (variable == "-") {
        rotate(-25);
      } else if (variable == "[") {
        push();
      } else if (variable == "]") {
        pop();
      }
    }
  }
}
