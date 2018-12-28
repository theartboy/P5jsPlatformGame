function loseGame(){
  background(50,200,50);
  image(backgroundLose,0,0);

  if (mouseIsPressed) {
    gameState = "PLAY";
    musicPlayer(playMusic, loseMusic);
    resetGame();
  }
  // var s = "Ha! You LOSE!!!";
  // textAlign(CENTER);
  // textSize(18);
  // fill(0, 255, 0);
  // text(s, width/2, height/2);
  // s = "That is what you get for following directions.\nAgain?";
  // textSize(14);
  // text(s, width/2, height/2+30);

}
