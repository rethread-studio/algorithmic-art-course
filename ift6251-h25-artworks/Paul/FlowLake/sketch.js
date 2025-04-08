//to look for stations, got on this website: https://tidesandcurrents.noaa.gov/map/index.html?region=California
//first IDs are Yellow and Red stations, second IDs are Blue stations
let stations = [["8575512", "cb1102"], ["8518750", "n03020"], ["8573927", "cb1301"], ["9414750", "s10010"], ["9418767", "hb0401"], ["9414863", "s08010"], ["9445958", "ks0101"]];
let tideLevels = [];  // Stores tide level for each day
let waterTemps = [];  // Stores water temperature for each day
let oceanCurrents = []; // Stores current speed & direction for each day

let visualArrows = [];
let visualTemps = [];
let visualTides = [];

let nextArrows = [];
let nextTemps = [];
let nextTides = [];

let resolution = 50; // Number of arrows to draw
let maxspeed = 50; // Maximum current speed
let maxDistance = 80; // Maximum distance from mouse to reverse arrow direction
let animationProgress = 0;  // Lerp progress (0 to 1)
let animationSpeed = 0.02;  // Speed of interpolation
let previousCurrents = [];  // Stores previous step's currents
let transitionFrames = 15; // Time before shifting data
let shiftFrames = 15; // Frames over which to blend data
let frameCounter = 0;
let lerpSpeed = 0.03;
let blendingProgress = 0; // 0 to 1 progress of blending
let drawBackground = true;
let drawTrails = true;
let backgroundBlend = 0.06;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB);
    fetchOceanData();
}

function draw() {
    if (drawBackground) { 
        if (drawTrails) background(0, backgroundBlend);
        else background(0);
    }

    if (oceanCurrents.length === 0) return;

    updateVisualData();
    drawOceanCurrents();

    frameCounter++;

    // When it's time to shift, start blending into new data
    if (frameCounter === transitionFrames - shiftFrames) {
        prepareNextData();
        blendingProgress = 0; // Reset blending progress
    }

    // During blend phase, interpolate between old & new data
    if (frameCounter >= transitionFrames - shiftFrames) {
        blendingProgress += 1 / shiftFrames;
        blendIntoNextData(blendingProgress);
    }

    if (frameCounter >= transitionFrames) {
        finalizeShift();
        frameCounter = 0;
    }
}

function updateVisualData() {
    // Ensure arrays are populated before accessing them
    if (visualArrows.length === 0 && oceanCurrents.length > 0) {
        visualArrows = oceanCurrents.map(d => ({
            angle: radians(d.direction),
            speed: d.speed
        }));
        visualTemps = waterTemps.map(d => d.temp);
        visualTides = tideLevels.map(d => d.level);
    }

    for (let i = 0; i < visualArrows.length; i++) {
        // Ensure we only lerp when there's valid data
        if (oceanCurrents[i]) {
            visualArrows[i].angle = lerpAngle(visualArrows[i].angle, radians(oceanCurrents[i].direction), lerpSpeed);
            visualArrows[i].speed = lerp(visualArrows[i].speed, oceanCurrents[i].speed, lerpSpeed);
            visualTemps[i] = lerp(visualTemps[i], waterTemps[i]?.temp || 0, lerpSpeed);
            visualTides[i] = lerp(visualTides[i], tideLevels[i]?.level || 0, lerpSpeed);
        }
    }
}

// Prepare next dataset before shifting
function prepareNextData() {
    nextArrows = oceanCurrents.map(d => ({
        angle: radians(d.direction),
        speed: d.speed
    }));
    nextTemps = waterTemps.map(d => d.temp);
    nextTides = tideLevels.map(d => d.level);
}

// Blend between current and next dataset
function blendIntoNextData(progress) {
    for (let i = 0; i < visualArrows.length; i++) {
        // Only attempt to lerp if the data is defined
        if (nextArrows[i]) {
            visualArrows[i].angle = lerpAngle(visualArrows[i].angle, nextArrows[i].angle, progress);
            visualArrows[i].speed = lerp(visualArrows[i].speed, nextArrows[i].speed, progress);
            visualTemps[i] = lerp(visualTemps[i], nextTemps[i], progress);
            visualTides[i] = lerp(visualTides[i], nextTides[i], progress);
        }
    }
}

