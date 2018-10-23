let mountains;
let sky;

// foreground colours: #570335, #33152D

function setup() {
  const canvas = createCanvas(window.innerWidth, window.innerHeight / 2);
  canvas.parent("#sketch");
  noStroke();
  const colours = ["#FF864F", "#FF7344", "#FB463E", "#C9253E", "#830034"];
  mountains = [];
  for (let i = 0; i < colours.length; i++) {
    mountains.push(new MountainsLayer(colours[i], i, colours.length));
  }
  sky = new Sky("#FFDCC5");
}

function draw() {
  sky.update();
  sky.draw();
  mountains.forEach(mountain => mountain.draw());
}

class MountainsLayer {
  constructor(colour, depth, count) {
    this.colour = colour;
    this.depth = depth + 1;
    this.initPoints(count);
    this.initTrees();
  }

  initPoints(count) {
    noiseSeed(random(138));
    const numPoints = int(
      random((count * 10) / this.depth, (count * 40) / this.depth)
    );
    const distance = map(this.depth, 0, count, height / 6, (height * 2) / 3);
    this.points = [];
    let offset = random();
    for (let i = 0; i < numPoints; i++) {
      offset += 0.1;
      const x = map(i, 0, numPoints - 1, 0, max(width, 640));
      const y = noise(offset) * 200 + distance;
      this.points.push(createVector(x, y));
    }
  }

  initTrees() {
    this.trees = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      const position = p5.Vector.lerp(
        this.points[i],
        this.points[i + 1],
        random()
      );
      const scale = random(2 ** this.depth - 2, 3 ** this.depth - 3);
      const offset = random(scale);
      const tree = new Tree(position, scale, offset);
      this.trees.push(tree);
    }
  }

  draw() {
    fill(this.colour);
    // stroke("white");
    beginShape();
    vertex(0, height);
    this.points.forEach(point => vertex(point.x, point.y));
    vertex(width, height);
    endShape();
    this.trees.forEach(tree => tree.draw());
  }
}

class Sky {
  constructor(colour) {
    this.colour = color(colour);
    const numClouds = random(50, 100);
    // const numClouds = 1;
    this.clouds = [];
    for (let i = 0; i < numClouds; i++) {
      this.clouds.push(
        new Cloud(random(width), random(height / 2), random(0.5), this.colour)
      );
    }
  }

  update() {
    this.clouds.forEach(cloud => cloud.move());
  }

  draw() {
    fill(this.colour);
    rect(0, 0, width, height);
    this.clouds.forEach(cloud => cloud.draw());
  }
}

class Cloud {
  constructor(x, y, speed, skyColour) {
    this.speed = speed;
    this.skyColour = skyColour;
    this.colour = lerpColor(skyColour, color("white"), random(0.5));
    this.particles = [];
    this.initParticles(x, y);
  }

  initParticles(x, y) {
    const numParticles = int(random(5, 50));
    for (let i = 0; i < numParticles; i++) {
      this.particles.push(
        createVector(
          x + random(-numParticles, numParticles),
          y + random(-numParticles, numParticles),
          random(60)
        )
      );
    }
    this.particles.sort((a, b) => a.y > b.y);
  }

  move() {
    this.particles.forEach(particle => {
      particle.add(-this.speed, 0);
    });
    if (this.particles.every(particle => particle.x < 0)) {
      this.initParticles(width + random(width), random(height));
    }
  }

  draw() {
    this.particles.forEach(({ x, y, z }) => {
      fill(lerpColor(this.skyColour, this.colour, 0.5));
      ellipse(x, y, z, z / 2);
      fill(this.colour);
      const offset = 1 / 8;
      const size = 3 / 4;
      ellipse(x - z * offset, y - z * offset, z * size, (z * size) / 2);
    });
  }
}

class Tree {
  constructor(position, scale, offset) {
    this.position = position;
    this.scale = scale;
    this.offset = offset;
    this.canopies = [];
    const canopyCount = random(9, 20);
    for (let i = 0; i < canopyCount; i++) {
      const tip = map(i, 0, canopyCount, -this.scale, -this.scale / 10);
      const base = map(i, 0, canopyCount, this.scale / 10, this.scale / 5);
      const width = (base * i) / canopyCount;
      const wobble = value =>
        value + random(-this.scale / 120, this.scale / 120);
      this.canopies.push({
        tip: createVector(0, tip),
        left: createVector(-wobble(width), wobble(base)),
        right: createVector(wobble(width), wobble(base))
      });
    }
  }

  draw() {
    const drawTrunk = () => {
      const tip = -this.scale;
      const baseWidth = this.scale / 50;
      const baseHeight = this.scale / 10;
      triangle(0, tip, baseWidth, baseHeight, -baseWidth, baseHeight);
    };
    push();
    translate(this.position.x, this.position.y + this.offset);
    this.canopies.forEach(canopy => {
      push();
      translate(canopy.tip.x, canopy.tip.y);
      triangle(
        0,
        0,
        canopy.left.x,
        canopy.left.y,
        canopy.right.x,
        canopy.right.y
      );
      pop();
    });
    drawTrunk();
    pop();
  }
}
