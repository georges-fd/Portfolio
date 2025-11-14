class Utils {

  static sigsColorMap = new Map();
  static colorIndex = 65;

  static HORIZONTAL = 0;
  static VERTICAL = 1;


  static getMappedColor(hexValue) {
    if (!Utils.sigsColorMap.has(hexValue)) {
      Utils.sigsColorMap.set(hexValue, String.fromCharCode(Utils.colorIndex++));
    }
    return Utils.sigsColorMap.get(hexValue);
  }

  static printArr(arr) {
    console.log(arr.join(" _ "));
  }

  static generateImageSig(img) {
    let sigArray = ["", "", "", ""];
    img.loadPixels();

    //Top Edge
    for (let i = 0; i < img.width; i++) {
      sigArray[0] += Utils.getMappedColor(JSON.stringify(img.get(i, 0)));
    }

    //Right Edge
    for (let i = 0; i < img.height; i++) {
      sigArray[1] += Utils.getMappedColor(JSON.stringify(img.get(img.width - 1, i)));
    }

    //Bottom Edge
    for (let i = img.width - 1; i >= 0; i--) {
      sigArray[2] += Utils.getMappedColor(JSON.stringify(img.get(i, img.height - 1)));
    }

    //Left Edge
    for (let i = img.height - 1; i >= 0; i--) {
      sigArray[3] += Utils.getMappedColor(JSON.stringify(img.get(0, i)));
    }

    return sigArray;
  }

  static flipImage(img, direction) {
    let imgCpy = createImage(img.width, img.height);
    imgCpy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

    imgCpy.loadPixels();

    switch (direction) {
      case Utils.HORIZONTAL:
        for (let y = 0; y < imgCpy.height; y++) {
          for (let x = 0; x < imgCpy.width / 2; x++) {
            let index1 = (x + y * imgCpy.width) * 4;
            let index2 = (imgCpy.width - 1 - x + y * imgCpy.width) * 4;
            for (let i = 0; i < 4; i++) {
              let temp = imgCpy.pixels[index1 + i];
              imgCpy.pixels[index1 + i] = imgCpy.pixels[index2 + i];
              imgCpy.pixels[index2 + i] = temp;
            }
          }
        }
        break;

      case Utils.VERTICAL:
        for (let y = 0; y < imgCpy.height / 2; y++) {
          for (let x = 0; x < imgCpy.width; x++) {
            let index1 = (x + y * imgCpy.width) * 4;
            let index2 = (x + (imgCpy.height - 1 - y) * imgCpy.width) * 4;
            for (let i = 0; i < 4; i++) {
              let temp = imgCpy.pixels[index1 + i];
              imgCpy.pixels[index1 + i] = imgCpy.pixels[index2 + i];
              imgCpy.pixels[index2 + i] = temp;
            }
          }
        }
        break;
    }
    imgCpy.updatePixels();
    return imgCpy;
  }
}
