let imgArr = [] 
let WIDTH = 900;
let HEIGHT = 900;
let rectWidth;
let rectHeight;
let numberGen = 8;
let numberCover = 50;
let maxIndex = [0, 1231, 2444, 6944, 4140, 4409, 4102, 1981, 186];
let mode = 1; // 0 for gen by gen | 1 for one line 
let consoleName = "a2600";
let numberElem = {
  "ps1":2010,
  "ps2":1943,
  "ps3":1428,
  "ps4":676,
  "ps5":137,
  "gb":2858,
  "gamecube":530,
  "nes":1877,
  "snes":1716,
  "xbox":783,
  "xbox360":905,
  "xboxx":49,
  "xone":154,
  "a2600":804,
  "a5200":278,
  "intellivision":70,
}

function getAvg(path, callback) {
  let img = loadImage(path, (loadedImg) => {
    loadedImg.loadPixels(); 

    let totalPixels = loadedImg.width * loadedImg.height;
    let sumR = 0, sumG = 0, sumB = 0;

    for (let i = 0; i < totalPixels * 4; i += 4) {
      sumR += loadedImg.pixels[i];    
      sumG += loadedImg.pixels[i + 1]; 
      sumB += loadedImg.pixels[i + 2]; 
    }

    let avgR = sumR / totalPixels;
    let avgG = sumG / totalPixels;
    let avgB = sumB / totalPixels;

    callback({ r: round(avgR), g: round(avgG), b: round(avgB) }); 
  });
}

function preload() {
  // for(let i = 1; i <= 450; i++) {
  //   let randomImage = "images/test/"+i.toString()+".jpg"; 
  //   getAvg(randomImage, (avgValues) => {
  //     imgArr.push([avgValues.r, avgValues.g, avgValues.b])
  //     console.log("Valeurs moyennes :", avgValues); 
  //     console.log("Nom de l'image :", randomImage);
  //   });
  // }
  // imgArr.reverse();

  if (mode == 0) {
    for(let i = 2; i <= 9; i++) {
      for(let j = 1; j <= numberCover; j++) {
        let randomIndex = Math.floor(Math.random() * (maxIndex[i-1]+1));
        let randomImage = "images/"+i.toString()+"/"+randomIndex.toString()+".jpg"; 
        getAvg(randomImage, (avgValues) => {
          imgArr.push([avgValues.r, avgValues.g, avgValues.b])
          console.log("Valeurs moyennes :", avgValues); 
          console.log("Génération :", i);
          console.log("Nom de l'image :", randomIndex);
        });
      }
    }
  } else if (mode == 1) {
    for(let i = 1; i <= numberElem[consoleName]; i++) {
      let img = "images/"+consoleName+"/"+i.toString()+".jpg"; 
      getAvg(img, (avgValues) => {
        imgArr.push([avgValues.r, avgValues.g, avgValues.b])
        console.log("Valeurs moyennes :", avgValues); 
      });
    }
  }

  imgArr.reverse();
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  if (mode == 0) {
    rectWidth = (WIDTH-100)/numberCover;
    rectHeight = (HEIGHT-100)/numberGen;
  } else if (mode == 1) {
    rectWidth = Math.floor(1800/numberElem[consoleName]);
    if (rectWidth == 0) {
      rectWidth += 1;
    }
    rectHeight = 400;
    WIDTH = rectWidth*numberElem[consoleName]; 
    HEIGHT = rectHeight+50;
  }
}

function draw() {
  if (mode == 0) {
    background(0);
    rectMode(CENTER);
    fill(255);
    rect(width / 2, height / 2, WIDTH, HEIGHT);

    for(let i = 0; i < numberGen; i++) {
      for(let j = 0; j < numberCover; j++) {
        let index = i*numberCover+j;
        fill(imgArr[index][0], imgArr[index][1], imgArr[index][2]);
        stroke(imgArr[index][0], imgArr[index][1], imgArr[index][2]);
        rect(width/2-WIDTH/2+100/2+rectWidth/2+rectWidth*j, height/2-HEIGHT/2+100/2+rectHeight/2+rectHeight*i, rectWidth, rectHeight);
      }
    }
  } else if (mode == 1) {
      background(0);
      rectMode(CENTER);
      fill(255);
      rect(width / 2, height / 2, WIDTH+50, HEIGHT);

      for(let i = 0; i < numberElem[consoleName]; i++) {
        let index = i;
        fill(imgArr[index][0], imgArr[index][1], imgArr[index][2]);
        stroke(imgArr[index][0], imgArr[index][1], imgArr[index][2]);
        rect(width/2-WIDTH/2+rectWidth/2+rectWidth*i, height/2, rectWidth, rectHeight);
      }
  }
  noLoop();
}
