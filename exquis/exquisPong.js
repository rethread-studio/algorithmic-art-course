// Pong est un des premiers jeux vidéo d'arcade et le premier jeu vidéo d'arcade de sport. Il a été imaginé par l'Américain Nolan Bushnell et développé par Allan Alcorn, et la société Atari le commercialise à partir de novembre 1972. Bien que d'autres jeux vidéo aient été inventés précédemment, comme Computer Space, Pong est le premier à devenir populaire.

// Le jeu est inspiré du tennis de table en vue de dessus, et chaque joueur s'affronte en déplaçant la raquette virtuelle de haut en bas, via un bouton rotatif, de façon à garder la balle dans le terrain de jeu. Le joueur peut changer la direction de la balle en fonction de l'endroit où celle-ci tape sur la raquette, alors que sa vitesse augmente graduellement au cours de la manche. Un score est affiché pour la partie en cours et des bruitages accompagnent la frappe de la balle sur les raquettes.

// Pong est à l'origine un exercice demandé par Bushnell à Alcorn en guise d'entraînement. Une version similaire a été créée précédemment par Ralph Baer pour la console de jeu Odyssey de Magnavox, mais son existence reste peu connue. Surpris par la qualité du résultat, Bushnell et Ted Dabney, fondateurs d'Atari, décident de commercialiser le jeu dès 1972. La copie du concept entraîne d'ailleurs une poursuite en justice de Magnavox contre Atari pour violation de brevet en 1976.

// Mise sur le marché fin 1972, la borne d'arcade est un succès : elle est vendue à près de 8 000 exemplaires l'année suivante et engrange jusqu'à 40 millions de dollars de chiffres d'affaires en 1975, dépassant toutes les prédictions de Bushnell et Dabney. Ce succès incite de nombreuses sociétés à se lancer dans le jeu vidéo en copiant le concept, notamment sur console de salon. À la suite des bons chiffres de la borne d'arcade et de l'engouement généré par les concurrents pour le jeu de salon, Pong est porté sur une console de salon dédiée, sous le nom Home Pong à partir de 1975, commercialisée par Sears puis directement par Atari un an après. Ce double succès est considéré comme l'évènement précurseur de l'industrie du jeu vidéo, avec une forte augmentation de l'offre, des centaines de consoles de salon reprenant le concept. 

