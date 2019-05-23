// var pen1, pen2;
var pendulum;
var lastGraphPos, graphPos;
function setup() {
  createCanvas(500, 1000);

  // pen1 = new Pendulum(250, 50, 0, 100);
  // pen2 = new Pendulum(250, 50, 0, 100);
  pendulum = new MultiPendulum(250, 50, 1, [0], [100]);

  lastGraphPos = {x: frameCount, y: 450}
  graphPos = {x: frameCount, y: 450}
}
var mass = .01;

function draw() {
  // background(50);
  fill(50);
  rect(0, 0, 500, 500);
  // pen1.tick();
  // pen1.render();
  //
  // pen2.tick();
  // pen2.render();
  //
  // pen1.ax = 250;
  // pen1.ay = 100
  //
  // pen2.ax = pen1.px;
  // pen2.ay = pen1.py

  pendulum.x = mouseX;
  pendulum.y = mouseY;

  pendulum.tick();
  pendulum.render();

  lastGraphPos = graphPos;
  graphPos = {x: map(pendulum.pendulumPoss[0].angle, 0, 30, 0, 500), y: map(pendulum.pendulumPoss[0].velo, -1, 1, 500, 1000)};

  fill(0)
  line(lastGraphPos.x, lastGraphPos.y, graphPos.x, graphPos.y)
}

// var grav = 2;
// class Pendulum {
//   constructor(x, y, angle, r) {
//     this.ax = x; //anchorx
//     this.ay = y;
//     this.px = 0;
//     this.py = 0;
//     this.psize = 50;
//     this.radius = r;
//     this.angle = angle;
//     this.accel = 0;
//     this.velo = .4;
//     this.lastax = x;
//     this.lastay = y;
//   }
//
//   tick() {
//     var t = 60; //time
//
//     var lvx = 0; //linear velocity (x)
//     var dx = this.ax-this.lastax; //delta x
//     console.log(dx)
//     var fx = 100*(dx-(lvx*t))/(t*t*this.radius); //x force (angular)
//
//     var lvy = 0;
//     var dy = this.ay-this.lastay;
//     var fy = 100*(dy-(lvy*t))/(t*t*this.radius);
//
//     var anchorForce = fx + fy;
//
//     var paccel = -grav * mass * sin(this.angle);
//     var drag = this.velo * -.01
//     this.accel = paccel + drag + anchorForce;
//
//     this.velo += this.accel;
//
//     this.angle += this.velo;
//
//     this.px = this.radius * cos(this.angle+HALF_PI) + this.ax
//     this.py = this.radius * sin(this.angle+HALF_PI) + this.ay;
//
//     this.lastax = this.ax;
//     this.lastay = this.ay;
//   }
//
//   render() {
//     var half = this.psize/2
//     line(this.ax, this.ay, this.px, this.py);
//     fill(255,0 ,0);
//     ellipse(this.ax, this.ay, half, half);
//     fill(0, 255, 0)
//     ellipse(this.px, this.py, half, half);
//
//   }
// }

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
        lastParentPen = {x: this.x, y: this.y, dx: this.xdx, dy: this.ydy};
        // this.xdx = this.x - 
      }
      let pos = this.pendulumPoss[i];
      let lastPos = this.lastPendulumPoss[i];
      let radius = this.radii[i];

      var t2r = sq(t)*radius;

      var dx = parentPen.x - this.lastParentPen.x;
      var lvx = dx - lastParentPen.dx;
      var fx = (dx-(lvx*t))/t2r;


      var dy = parentPen.y - this.lastParentPen.y;
      var lvy = dy - lastParentPen.dy;
      var fy = (dy-(lvy*t))/t2r;

      var anchorForce = 100*(fx + fy);

      var paccel = -this.grav * this.mass * sin(pos.angle);
      var drag = -this.pendulumPoss[i].velo * .01;

      this.pendulumPoss[i].accel = paccel + drag + anchorForce;
      console.log(lvx)

      this.pendulumPoss[i].velo += this.pendulumPoss[i].accel;
      this.pendulumPoss[i].angle += pos.velo;

      this.lastPendulumPoss[i].x = pos.x;
      this.lastPendulumPoss[i].y = pos.y;
      this.lastPendulumPoss[i].dx = dx;
      this.lastPendulumPoss[i].dy = dy;
      this.pendulumPoss[i].x = radius * cos(pos.angle) + parentPen.x
      this.pendulumPoss[i].y = radius * sin(pos.angle) + parentPen.y;


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
      var x = radius * cos(pendulum.angle+HALF_PI) + parentPen.x
      var y = radius * sin(pendulum.angle+HALF_PI) + parentPen.y;

      line(parentPen.x, parentPen.y, x, y);
      fill(0, 255, 0)
      ellipse(x, y, half, half);
    }

  }
}
