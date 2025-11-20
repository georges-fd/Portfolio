class TileDisplay {
  constructor(img, rotation, x, y, w, h) {
    this.tileDisplay = img;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.rotation = rotation;

    const sigs = img.sigs.get(rotation);
    this.topEdge = sigs[0];
    this.rightEdge = sigs[1];
    this.bottomEdge = sigs[2];
    this.leftEdge = sigs[3];

    if (debugMode) {
      console.log("Image Coord. ", x, y);
    }
  }

  draw() {
    push();
    translate((this.x * this.w) + this.w / 2, (this.y * this.h) + this.h / 2);
    rotate((PI / 2.0) * this.rotation * -1);
    image(this.tileDisplay.img, 0, 0, this.w, this.h);
    pop();
  }
}
