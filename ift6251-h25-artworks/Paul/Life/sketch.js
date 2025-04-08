let cols, rows;
let grid;
let resolution = 10;
let threshold = 0.9;
let fps = 60;
let alpha = 10;
let pg; // Off-screen buffer
let myShader;

function preload() {
    myShader = loadShader("shaders/shader.vert", "shaders/shader.frag");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // Use WEBGL for shader support
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    grid = make2DArray(cols, rows);

    // Initialize grid with random values
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = floor(random(2));
        }
    }

    frameRate(fps);
    pg = createGraphics(width, height); // Off-screen buffer
}

function draw() {
    pg.background(0, 10);

    // Draw grid on the buffer
    pg.noStroke();
    pg.fill(255);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;
            if (grid[i][j] == 1) {
                pg.rect(x, y, resolution, resolution);
            }
        }
    }

    // Compute next generation
    let next = make2DArray(cols, rows);
    grid[floor(random(0, cols - 1))][floor(random(0, cols - 1))] = 1;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];

            // Count live neighbors
            let sum = 0;
            for (let xoff = -1; xoff <= 1; xoff++) {
                for (let yoff = -1; yoff <= 1; yoff++) {
                    let col = (i + xoff + cols) % cols;
                    let row = (j + yoff + rows) % rows;
                    sum += grid[col][row];
                }
            }
            sum -= state;

            // Apply rules
            if (state == 0 && sum == 3) {
                next[i][j] = 1;
            } else if (state == 1 && (sum < 2 || sum > 3)) {
                next[i][j] = 0;
            } else {
                next[i][j] = state;
            }
        }
    }
    grid = next;

    // Apply the shader and pass the off-screen buffer
    shader(myShader);
    myShader.setUniform("threshold", threshold);
    myShader.setUniform("resolution", [width, height]);
    myShader.setUniform("texelSize", resolution);
    myShader.setUniform("tex", pg);

    rect(-width / 2, -height / 2, width, height);
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}
