(() => {
  let s, firstDraw;
  let heartSize;
  let lignes = [];
  let remainingTime;

  function init() {
    s = O_currentsection;
    firstDraw = true;
    heartSize = min(O_sectionwidth, O_sectionheight) * 0.8;
    remainingTime = O_sectionduration;
    let position_x = 0;
    let position_y = 0;

    while (position_x < O_sectionwidth) {
      if (position_y < O_sectionheight) {
        if (!isInHeart(position_x, position_y)) {
          if (random() > 0.42) {
            let longueur = random(5, 50);
            let yEnd = min(position_y + longueur, O_sectionheight - random(2, 7));
            lignes.push([position_x, position_y, position_x, yEnd]);
          }
        }
        position_y += random(2, 21);
      } else {
        position_y = 0;
        position_x += random(2, 21);
      }
    }
    lignes = shuffle(lignes);
  }

  function draw() {
    remainingTime--;
    push();
    translate(s.x, s.y);
    if (firstDraw) {
      fill("white");
      stroke(0);
      rect(0, 0, O_sectionwidth, O_sectionheight);
      firstDraw = false;
    }

    if (lignes.length > 0 && remainingTime > 10) {
      let ligne = lignes.pop();
      stroke(0);
      line(ligne[0], ligne[1], ligne[2], ligne[3]);
    }

    if (remainingTime < 10) {
      blendMode(DIFFERENCE);
      fill("white");
      noStroke();
      triangle(0, 0, s.x1, s.y1, s.x4, s.y4);
      triangle(O_sectionwidth, 0, s.x1, s.y1, s.x2, s.y2);
      triangle(0, O_sectionheight, s.x4, s.y4, s.x3, s.y3);
      triangle(O_sectionwidth, O_sectionheight, s.x3, s.y3, s.x2, s.y2);
      blendMode(BLEND);
    }
    pop();
  }

  function isInHeart(x, y) {
    let centerX = O_sectionwidth / 2;
    let centerY = O_sectionheight / 2;
    let normalisationX = (x - centerX) / (heartSize / 2);
    let normalisationY = (centerY - y) / (heartSize / 2);
    // Formule issue de : https://www.mathweb.fr/euclide/2018/09/14/des-equations-de-coeurs/
    return (
      pow(pow(normalisationX, 2) + pow(normalisationY, 2) - 1, 3) < pow(normalisationX, 2) * pow(normalisationY, 3)
    );
  }

  window.exquisiteAfterRain = { init, draw };
})();
