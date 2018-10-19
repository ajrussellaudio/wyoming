function setup() {
  createCanvas(400, 400);
  background("pink");
  fill("black");
  const tree = new Tree(createVector(width / 2, height), width / 2, -100);
  tree.draw();
}

class Tree {
  constructor(position, scale, offset) {
    this.position = position;
    this.scale = scale;
    this.offset = offset;
  }

  draw() {
    const drawTrunk = () => {
      const tip = -this.scale;
      const baseWidth = this.scale / 50;
      const baseHeight = this.scale / 10;
      triangle(0, tip, baseWidth, baseHeight, -baseWidth, baseHeight);
    };
    const drawCanopy = (height, count) => {
      const tip = map(height, 0, count, -this.scale, -this.scale / 10);
      const base = map(height, 0, count, this.scale / 10, this.scale / 5);
      const width = (base * height) / count;
      const wobble = value => value + random(-this.scale / 80, this.scale / 80);
      push();
      translate(0, tip);
      triangle(0, 0, wobble(width), wobble(base), -wobble(width), wobble(base));
      pop();
    };
    push();
    translate(this.position.x, this.position.y + this.offset);
    const canopyCount = 12;
    for (let i = 0; i < canopyCount; i++) {
      drawCanopy(i, canopyCount);
    }
    drawTrunk();
    pop();
  }
}
