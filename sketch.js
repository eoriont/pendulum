var pendulum;
var lastGraphPos, graphPos;
function setup() {
  createCanvas(500, 1000);

  pendulum = new MultiPendulum(250, 50, 2, [0, 0], [1, 1]);

  lastGraphPos = {x: frameCount, y: 450}
  graphPos = {x: frameCount, y: 450}
}
var mass = .01;

function draw() {
  fill(50);
  rect(0, 0, 500, 500);
  pendulum.x = mouseX;
  pendulum.y = mouseY;

  pendulum.tick();
  pendulum.render();

  lastGraphPos = graphPos;
  graphPos = {x: map(pendulum.pendulumPoss[0].angle, 0, 30, 0, 500), y: map(pendulum.pendulumPoss[0].velo, -1, 1, 500, 1000)};

  fill(0)
  line(lastGraphPos.x, lastGraphPos.y, graphPos.x, graphPos.y)
}

class MultiPendulum {
  constructor(x, y, pendulums, angles, radii) {
    this.x = x;
    this.y = y;
    this.angles = angles;
    this.radii = radii;

    this.pendulums = pendulums;
    this.pendulumPoss = []
    this.lastPendulumPoss = [];
    this.lastParentPen = {x, y}

    this.mass = .01;
    this.grav = 2;

    this.xdx = 0;
    this.ydy = 0;

    for (let i = 0; i < this.pendulums; i++) {
      this.pendulumPoss.push({x: 0, y: 0, accel: 0, velo: 0, angle: angles[i]});
      this.lastPendulumPoss.push({x: 0, y: 0, accel: 0, velo: 0, angle: angles[i]});
    }
  }

  tick() {
    var t = 60;

    for (let i = 0; i < this.pendulums; i++) {
      let parentPen = this.pendulumPoss[i-1];
      if (parentPen == null) {
        parentPen = {x: this.x, y: this.y};
      }
      let lastParentPen = this.lastPendulumPoss[i-1];
      if (lastParentPen == null) {
        lastParentPen = {x: this.lastParentPen.x, y: this.lastParentPen.y, dx: this.xdx, dy: this.ydy};
        this.xdx = this.x - lastParentPen.x;
        this.ydy = this.y - lastParentPen.y;
      }
      let pos = this.pendulumPoss[i];
      let lastPos = this.lastPendulumPoss[i];
      let radius = this.radii[i];

      var t2r = sq(t)*radius;

      var dx = parentPen.x - lastParentPen.x;
      var lvx = dx - lastParentPen.dx;
      var fx = (dx-(lvx))/t2r;


      var dy = parentPen.y - lastParentPen.y;
      var lvy = dy - lastParentPen.dy;
      var fy = (dy-(lvy))/t2r;

      var anchorForce = fx*cos(pos.angle) - fy*sin(pos.angle)

      var paccel = -this.grav * this.mass * sin(pos.angle);
      var drag = -this.pendulumPoss[i].velo * .01;

      this.pendulumPoss[i].accel = paccel + drag + anchorForce;

      this.pendulumPoss[i].velo += this.pendulumPoss[i].accel;
      this.pendulumPoss[i].angle += this.pendulumPoss[i].velo

      this.lastPendulumPoss[i].x = pos.x;
      this.lastPendulumPoss[i].y = pos.y;
      this.lastPendulumPoss[i].dx = dx;
      this.lastPendulumPoss[i].dy = dy;
      this.pendulumPoss[i].x = 100* radius * cos(pos.angle+HALF_PI) + parentPen.x
      this.pendulumPoss[i].y = 100* radius * sin(pos.angle+HALF_PI) + parentPen.y;


    }
    this.lastParentPen = {x: this.x, y: this.y};
  }

  render() {
    var half = 25//this.mass * 25
    fill(255,0 ,0);
    ellipse(this.x, this.y, half, half);
    for (let i = 0; i < this.pendulums; i++) {
      let parentPen = this.pendulumPoss[i-1];
      if (parentPen == null) {
        parentPen = {x: this.x, y: this.y};
      }
      let pendulum = this.pendulumPoss[i];
      var radius = this.radii[i];
      var x = 100 * radius * cos(pendulum.angle+HALF_PI) + parentPen.x
      var y = 100 * radius * sin(pendulum.angle+HALF_PI) + parentPen.y;

      line(parentPen.x, parentPen.y, x, y);
      fill(0, 255, 0)
      ellipse(x, y, half, half);
    }

  }
}
