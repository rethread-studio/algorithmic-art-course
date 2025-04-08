let cercles = [];
const espacement = 50;
const tailleMax = 40;
(() => {
  let s;

  async function init() {
    //this is exquisitered

    s = O_currentsection;

    for (let x = espacement; x < O_sectionwidth; x += espacement) {
      for (let y = espacement; y < O_sectionheight; y += espacement) {
        cercles.push({
          x: x,
          y: y,
          visible: true,
          taille: random(10, tailleMax),
          couleur: color(random(150, 255), random(150, 255), random(150, 255), 180)
        });
      }
    }

  }

  function draw() {
    // background(0);

    // Move to the section
    push();
    translate(s.x, s.y);

    // Create border around section
    fill(0, 0, 0);
    noStroke();
    rect(0, 0, O_sectionwidth, O_sectionheight);
    // fill(0, 0, 100);

    // Draw our art
    // background(0, 0, 0, 25); // Fond légèrement transparent pour effet de traînée

    // Mettre à jour et afficher les cercles
    cercles.forEach(cercle => {
      // Changer aléatoirement la visibilité (20% de chance de changer)
      if (random() < 0.2) {
        cercle.visible = !cercle.visible;

        // Option: modifier légèrement la taille quand il réapparaît
        if (cercle.visible) {
          cercle.taille = random(10, tailleMax);
        }
      }

      // Dessiner le cercle s'il est visible
      if (cercle.visible) {
        fill(cercle.couleur);
        noStroke();
        ellipse(cercle.x, cercle.y, cercle.taille);
      }
    });

    // Option: dessiner quelques cercles supplémentaires aléatoires
    if (random() < 0.3) {
      fill(random(255), random(255), random(255), 100);
      ellipse(random(O_sectionwidth), random(O_sectionheight), random(5, 20));
    }
    
    if (O_counter % O_sectionduration == O_sectionduration - 1) {
      fill(0, 100, 100); // Couleur rouge semi-transparente
      noStroke();
    
      arc(s.x1, s.y1, 60, 60, 0, PI);
      arc(s.x2, s.y2, 60, 60, PI * 0.5, PI * 1.5);
      arc(s.x3, s.y3, 60, 60, PI, 2 * PI);
      arc(s.x4, s.y4, 60, 60, PI * 1.5, PI * 0.5);
  
    }
        


    // Pop out of the section
    pop();
  }

  // Use the name of the current js file (without the extension) as the key in the object window.
  window.iberic = { init, draw };
})();
