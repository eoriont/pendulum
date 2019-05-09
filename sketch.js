var pen1, pen2;
var lastGraphPos, graphPos;
function setup() {
  createCanvas(500, 500);

  pen1 = new Pendulum(250, 50, 0, 100);

  lastGraphPos = {x: frameCount, y: 450}
  graphPos = {x: frameCount, y: 450}
}
var mass = .01;

function draw() {
  // background(50);
  fill(50);
  rect(0, 0, 500, 400);
  pen1.tick();
  pen1.render();

  pen1.ax = mouseX;
  pen1.ay = mouseY

  lastGraphPos = graphPos;
  graphPos = {x: map(pen1.angle, 0, 30, 0, 500), y: map(pen1.velo, -1, 1, 400, 500)};

  fill(0)
  line(lastGraphPos.x, lastGraphPos.y, graphPos.x, graphPos.y)
}

var grav = 2;
class Pendulum {
  constructor(x, y, angle, r) {
    this.ax = x; //anchorx
    this.ay = y;
    this.px = 0;
    this.py = 0;
    this.psize = 50;
    this.radius = r;
    this.angle = angle;
    this.accel = 0;
    this.velo = .4;
    this.lastax = x;
    this.lastay = y;
  }

  tick() {
    var t = 60; //time

    var lvx = 0; //linear velocity (x)
    var dx = this.ax-this.lastax; //delta x
    console.log(dx)
    var fx = 2*(dx-(lvx*t))/(t*t*this.radius); //x force (angular)

    var lvy = 0;
    var dy = this.ay-this.lastay;
    var fy = 2*(dy-(lvy*t))/(t*t*this.radius);

    var anchorForce = fx + fy;

    var paccel = -grav * mass * sin(this.angle);
    var drag = this.velo * -.01
    this.accel = paccel + drag + anchorForce;

    this.velo += this.accel;

    this.angle += this.velo;

    this.px = this.radius * cos(this.angle+HALF_PI) + this.ax
    this.py = this.radius * sin(this.angle+HALF_PI) + this.ay;

    this.lastax = this.ax;
    this.lastay = this.ay;
  }

  render() {
    var half = this.psize/2
    line(this.ax, this.ay, this.px, this.py);
    fill(255,0 ,0);
    ellipse(this.ax, this.ay, half, half);
    fill(0, 255, 0)
    ellipse(this.px, this.py, half, half);

  }
}
