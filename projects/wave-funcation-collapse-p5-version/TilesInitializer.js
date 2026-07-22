class TilesInitializer {

  getTiles() {
    let tiles = [];

    for (let filename of imageFiles) {
      this.addImage(tiles, preloadedImages[filename]);
    }

    let orgSize = tiles.length;

    for (let i = tiles.length - 1; i >= 0; i--) {
      let tileImage = tiles[i];
      this.addImage(tiles, Utils.flipImage(tileImage.img, Utils.HORIZONTAL));
      this.addImage(tiles, Utils.flipImage(tileImage.img, Utils.VERTICAL));
    }

    if (debugMode) {
      console.log(`
Bonus ${tiles.length - orgSize} Images!`);
    }

    return tiles;
  }

  addImage(tiles, img) {
    if (!this.doesSignatureExist(tiles, Utils.generateImageSig(img))) {
      tiles.push(new TileImage(img));
    }
  }

  doesSignatureExist(tiles, imgSigArr) {
    let imgSig = imgSigArr.join('');
    for (let tileImage2 of tiles) {
      for (let entry of tileImage2.sigs.entries()) {
        if (entry[1].join('') === imgSig) return true;
      }
    }
    return false;
  }
}
