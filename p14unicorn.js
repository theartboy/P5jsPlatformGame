//credits
//Bit Quest Kevin MacLeod (incompetech.com)
//Licensed under Creative Commons: By Attribution 3.0 License
//http://creativecommons.org/licenses/by/3.0/

var u;
var platforms = [];
var spriteImages = [];
var frames;

var left, right, up, down, space;
var camera, gameWorld;
var backImage;
var backgroundPlay, backgroundStart, backgroundWin, backgroundLose;
var headerImage;

var enemies = [];

var health;
var pHealth;

var firingTimer;
var bullets = [];
var nextBullet;

var a; //health warning strobe alpha value

//sounds
var playMusic, startMusic, loseMusic, winMusic;
var sfxDead;
var sfxDing;
var sfxHit;
var sfxJump;
var sfxShoot;

var gameState;
var score;
var enemiesDispatched;

function preload() {
  //sound stuff
  //sfx
  sfxDead = loadSound("data/sounds/dead.mp3");
  sfxDing = loadSound("data/sounds/ding.mp3");
  sfxHit = loadSound("data/sounds/hit.mp3");
  sfxJump = loadSound("data/sounds/jump.mp3");
  sfxShoot = loadSound("data/sounds/shoot.mp3");
  //background music
  playMusic = loadSound("data/sounds/bitQuest.mp3");
  startMusic = loadSound("data/sounds/dolsStart.mp3");
  winMusic = loadSound("data/sounds/psWin.mp3");
  loseMusic = loadSound("data/sounds/spLose.mp3");

  //set sound looping
  playMusic.setLoop(true);
  startMusic.setLoop(true);
  winMusic.setLoop(true);
  loseMusic.setLoop(true);
  //images
  backgroundPlay = loadImage("data/landscape.jpg");
  backgroundStart = loadImage("data/backgroundStart.png");
  backgroundLose = loadImage("data/backgroundLose.png");
  backgroundWin = loadImage("data/backgroundWin.png");
  headerImage = loadImage("data/logo.png");

  frames = 24;
  for (var i = 0; i < frames; i++) {
    spriteImages[i] = loadImage("data/unicorn" + nf(i + 1, 4) + ".png");
  }
}

function setup() {
  createCanvas(800, 600);

  left = false;
  right = false;
  up = false;
  down = false;
  space = false;

  backImage = new ImageObject(0, 0, 1156, 768, backgroundPlay);
  gameWorld = new FrameObject(0, 0, backImage.w * 2, backImage.h);
  camera = new FrameObject(0, 0, width, height - 100); //100 shift is for upper UI elements

  camera.x = (gameWorld.x + gameWorld.w / 2) - camera.w / 2;
  camera.y = (gameWorld.y + gameWorld.h / 2) - camera.h / 2;


  //unicorn values
  u = new Unicorn();

  //ground of doom
  platforms[0] = new Platform(0, gameWorld.h - 20, gameWorld.w, 25, "death");

  platforms[1] = new Platform(300, 150, 200, 25, "safe");
  platforms[2] = new Platform(824, 150, 200, 25, "safe");
  platforms[3] = new Platform(0, 300, 200, 25, "safe");
  platforms[4] = new Platform(600, 300, 200, 25, "safe");
  platforms[5] = new Platform(824, 450, 200, 25, "safe");
  platforms[6] = new Platform(300, 450, 200, 25, "death");
  platforms[7] = new Platform(0, 600, 200, 25, "safe");
  platforms[8] = new Platform(600, 600, 200, 25, "safe");

  ////number of enemies is one less than all the platforms because the ground doesn't need one
  for (var i = 1; i < platforms.length; i++) {
    enemies[i - 1] = new Enemy(platforms[i]);
  }

  health = 100;
  pHealth = health;

  var numberOfBullets = 100;
  for (var i = 0; i < numberOfBullets; ++i) {
    bullets[i] = new Bullet();
  }
  nextBullet = 0;

  firingTimer = new Timer(200);
  score = 0;
  enemiesDispatched = 0;

  //shift next lines to appropriate state function once states are implemented
  gameState = "START";
  firingTimer.start();
  // resetGame();
  // startMusic.jump(0);
  musicPlayer(startMusic, playMusic);
  // music.play();
  //use .jump(0) to reset sound file play
}

