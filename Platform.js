function Platform(_x, _y, _w, _h, _typeof) {
  this.w = _w;
  this.h = _h;
  this.x = _x;
  this.y = _y;
  this.typeof = _typeof;

  this.halfWidth = this.w / 2;
  this.halfHeight = this.h / 2;


  this.display = function() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.w, this.h);
  }
}
