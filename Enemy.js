function Enemy(p) {
  this.w = 48;
  this.h = 48;
  this.halfWidth = this.w / 2;
  this.halfHeight = this.h / 2;
  this.x = p.x + p.w / 2 - this.halfWidth;
  this.y = p.y - this.h - 100;

  this.leftEdge = p.x;
  this.rightEdge = p.x + p.w;
  this.ground = p.y;

  this.vx = (random(10) < 5) ? -1 : 1;
  this.vy = 0;
  this.accelerationX = 0;
  this.accelerationY = 0;
  this.speedLimit = 10;
  //isOnGround = false;
  this.jumpForce = -10;

  //world values
  this.friction = 0.96;
  this.bounce = -0.7;
  this.gravity = .3;


  //collisionSide = "";
  this.currentFrame = 0;
  this.facingRight = true;
  this.frameSequence = 6; //number of frames in each animation sequence
  this.frameOffset = 0;

  this.c = color(255);
  this.dead = false;


  this.update = function() {
    this.vy += this.gravity;

    ////correct for maximum speeds
    //need to let gravity ramp it up
    if (this.vy > 3 * this.speedLimit) {
      this.vy = 3 * this.speedLimit;
    }
    //correct minimum speeds
    if (abs(this.vy) < 0.2) {
      this.vy = 0;
    }

    this.x = max(0, min(this.x + this.vx, this.rightEdge - this.w));
    this.y = max(0, min(this.y + this.vy, this.ground - this.h));

    this.checkBoundaries();
  }

  this.deathJump = function() {
    this.vy = this.jumpForce;
    this.vx = 0;
    this.dead = true;
    this.ground = gameWorld.h;
  }

  this.checkBoundaries = function() {
    ////check boundaries
    ////left
    if (this.x <= this.leftEdge) {
      this.vx *= -1;
      //accelerationX *= -1;
      this.x = this.leftEdge;
    }
    //// right
    if (this.x >= this.rightEdge - this.w) {
      this.vx *= -1;
      //accelerationX *= -1;
      this.x = this.rightEdge - this.w;
    }
    ////ground
    if (this.y >= this.ground - this.h) {
      if (this.vy < 1) {
        this.vy = 0;
      } else {
        //reduced bounce for floor bounce
        this.vy *= this.bounce / 2;
      }
      this.y = this.ground - this.h;
    }
  }

  this.reset = function(p) {
    this.x = p.x + p.w / 2 - this.halfWidth;
    this.y = p.y - this.h - 100;

    this.leftEdge = p.x;
    this.rightEdge = p.x + p.w;
    this.ground = p.y;

    this.vx = (random(10) < 5) ? -1 : 1;
    this.dead = false;
  };


  this.display = function() {
    fill(255, 255, 0);
    rect(this.x, this.y, this.w, this.h);
  }
}