function draw() {
  background(255);
  if (gameState == "START") {
    startGame();
  } else if (gameState == "PLAY") {
    playGame();
  } else if (gameState == "WIN") {
    winGame();
  } else if (gameState == "LOSE") {
    loseGame();
  }
}

function resetGame() {
  for (var i = 1; i < platforms.length; i++) {
    enemies[i - 1].reset(platforms[i]);
  }
  u.reset();
  score = 0;
  enemiesDispatched = 0;
  health = 100;
}


function musicPlayer(musicOn, musicOff) {
  musicOff.stop();
  // musicOff.jump(0);
  musicOn.jump();
  // musicOn.play();
}

function rectangleCollisionPvE(r1, r2) {
  ////r1 is the player
  ////r2 is the enemy

  var dx = (r1.x + r1.w / 2) - (r2.x + r2.w / 2);
  var dy = (r1.y + r1.h / 2) - (r2.y + r2.h / 2);

  var combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  var combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  if (abs(dx) < combinedHalfWidths) {
    ////collision has happened on the x axis
    ////now check on the y axis
    if (abs(dy) < combinedHalfHeights) {
      ////collision detected
      return true;
    }
  }
  return false;
}

function rectangleCollisionBvE(r1, r2) {
  ////r1 is the player
  ////r2 is the enemy

  var dx = (r1.x + r1.w / 2) - (r2.x + r2.w / 2);
  var dy = (r1.y + r1.h / 2) - (r2.y + r2.h / 2);

  var combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  var combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  if (abs(dx) < combinedHalfWidths) {
    ////collision has happened on the x axis
    ////now check on the y axis
    if (abs(dy) < combinedHalfHeights) {
      ////collision detected
      return true;
    }
  }
  return false;
}


function rectangleCollisions(r1, r2) {
  ////r1 is the player
  ////r2 is the platform rectangle
  ////function returns the String collisionSide

  //allow unicorn to pass through platforms.
  //Disable if you want unicorn to bounce off bottom of platforms

  if (r1.vy < 0) {
    return "none";
  }

  var dx = (r1.x + r1.w / 2) - (r2.x + r2.w / 2);
  var dy = (r1.y + r1.h / 2) - (r2.y + r2.h / 2);

  var combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  var combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  if (abs(dx) < combinedHalfWidths) {
    ////collision has happened on the x axis
    ////now check on the y axis
    if (abs(dy) < combinedHalfHeights) {
      ////collision detected
      //determine the overlap on each axis
      var overlapX = combinedHalfWidths - abs(dx);
      var overlapY = combinedHalfHeights - abs(dy);
      ////the collision is on the axis with the
      ////SMALLEST overlap
      if (overlapX >= overlapY) {
        if (dy > 0) {
          ////move the rectangle back to eliminate overlap
          ////before calling its display to prevent
          ////drawing object inside each other
          r1.y += overlapY;
          return "top";
        } else {
          r1.y -= overlapY;
          return "bottom";
        }
      } else {
        if (dx > 0) {
          r1.x += overlapX;
          return "left";
        } else {
          r1.x -= overlapX;
          return "right";
        }
      }
    } else {
      //collision failed on the y axis
      return "none";
    }
  } else {
    //collision failed on the x axis
    return "none";
  }
}

function displayUI() {
  // fill(0);
  // rect(0, 0, camera.w, 100);
  image(headerImage,0,0);
  //String s = "\nvx: "+u.vx+"  vy: ";
  //text(s, 50, 50);
  fill(255);
  var s = "health: " + floor(health) + "        score: " + score +"    dispatched: "+enemiesDispatched;
  textAlign(LEFT);
  text(s, 40, 50);

  //draw health bar
  fill(255, 0, 0);
  rect(20, 10, health * 5, 10);
}

function keyPressed() {
  switch (keyCode) {
    case 37: //left
      left = true;
      break;
    case 39: //right
      right = true;
      break;
    case 38: //up
      up = true;
      break;
    case 40: //down
      down = true;
      break;
    case 32: //space
      space = true;
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
    case 37: //left
      left = false;
      break;
    case 39: //right
      right = false;
      break;
    case 38: //up
      up = false;
      break;
    case 40: //down
      down = false;
      break;
    case 32: //space
      space = false;
      break;
  }
}