// Finalize shift after blending is complete
function finalizeShift() {
    shiftOceanData();
    blendingProgress = 0;
}

function shiftOceanData() {
    if (oceanCurrents.length > 0) oceanCurrents.push(oceanCurrents.shift());
    if (waterTemps.length > 0) waterTemps.push(waterTemps.shift());
    if (tideLevels.length > 0) tideLevels.push(tideLevels.shift());
}

function drawOceanCurrents() {
    let widthRatio = width / resolution;
    let heightRatio = height / resolution;

    for (let i = 0; i < visualArrows.length; i++) {
        for (let j = 0; j < resolution; j++) {
            let x = j * widthRatio + widthRatio / 2;
            let y = i * heightRatio + heightRatio / 2;

            let distToMouse = dist(mouseX, mouseY, x, y);
            let angle = visualArrows[i].angle;
            if (distToMouse < maxDistance && drawBackground) {
                angle = atan2(mouseY - y, mouseX - x) + PI;
            }
            let length = visualArrows[i].speed / maxspeed * 20;

            let endX = x + cos(angle) * length;
            let endY = y + sin(angle) * length;

            let hue = map(visualTemps[i], min(visualTemps), max(visualTemps), 255, 175);
            let alpha = map(visualTides[i], min(visualTides), max(visualTides), 0, 255);

            stroke(hue, 255, 255, alpha);
            strokeWeight(3);
            line(x, y, endX, endY);
        }
    }
}

function lerpAngle(start, end, amt) {
    let diff = (end - start + PI) % TWO_PI - PI;
    return start + diff * amt;
}

function fetchOceanData() {
    let stationIndex = Math.floor(Math.random() * stations.length);
    let stationID = stations[stationIndex][0];
    let currentsStationID = stations[stationIndex][1];
    const baseURL = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

    let today = new Date();
    let dates = [];
    for (let i = 0; i < resolution; i++) {
        let date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }

    let promises = dates.map(date => {
        let currentsURL = `${baseURL}?station=${currentsStationID}&product=currents&begin_date=${date}&end_date=${date}&units=metric&time_zone=gmt&format=json`;
        let tidesURL = `${baseURL}?station=${stationID}&product=water_level&begin_date=${date}&end_date=${date}&datum=MLLW&units=metric&time_zone=gmt&format=json`;
        let waterTempURL = `${baseURL}?station=${stationID}&product=water_temperature&begin_date=${date}&end_date=${date}&units=metric&time_zone=gmt&format=json`;

        return Promise.all([
            fetch(currentsURL).then(res => res.json()),
            fetch(tidesURL).then(res => res.json()),
            fetch(waterTempURL).then(res => res.json())
        ]);
    });

    Promise.all(promises)
        .then(responses => {
            responses.forEach(([currentsData, tidesData, tempData], index) => {
                let tideLevel = tidesData.data?.length ? parseFloat(tidesData.data[0].v) || 0 : 0;
                let waterTemp = tempData.data?.length ? parseFloat(tempData.data[0].v) || 0 : 0;
                let currentSpeed = currentsData.data?.length ? parseFloat(currentsData.data[0].s) || 0 : 0;
                let currentDirection = currentsData.data?.length ? parseFloat(currentsData.data[0].d) || 0 : 0;

                tideLevels.push({ date: dates[index], level: tideLevel });
                waterTemps.push({ date: dates[index], temp: waterTemp });
                oceanCurrents.push({ date: dates[index], speed: currentSpeed, direction: currentDirection });
            });

            // Initialize previous data to match the first frame
            previousCurrents = JSON.parse(JSON.stringify(oceanCurrents));

            console.log("Tide Levels:", tideLevels);
            console.log("Water Temperatures:", waterTemps);
            console.log("Ocean Currents:", oceanCurrents);
        })
        .catch(error => console.error("API Fetch Error:", error));
}