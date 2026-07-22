class TileImage {
  constructor(img) {
    console.log();
    this.img = img;
    this.sigs = this.generateRotSigs();
  }

  generateRotSigs() {
    let sigs = new Map();
    let cpySig = this.copyArray(Utils.generateImageSig(this.img));

    if (this.hasSameEdges(cpySig)) {
      sigs.set(0, cpySig);
    } else {
      for (let i = 0; i < 4; i++) {
        if (debugMode) {
          console.log("Image All Sigs: ");
          Utils.printArr(cpySig);
        }
        sigs.set(i, cpySig);
        cpySig = this.rotateArray(cpySig);
      }
    }
    return sigs;
  }

  hasSameEdges(arr) {
    let joined = arr.join('');
    return joined.split(joined[0]).join('').length === 0;
  }

  rotateArray(arr) {
    let resArray = new Array(arr.length);
    for (let i = 0; i < arr.length - 1; i++) {
      resArray[i] = arr[i + 1];
    }
    resArray[arr.length - 1] = arr[0];
    return resArray;
  }

  copyArray(arr) {
    return [...arr];
  }
}
