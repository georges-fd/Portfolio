class Grid {
  constructor(tileSize, tilesImages) {
    this.tilesImages = tilesImages;
    this.tileSize = tileSize;

    this.w = width / tileSize;
    this.h = height / tileSize;
    this.tiles = Array(tileSize).fill(null).map(() => Array(tileSize).fill(null));

    this._TOP = 1;
    this._RIGHT = 2;
    this._BOTTOM = 3;
    this._LEFT = 4;

    this._x = 0;
    this._y = 0;
    this.count = 1;
  }

  reset() {
    this.tiles = Array(this.tileSize).fill(null).map(() => Array(this.tileSize).fill(null));
    this._x = 0;
    this._y = 0;
    this.count = 1;
  }

  show() {
    background(255);
    stroke(200);

    if (!debugMode) return;

    for (let i = 0; i <= width + this.w; i += this.w) {
      line(i, 0, i, height);
    }

    for (let i = 0; i <= height + this.h; i += this.h) {
      line(0, i, width, i);
    }
  }

  drawTiles() {
    for (let y = 0; y < this.tileSize; y++) {
      for (let x = 0; x < this.tileSize; x++) {
        if (this.tiles[x][y] != null) {
          this.tiles[x][y].draw();
        }
      }
    }
  }

  processTiles() {
    if (debugMode) {
      if (!next) return;
      next = false;

      console.log(`Iteration: ${this.count++}`);
      if (this.tiles[this._x][this._y] == null) {
        this.tiles[this._x][this._y] = this.pickTile(this._x, this._y);
      }

      this._x++;
      if (this._x >= this.tileSize) {
        this._x = 0;
        this._y++;
        if (this._y >= this.tileSize) {
          this._y = 0;
        }
      }
      return;
    }

    if (slowMode) {
      // Stop if we've filled the grid
      if (this._y >= this.tileSize) return;

      for (let i = 0; i < tilesPerFrame; i++) {
        if (this.tiles[this._x][this._y] == null) {
          this.tiles[this._x][this._y] = this.pickTile(this._x, this._y);
        }

        this._x++;
        if (this._x >= this.tileSize) {
          this._x = 0;
          this._y++;
          if (this._y >= this.tileSize) {
            return; // Grid is full
          }
        }
      }
    } else { // Original fast mode
      for (let y = 0; y < this.tileSize; y++) {
        for (let x = 0; x < this.tileSize; x++) {
          if (this.tiles[x][y] != null) continue;
          this.tiles[x][y] = this.pickTile(x, y);
        }
      }
    }
  }

  pickTile(x, y) {
    let neighboursEdges = this.getNeighboursEdges(x, y);
    let validCombs = [];

    if (debugMode) {
      console.log("neighbours Sigs: ");
      Utils.printArr(neighboursEdges);
    }

    for (let i = 0; i < this.tilesImages.length; i++) {
      let t = this.tilesImages[i];
      for (let [rot, sigs] of t.sigs.entries()) {
        if (this.isValidSide(sigs, neighboursEdges)) {
          validCombs.push(`${i}-${rot}`);
        }
      }
    }

    if (debugMode) {
      console.log(`Valid Combs Size: ${validCombs.length} `);
      for (let s of validCombs) {
        console.log(s + " ");
      }
      console.log();
    }

    if (validCombs.length === 0) return null;

    let randomIndex = floor(random(validCombs.length));
    let chosenOne = validCombs[randomIndex];
    let data = chosenOne.split("-");
    if (debugMode) {
      console.log("Chosen One: " + chosenOne);
    }
    return new TileDisplay(this.tilesImages[parseInt(data[0])], parseInt(data[1]), x, y, this.w, this.h);
  }

  isValidSide(sigs, neighboursEdges) {
    let isValid = true;
    for (let i = 0; i < neighboursEdges.length; i++) {
      if (neighboursEdges[i] === "") continue;
      isValid = isValid && neighboursEdges[i] === sigs[i].split('').reverse().join('');
    }
    return isValid;
  }

  getTileSig(x, y, edge) {
    if (x < 0 || y < 0 || x >= this.tileSize || y >= this.tileSize || this.tiles[x][y] == null) return "";

    switch (edge) {
      case this._TOP:
        return this.tiles[x][y].topEdge;
      case this._BOTTOM:
        return this.tiles[x][y].bottomEdge;
      case this._RIGHT:
        return this.tiles[x][y].rightEdge;
      case this._LEFT:
        return this.tiles[x][y].leftEdge;
      default:
        return "";
    }
  }

  getNeighboursEdges(x, y) {
    return [
      this.getTileSig(x, y - 1, this._BOTTOM),
      this.getTileSig(x + 1, y, this._LEFT),
      this.getTileSig(x, y + 1, this._TOP),
      this.getTileSig(x - 1, y, this._RIGHT)
    ];
  }
}
