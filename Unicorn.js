function Unicorn() {
  this.w = 100; //was 140. shrink to be centered on body
  this.h = 65; //was 95. shrink to be centered on body
  this.x = gameWorld.w / 2 - this.w / 2;
  this.y = (gameWorld.y + gameWorld.h / 2) - this.h / 2;
  this.vx = 0;
  this.vy = 0;
  this.accelerationX = 0;
  this.accelerationY = 0;
  this.speedLimit = 10;
  this.isOnGround = false;
  this.jumpForce = -10;

  //world values
  this.friction = 0.96;
  this.bounce = -0.7;
  this.gravity = .3;

  this.halfWidth = this.w / 2;
  this.halfHeight = this.h / 2;

  this.collisionSide = "";
  this.currentFrame = 0;
  this.facingRight = true;
  this.frameSequence = 6; //number of frames in each animation sequence
  this.frameOffset = 0;

  this.c = color(255);


  this.update = function() {
    //start all moves off with friction at 1

    if (left && !right) {
      this.accelerationX = -0.2;
      this.friction = 1;
      this.facingRight = false;
    }
    if (right && !left) {
      this.accelerationX = 0.2;
      this.friction = 1;
      this.facingRight = true;
    }
    if (!left && !right) {
      this.accelerationX = 0;
    }

    if (up && !down && this.isOnGround) {
      //accelerationY = -0.2;
      //friction = 1;
      this.vy = this.jumpForce;
      this.isOnGround = false;
      //gravity = 0;
      this.friction = 1;
      // playSFX(sfxJump, true);
      sfxJump.play();
    }

    if (!up && down) {
      //accelerationY = 0.2;
      //friction = 1;
    }

    //removing impulse reintroduces friction
    if (!up && !down && !left && !right) {
      this.friction = 0.96;
      //gravity = 0.3;
    }

    this.vx += this.accelerationX;
    this.vy += this.accelerationY;

    //friction 1 = no friction
    this.vx *= this.friction;

    //apply gravity
    this.vy += this.gravity;

    ////correct for maximum speeds
    if (this.vx > this.speedLimit) {
      this.vx = this.speedLimit;
    }
    if (this.vx < -this.speedLimit) {
      this.vx = -this.speedLimit;
    }
    //need to let gravity ramp it up
    if (this.vy > 3 * this.speedLimit) {
      this.vy = 3 * this.speedLimit;
    }
    //don't need when jumping
    if (this.vy < -this.speedLimit) {
      this.vy = -this.speedLimit;
    }

    //correct minimum speeds
    if (abs(this.vx) < 0.2) {
      this.vx = 0;
    }

    if (abs(this.vy) < 0.2) {
      this.vy = 0;
    }

    ////move the player
    this.x = max(0, min(this.x + this.vx, gameWorld.w - this.w));
    this.y = max(0, min(this.y + this.vy, gameWorld.h - this.h));

    this.checkBoundaries();
    //checkPlatforms();
  }
  this.checkPlatforms = function() {
    ////update for platform collisions
    if (this.collisionSide == "bottom" && this.vy >= 0) {
      if (this.vy < 1) {
        this.isOnGround = true;
        this.vy = 0;
      } else {
        //reduced bounce for floor bounce
        this.vy *= this.bounce / 2;
      }
    } else if (this.collisionSide == "top" && this.vy <= 0) {
      this.vy = 0;
    } else if (this.collisionSide == "right" && this.vx >= 0) {
      vx = 0;
    } else if (this.collisionSide == "left" && this.vx <= 0) {
      this.vx = 0;
    }
    if (this.collisionSide != "bottom" && this.vy > 0) {
      this.isOnGround = false;
    }
  }

  this.checkBoundaries = function() {
    ////check boundaries
    ////left
    if (this.x <= 0) {
      this.vx *= this.bounce;
      this.x = 0;
      this.facingRight = !this.facingRight;
    }
    //// right
    if (this.x >= gameWorld.w - this.w) {
      this.vx *= this.bounce;
      this.x = gameWorld.w - this.w;
      this.facingRight = !this.facingRight;
    }
    ////top
    if (this.y <= 0) {
      this.vy *= this.bounce;
      this.y = 0;
    }
    //bottom
    if (this.y >= gameWorld.h - this.h) {
      if (this.vy < 1) {
        this.isOnGround = true;
        this.vy = 0;
      } else {
        //reduced bounce for floor bounce
        this.vy *= this.bounce / 2;
      }
      this.y = camera.h - this.h; //updated from "height"
    }
  }

  this.reset = function(){
    this.x = gameWorld.w / 2 - this.w / 2;
    this.y = (gameWorld.y + gameWorld.h / 2) - this.h / 2;
    this.vx = 0;
    this.vy = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.speedLimit = 10;
    this.isOnGround = false;
  }

  this.display = function() {
    fill(0, 255, 0, 128);
    rect(this.x, this.y, this.w, this.h);
    tint(this.c);
    if (this.facingRight) {
      if (abs(this.vx) > 0) {
        image(spriteImages[this.currentFrame + 0], this.x - 27, this.y - 27);
      } else {
        image(spriteImages[this.currentFrame + 12], this.x - 27, this.y - 27);
      }
    } else {
      if (abs(this.vx) > 0) {
        image(spriteImages[this.currentFrame + 6], this.x - 10, this.y - 27);
      } else {
        image(spriteImages[this.currentFrame + 18], this.x - 10, this.y - 27);
      }
    }
    if (this.isOnGround) {
      this.currentFrame = (this.currentFrame + 1) % this.frameSequence;
    } else {
      this.currentFrame = 0;
    }
    tint(255);
  }
}
