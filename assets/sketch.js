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
    fill(this.colour);
    beginShape();
    vertex(0, height);
    const distance = map(
      this.depth,
      0,
      this.count,
      height / 6,
      (height * 2) / 3
    );
    for (let i = 0; i < this.points.length; i++) {
      const x = map(i, 0, this.points.length - 1, 0, width);
      const y = map(this.points[i], 0, 1, 0, 200) + distance;
      vertex(x, y);
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
