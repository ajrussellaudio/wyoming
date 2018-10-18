let mountains;
let sky;

// foreground colours: #570335, #33152D

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  const colours = ["#FF864F", "#FF7344", "#FB463E", "#C9253E", "#830034"];
  mountains = [];
  sky = new Sky("#FFDCC5");
  sky.draw();
  for (let i = 0; i < colours.length; i++) {
    mountains.push(new MountainsLayer(colours[i], i, colours.length));
  }
  mountains.forEach(mountain => mountain.draw());
}

class MountainsLayer {
  constructor(colour, depth, count) {
    this.colour = colour;
    this.depth = depth + 1;
    this.count = count;
    const numPoints = int(
      random((this.count * 10) / this.depth, (this.count * 40) / this.depth)
    );
    this.points = [];
    noiseSeed(random(138));
    let offset = random();
    for (let i = 0; i < numPoints; i++) {
      offset += 0.1;
      this.points.push(noise(offset));
    }
  }

  draw() {
    const distance = map(
      this.depth,
      0,
      this.count,
      height / 6,
      (height * 2) / 3
    );
    beginShape();
    vertex(0, height);

    for (let i = 0; i < this.points.length; i++) {
      fill(this.colour);
      noStroke();
      const x = i => map(i, 0, this.points.length - 1, 0, width);
      const y = i => map(this.points[i], 0, 1, 0, 200) + distance;
      vertex(x(i), y(i));
      const lerpScaleFactor = random();
      const treePosition = createVector(
        lerp(x(i), x(i + 1), lerpScaleFactor),
        lerp(y(i), y(i + 1), lerpScaleFactor)
      );
      const tree = new Tree(treePosition, 3 ** this.depth, this.colour);
      tree.draw();
    }
    vertex(width, height);
    endShape();
  }
}

class Sky {
  constructor(colour) {
    this.colour = colour;
  }

  draw() {
    fill(this.colour);
    rect(0, 0, width, height);
  }
}

class Tree {
  constructor(position, scale, colour) {
    this.position = position;
    this.scale = scale;
    this.colour = colour;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y + random(this.scale));
    triangle(
      0,
      (-this.scale * 3) / 4,
      this.scale / 5,
      -this.scale / 50,
      -this.scale / 5,
      -this.scale / 50
    );
    rect(-this.scale / 50, -this.scale / 50, this.scale / 20, this.scale / 20);
    pop();
  }
}
