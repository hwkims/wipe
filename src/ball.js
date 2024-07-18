import { Vector2 } from "./vector2.js";

const images = [
  'Etc_3328.png',
  'Etc_3329.png',
  'Etc_3338.png',
  'Etc_3339.png',
  'Etc_3341.png',
  'Etc_3342.png',
  'Etc_3343.png',
  'Etc_3344.png',
];

export class Ball {
    constructor(pos, r) {
        this.pos = pos;
        this.r = r;
        this.mass = r;
        this.v = new Vector2(0, 0);
        this.image = new Image();
        this.image.src = getRandomImage();
        this.angle = 0; // new property to store the rotation angle
        this.angularVelocity = 0; // new property to store the angular velocity
      }

  addForce(f) {
    this.v = this.v.addV(f.divS(this.mass));
  }

  update(stepDivision) {
    this.pos = this.pos.addV(this.v.divS(stepDivision));
    this.angle += this.angularVelocity; // update the rotation angle
  }

  updateFriction(friction) {
    this.v = this.v.mulS(friction);
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = true; // 이미지 스무딩 끄기
    ctx.save(); // save the current transformation matrix
    ctx.translate(this.pos.x, this.pos.y); // translate to the ball's position
    ctx.rotate(this.angle); // rotate by the ball's angle
    ctx.drawImage(this.image, -this.r, -this.r, this.r * 2, this.r * 2);
    ctx.restore(); // restore the original transformation matrix
  }

  // New methods for physical effects
  applyGravity(gravity) {
    this.addForce(new Vector2(0, gravity));
  }

  checkCollision(ball) {
    const distance = this.pos.distance(ball.pos);
    if (distance < this.r + ball.r) {
      this.resolveCollision(ball);
    }
  }

  resolveCollision(ball) {
    const normal = this.pos.subV(ball.pos).normalize();
    const impulse = this.v.subV(ball.v);
    const j = impulse.dotV(normal);
    j = j / (1 / this.mass + 1 / ball.mass);
    const impulseVector = normal.mulS(j);
    this.v = this.v.subV(impulseVector.mulS(1 / this.mass));
    ball.v = ball.v.addV(impulseVector.mulS(1 / ball.mass));
  }
}

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

// Example usage:
const balls = [];
for (let i = 0; i < 10; i++) {
  balls.push(new Ball(new Vector2(Math.random() * 400, Math.random() * 400), 20));
  balls[i].angularVelocity = Math.random() * 0.1 - 0.05; // random angular velocity
}

function update() {
  for (const ball of balls) {
    ball.applyGravity(0.1);
    ball.update(1);
    ball.updateFriction(0.99);
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkCollision(balls[j]);
    }
  }
}

function render(ctx) {
  ctx.clearRect(0, 0, 400, 400);
  for (const ball of balls) {
    ball.render(ctx);
  }
}

// Call update and render functions repeatedly
setInterval(() => {
  update();
  render(ctx);
}, 16); // 16ms = 60fps