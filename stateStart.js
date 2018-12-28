function startGame() {
  background(128);
  image(backgroundStart, 0, 0);

  if (mouseIsPressed) {
    gameState = "PLAY";
    musicPlayer(playMusic, startMusic);

  }
  // var s = "Click to Play!!!";
  // textAlign(CENTER);
  // textSize(18);
  // fill(255, 0, 0);
  // text(s, width / 2, height / 2);
  // s = "Shoot the enemies.\nAvoid the ground.";
  // textSize(14);
  // text(s, width / 2, height / 2 + 30);

}
