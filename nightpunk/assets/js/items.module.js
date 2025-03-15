class Items {
  constructor(items) {
    this.items = items;
  }

  initialize() {
    this.update();
  }

  update() {
    for (let item of this.items) {
      if (!item.collected) {
        ctx.fillStyle = "red";
        ctx.fillRect(
          item.position.x * gameConfig.global.tileSize,
          item.position.y * gameConfig.global.tileSize,
          item.width,
          item.height
        );
      }
    }
    player.isCollidingWithItem();
  }
}
