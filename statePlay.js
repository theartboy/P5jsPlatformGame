function playGame() {
  pHealth = health;

  ////unicorn
  u.update();
  for (var i = 0; i < platforms.length; ++i) {
    u.collisionSide = rectangleCollisions(u, platforms[i]);

    if (u.collisionSide != "none" && platforms[i].typeof == "death") {
      health -= 0.1; //lower health when on the bad platform
    }
    //change the uni color when on the ground
    if (pHealth > health) {
      u.c = color(255, 0, 0);
    } else {
      u.c = color(255);
    }
    u.checkPlatforms();
  }

  ////enemies
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].update();
    if (rectangleCollisionPvE(u, enemies[i]) && !enemies[i].dead) {
      enemies[i].deathJump();
      health -= 20;
      enemiesDispatched++;
      // playSFX(sfxDead, true);
      sfxDead.play();
    }
  }

  ////bullets
  if (space) {
    if (firingTimer.complete()) {
      // playSFX(sfxShoot, false);
      sfxShoot.play();
      bullets[nextBullet].fire(u.x, u.y, u.w, u.facingRight);
      nextBullet = (nextBullet + 1) % bullets.length;
      firingTimer.start();
    }
  }
  for (var i = 0; i < bullets.length; ++i) {
    bullets[i].update();
    for (var j = 0; j < enemies.length; j++) {
      if (rectangleCollisionBvE(bullets[i], enemies[j]) && !enemies[j].dead) {
        enemies[j].deathJump();
        bullets[i].reset();
        health += 20;
        score++;
        enemiesDispatched++;
        // playSFX(sfxDing, true);
        sfxDing.play();
      }
    }
  }


  //Move the camera
  camera.x = floor(u.x + (u.halfWidth) - (camera.w / 2));
  camera.y = floor(u.y + (u.halfHeight) - (camera.h / 2));

  //Keep the camera inside the gameWorld boundaries
  if (camera.x < gameWorld.x) {
    camera.x = gameWorld.x;
  }
  if (camera.y < gameWorld.y) {
    camera.y = gameWorld.y;
  }
  if (camera.x + camera.w > gameWorld.x + gameWorld.w) {
    camera.x = gameWorld.x + gameWorld.w - camera.w;
  }
  if (camera.y + camera.h > gameWorld.h) {
    camera.y = gameWorld.h - camera.h;
  }

  push();
  translate(-camera.x, -camera.y + 100); //downward shift is for UI elements

  backImage.display();
  u.display();

  for (var i = 0; i < platforms.length; ++i) {
    platforms[i].display();
  }
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].display();
  }
  for (var i = 0; i < bullets.length; ++i) {
    if (bullets[i].inMotion){
      bullets[i].display();
    }
  }

  pop();

  displayUI();

  //danger overlay
  //strobe BG overlay if touching ground
  if (u.y >= platforms[0].y - u.h) {
    // fill(255, 0, 0, a/10);
    fill('rgba(255,0,0,0.5)')
    rect(0, 100, camera.w, camera.h);
    //TODO:figure out strobing fill
    // a = ((a + 1) % 50)/50;
  }
  //check for win
  //cannot use score because enemies die with collisions and shooting
  if (enemiesDispatched == enemies.length){
    gameState = "WIN";
    musicPlayer(winMusic, playMusic);
  }
  //check for lose
  if (health <= 0) {
    //chage game state when implemented
    gameState = "LOSE";
    musicPlayer(loseMusic, playMusic);

  }
}
