function winGame(){
  background(255,255,0);
  image(backgroundWin, 0,0);

  if (mouseIsPressed) {
    gameState = "PLAY";
    musicPlayer(playMusic, winMusic);
    resetGame();
  }
  // var s = "You WIN!!!";
  // textAlign(CENTER);
  // textSize(18);
  // fill(0, 0, 255);
  // text(s, width/2, height/2);
  // s = "I am glad you did not follow directions.\nAgain?";
  // textSize(14);
  // text(s, width/2, height/2+30);

}
