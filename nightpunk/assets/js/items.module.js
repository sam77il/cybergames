class Items {
  constructor(items) {
    this.items = items;
  }

  initialize() {
    this.update();
  }

  setItems({ name, label, amount }) {
    this.items.push({
      name,
      label,
      amount,
      height: 50,
      width: 50,
      position: {
        x: Math.floor(
          (player.playerPosX + player.playerWidth) / gameConfig.global.tileSize
        ),
        y: Math.floor(
          (player.playerPosY + player.playerHeight) /
            gameConfig.global.tileSize -
            1
        ),
      },
    });
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
