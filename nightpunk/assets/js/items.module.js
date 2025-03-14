class Item {
  constructor(name, label, pos) {
    this.name = name;
    this.label = label;
    this.pos = pos;
  }

  spawn() {
    // Draw item
    ctx.fillStyle = "red";
    console.log(this.pos.x, this.pos.y);
    ctx.fillRect(this.pos.x, this.pos.y, 50, 50);
  }
}
