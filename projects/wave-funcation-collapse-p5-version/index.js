const assetsPath = "assets";
const tileSize = 25;
let next = false;
let debugMode = false;
let slowMode = false;
let tilesPerFrame = 20;

let grid;
let tileImages = [];
let imageFiles = ['0.png', '1.png'];
let preloadedImages = {};

function preload() {
    for (let filename of imageFiles) {
        preloadedImages[filename] = loadImage(`${assetsPath}/${filename}`);
    }
}

function resetSimulation() {
    grid.reset();
}

function setup() {
    createCanvas(501, 501);
    imageMode(CENTER);
    textSize(17);

    let initializer = new TilesInitializer(assetsPath);
    tileImages = initializer.getTiles();
    grid = new Grid(tileSize, tileImages);
}


function draw() {

    grid.show();
    grid.drawTiles();
    grid.processTiles();

}

function mousePressed() {

    if (debugMode) {
        next = true;
        console.log("next");

    } else {
        resetSimulation();
    }

}