(() => {
  let s;
  let rBall;
  let xRect1, yRect1, xRect2, yRect2, xBall, yBall, speedBall;
  let heightRect, widthRect;
  let border;
  let side;
  let fc, distance;
  let notBlocked;
  let temp;
  let pointRight;
  let pointLeft;
  let scoreSize;

  async function init() {
    s = O_currentsection;
    rBall = 10;
    speedBall = 17;
    fc = 0;
    notBlocked = false;
    border = 42;
    pointRight = 0;
    pointLeft = 0;
    scoreSize = 30;
    heightRect = O_sectionheight/3;
    widthRect = 10;
    xRect1 = border-widthRect-rBall;
    yRect1 = O_sectionheight/2-heightRect/2;
    xRect2 = O_sectionwidth - xRect1 - widthRect;
    yRect2 = yRect1;
    if (random() < 0.5) {
      xBall = border;
      yBall = constrain(s.y4, rBall, O_sectionheight-rBall);
      temp = yBall;
      yRect1 = constrain(yBall-heightRect/2, 0, O_sectionheight-heightRect);
      yRect2 = random(0, O_sectionheight-heightRect);
      side = 4;
    } else {
      xBall = O_sectionwidth-border;
      yBall = constrain(s.y2, rBall, O_sectionheight-rBall);
      temp = yBall;
      yRect1 = random(0, O_sectionheight-heightRect);
      yRect2 = constrain(yBall-heightRect/2, 0, O_sectionheight-heightRect);
      side = 2;
    }
  }

  function setLineDash(list) {
    drawingContext.setLineDash(list);
  }

  function draw() {
    // Move to the section
    push();
    translate(s.x, s.y);

    // Create border around section
    fill(0, 0, 0);
    rect(0, 0, O_sectionwidth, O_sectionheight);
    fill(0, 0, 100);
    noStroke();

    // Draw our art
    stroke(0,0,100);
    strokeWeight(2);
    setLineDash([5,5]);
    line(O_sectionwidth/2, 0, O_sectionwidth/2, O_sectionheight);
    setLineDash([0,0]);
    stroke(0,0,50);
    textSize(scoreSize);
    text(str(pointLeft), O_sectionwidth/2-scoreSize, scoreSize);
    text(str(pointRight), O_sectionwidth/2+scoreSize/3, scoreSize);
    noStroke();

    if (O_counter % O_sectionduration == O_sectionduration - 1) {
      yRect1 = constrain(s.y4, 0, O_sectionheight-heightRect);
      yRect2 = constrain(s.y2, 0, O_sectionheight-heightRect);
      rect(xRect1, yRect1, widthRect, heightRect);
      rect(xRect2, yRect2, widthRect, heightRect);
    } else {
      rect(xRect1, yRect1, widthRect, heightRect);
      rect(xRect2, yRect2, widthRect, heightRect);
      yRect1 += O_sectionheight/4*(noise(0.05*O_counter)-0.5)*2;
      yRect1 = constrain(yRect1, 0, O_sectionheight-heightRect);
      yRect2 += O_sectionheight/4*(noise(0.05*O_counter+1000)-0.5)*2;
      yRect2 = constrain(yRect2, 0, O_sectionheight-heightRect);
    }
    if (side == 1) {
      distance = Math.sqrt(Math.pow(O_sectionwidth-constrain(s.x1, xRect1+widthRect+rBall, xRect2-rBall), 2)+Math.pow(constrain(s.y2, rBall, O_sectionheight-rBall)-constrain(s.y1, rBall, O_sectionheight-rBall), 2));
      xBall = constrain(s.x1, xRect1+widthRect+rBall, xRect2-rBall) + (fc*speedBall)/distance*(O_sectionwidth-constrain(s.x1, xRect1+widthRect+rBall, xRect2-rBall));
      yBall = constrain(s.y1, rBall, O_sectionheight-rBall) + (fc*speedBall)/distance*(constrain(s.y2, rBall, O_sectionheight-rBall)-constrain(s.y1, rBall, O_sectionheight-rBall));

      if (notBlocked || (xBall+rBall >= xRect2)) {
        if (!notBlocked && ((yBall-rBall >= yRect2 && yBall-rBall < yRect2+heightRect) || (yBall+rBall >= yRect2 && yBall+rBall < yRect2+heightRect))) {
          side = 2;
          fc = 0;
          xBall = xRect2-rBall;
          temp = yBall;
        } else {
          notBlocked = true;
          if (xBall>=2*O_sectionwidth) {
            pointLeft += 1;
            notBlocked = false;
            side = 2;
            fc = 0;
            xBall = xRect2-rBall;
            yBall = constrain(s.y2, rBall, O_sectionheight-rBall);
            temp = yBall;
          }
        }
      } 

    } else if (side == 2) {
      distance = Math.sqrt(Math.pow(constrain(s.x3, xRect1+widthRect+rBall, xRect2-rBall)-(xRect2-rBall), 2)+Math.pow(constrain(s.y3, rBall, O_sectionheight-rBall)-temp, 2));
      xBall = xRect2-rBall + (fc*speedBall)/distance*(constrain(s.x3, xRect1+widthRect+rBall, xRect2-rBall)-(xRect2-rBall));
      yBall = temp + (fc*speedBall)/distance*(constrain(s.y3, rBall, O_sectionheight-rBall)-temp);
      if ((fc*speedBall/distance) > 1) {
        side = 3;
        fc = 0;
        xBall = constrain(s.x3, xRect1+widthRect+rBall, xRect2-rBall);
        yBall = constrain(s.y3, rBall, O_sectionheight-rBall);
      }
    } else if (side == 3) {
      distance = Math.sqrt(Math.pow(-constrain(s.x3, xRect1+widthRect+rBall, xRect2-rBall), 2)+Math.pow(constrain(s.y4, rBall, O_sectionheight-rBall)-constrain(s.y3, rBall, O_sectionheight-rBall), 2));
      xBall = constrain(s.x3, xRect1+widthRect+rBall, xRect2-rBall) + (fc*speedBall)/distance*(-constrain(s.x3, xRect1+widthRect+rBall, xRect2-rBall));
      yBall = constrain(s.y3, rBall, O_sectionheight-rBall) + (fc*speedBall)/distance*(constrain(s.y4, rBall, O_sectionheight-rBall)-constrain(s.y3, rBall, O_sectionheight-rBall));

      if (notBlocked || (xBall-rBall <= xRect1+widthRect)) {
        if (!notBlocked && ((yBall-rBall >= yRect1 && yBall-rBall < yRect1+heightRect) || (yBall+rBall >= yRect1 && yBall+rBall < yRect1+heightRect))) {
          side = 4;
          fc = 0;
          xBall = xRect1+widthRect+rBall;
          temp = yBall;
        } else {
          notBlocked = true;
          if (xBall<=-O_sectionwidth) {
            pointRight += 1;
            notBlocked = false;
            side = 4;
            fc = 0;
            xBall = xRect1+widthRect+rBall;
            yBall = constrain(s.y4, rBall, O_sectionheight-rBall);
            temp = yBall;
          }
        }
      } 
    } else if (side == 4) {
      distance = Math.sqrt(Math.pow(constrain(s.x1, xRect1+widthRect+rBall, xRect2-rBall)-(xRect1+widthRect+rBall), 2)+Math.pow(constrain(s.y1, rBall, O_sectionheight-rBall)-temp, 2));
      xBall = xRect1+widthRect+rBall + (fc*speedBall)/distance*(constrain(s.x1, xRect1+widthRect+rBall, xRect2-rBall)-(xRect1+widthRect+rBall));
      yBall = temp + (fc*speedBall)/distance*(constrain(s.y1, rBall, O_sectionheight-rBall)-temp);
      if ((fc*speedBall/distance) > 1) {
        side = 1;
        fc = 0;
        xBall = constrain(s.x1, xRect1+widthRect+rBall, xRect2-rBall);
        yBall = constrain(s.y1, rBall, O_sectionheight-rBall);
      }
    } 
    fc += 1;
    // console.log(fc*speedBall/distance);
    // console.log(xBall)
    if (xBall+rBall < O_sectionwidth && xBall-rBall >= 0) {
      circle(xBall, yBall, 2*rBall);
    }
    // Pop out of the section
    pop();
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.exquisPong = { init, draw };
})();
