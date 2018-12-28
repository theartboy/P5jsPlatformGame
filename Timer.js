function Timer(timeInterval) {
  this.interval = timeInterval;
  this.startTime = millis();

  this.start = function() {
    this.startTime = millis();
  }

  this.complete = function() {
    //notice the local var to this function. Using it doesn't require THIS
    var elapsedTime = millis() - this.startTime;
    if (elapsedTime > this.interval) {
      return true;
    } else {
      return false;
    }
  }
}
