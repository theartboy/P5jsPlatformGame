function ImageObject(_x, _y, _w, _h, _img) {
  this.w = _w;
  this.h = _h;
  this.x = _x;
  this.y = _y;
  this.img = _img;

  this.halfWidth = this.w / 2;
  this.halfHeight = this.h / 2;


  this.display = function() {
    fill(0, 0, 255, 128);
    // rect(this.x,this.y,this.w,this.h);
    image(this.img, this.x, this.y);
    image(this.img, this.x + this.w, this.y);
  }
}
