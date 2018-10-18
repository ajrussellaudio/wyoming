function setup() {
  createCanvas(400, 400);
  background("pink");

  const tree = new Tree(width / 2, height, width / 2, height / 2, "red");
  tree.draw();
}

class Tree {
  constructor(posX, posY, x, y, colour) {
    this.position = createVector(posX, posY);
    this.size = createVector(x, y);
    this.colour = colour;
  }

  draw() {
    fill(this.colour);
    noStroke();
    const { x, y } = this.size;
    push();
    translate(this.position.x, this.position.y);
    triangle(0, (-y * 3) / 4, x / 5, -y / 50, -x / 5, -y / 50);
    rect(-x / 50, -y / 50, x / 20, y / 20);
    pop();
  }
}
