(() => {
  let s;
  let grid = [];
  let bikes = [];
  let cellSize = 10; //Changer selon la taille des cases souhaitée
  let gridWidth, gridHeight;
  let moveInterval = 2;
  let lastMove = 0;
  let lookAheadDistance = 5;

  function init() {
    s = O_currentsection;

    gridWidth = Math.floor(O_sectionwidth / cellSize);
    gridHeight = Math.floor(O_sectionheight / cellSize);
    grid = Array.from({ length: gridWidth }, () => Array(gridHeight).fill(0));

     bikes = [
      {
        active: true,
        color: "#601EF9",
        x: Math.min(Math.floor(s.x1 / cellSize), gridWidth - 1),
        y: Math.min(Math.floor(s.y1 / cellSize), gridHeight - 1),
        dx: 0,
        dy: 1,
        path: [],
      },
      {
        active: true,
        color: "#04D9FF",
        x: Math.min(Math.floor(s.x2 / cellSize), gridWidth - 1),
        y: Math.min(Math.floor(s.y2 / cellSize), gridHeight - 1),
        dx: -1,
        dy: 0,
        path: [],
      },
      {
        active: true,
        color: "#FF5F1F",
        x: Math.min(Math.floor(s.x3 / cellSize), gridWidth - 1),
        y: Math.min(Math.floor(s.y3 / cellSize), gridHeight - 1),
        dx: 0,
        dy: -1,
        path: [],
      },
      {
        active: true,
        color: "#39FF14",
        x: Math.min(Math.floor(s.x4 / cellSize), gridWidth - 1),
        y: Math.min(Math.floor(s.y4 / cellSize), gridHeight - 1),
        dx: 1,
        dy: 0,
        path: [],
      },
    ];

    bikes.forEach((bike) => {
      bike.path = [{ x: bike.x, y: bike.y }];
      if (bike.x >= 0 && bike.x < gridWidth && bike.y >= 0 && bike.y < gridHeight) {
        grid[bike.x][bike.y] = 1;
      }
    });
  }

  function draw() {
    push();
    translate(s.x, s.y);

    drawGrid();
    lastMove++;
    if (!(lastMove < moveInterval)) {
      moveBikes();
      lastMove = 0;
    }
    drawBikes();

    pop();
  }

  function drawGrid() {
    stroke(20);
    for (let x = 0; x <= gridWidth; x++) {
      line(x * cellSize, 0, x * cellSize, gridHeight * cellSize);
    }
    for (let y = 0; y <= gridHeight; y++) {
      line(0, y * cellSize, gridWidth * cellSize, y * cellSize);
    }
  }

  function drawBikes() {
    noStroke(); //beau aussi avec Stroke.
    bikes.forEach((bike) => {
      fill(bike.color);
      for (let i = 0; i < bike.path.length; i++) {
        rect(bike.path[i].x * cellSize, bike.path[i].y * cellSize, cellSize, cellSize);
      }
    });
  }

  function moveBikes() {
    bikes.forEach((bike) => {
      if (!bike.active) return;

      let direction = findDirection(bike);

      if (direction === null) {
        bike.active = false;
        return;
      }

      bike.dx = direction.dx;
      bike.dy = direction.dy;
      let next_X = bike.x + bike.dx;
      let next_Y = bike.y + bike.dy;

      if (next_X < 0 || next_X >= gridWidth || next_Y < 0 || next_Y >= gridHeight || grid[next_X][next_Y] === 1) {
        bike.active = false;
        return;
      }

      bike.x = next_X;
      bike.y = next_Y;
      grid[next_X][next_Y] = 1;
      bike.path.push({ x: next_X, y: next_Y });
    });
  }

  function checkStep(x, y, dx, dy, steps) {
    for (let i = 1; i <= steps; i++) {
      let step_X = x + dx * i;
      let step_Y = y + dy * i;
      if (step_X < 0 || step_X >= gridWidth || step_Y < 0 || step_Y >= gridHeight || grid[step_X][step_Y] === 1) {
        return false;
      }
    }
    return true;
  }

  function findDirection(bike) {
    if (checkStep(bike.x, bike.y, bike.dx, bike.dy, lookAheadDistance)) {
      return { dx: bike.dx, dy: bike.dy };
    }

    let alternatives = [];
    if (bike.dx !== 0) {
      if (checkStep(bike.x, bike.y, 0, -1, lookAheadDistance)) {
        alternatives.push({ dx: 0, dy: -1 });
      }
      if (checkStep(bike.x, bike.y, 0, 1, lookAheadDistance)) {
        alternatives.push({ dx: 0, dy: 1 });
      }
    } else {
      if (checkStep(bike.x, bike.y, -1, 0, lookAheadDistance)) {
        alternatives.push({ dx: -1, dy: 0 });
      }
      if (checkStep(bike.x, bike.y, 1, 0, lookAheadDistance)) {
        alternatives.push({ dx: 1, dy: 0 });
      }
    }

    if (alternatives.length > 0) {
      return alternatives[Math.floor(Math.random() * alternatives.length)];
    }

    if (checkStep(bike.x, bike.y, 0, -1, 1)) {
      return { dx: 0, dy: -1 };
    }
    if (checkStep(bike.x, bike.y, 0, 1, 1)) {
      return { dx: 0, dy: 1 };
    }
    if (checkStep(bike.x, bike.y, -1, 0, 1)) {
      return { dx: -1, dy: 0 };
    }
    if (checkStep(bike.x, bike.y, 1, 0, 1)) {
      return { dx: 1, dy: 0 };
    }

    return null;
  }

  window.exquisiteTron = { init, draw };
})();
