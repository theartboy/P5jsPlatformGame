function Bullet() {
  this.w = 35;
  this.h = 10;
  this.x = 0;
  this.y = -this.h;
  this.halfWidth = this.w / 2;
  this.halfHeight = this.h / 2;
  this.vx = 0;
  this.vy = 0;
  this.inMotion = false;

  this.leftBound = 0;
  this.rightBound = 0;
  this.lowerBound = 0;
  this.upperBound = 0;

  this.fire = function(ux, uy, uw, ufacingRight) {
    if (!this.inMotion) {
      print("shoot")
      this.y = uy - 3;
      this.inMotion = true;
      if (ufacingRight == true) {
        this.vx = 15;
        this.x = ux + uw - 35; //shift starting point for laser to right side of unicorn
      } else {
        this.vx = -15;
        this.x = ux;
      }
    }
  }

  this.reset = function() {
    this.x = 0;
    this.y = -this.h;
    this.vx = 0;
    this.vy = 0;
    this.inMotion = false;
  }

  this.update = function() {
    if (this.inMotion) {
      this.x += this.vx;
      this.y += this.vy;
    }
    ////check boundaries
    this.rightBound = max(camera.w, u.x + u.halfWidth + camera.w / 2);
    this.leftBound = camera.x;
    this.upperBound = camera.y;
    this.lowerBound = max(camera.h, u.y + u.halfHeight + camera.h / 2);
    if (this.x < this.leftBound || this.x > this.rightBound || this.y < this.upperBound || this.y > this.lowerBound) {
      this.reset();
    }
  }

  this.display = function() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.w, this.h);
  }
}
