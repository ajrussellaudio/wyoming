function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  console.log("p5 loaded!");
}

function draw() {
  background("#EB285F");
  stroke(255);
  for (let i = 0; i < 80; i++) {
    strokeWeight(int(random(20)));
    const x = randomGaussian(width / 2, width / 8);
    const y = randomGaussian(height / 2, height / 8);
    point(x, y);
  }
}
