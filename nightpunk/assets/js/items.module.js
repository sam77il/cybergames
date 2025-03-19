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
          (game.player.playerPosX + game.player.playerWidth) /
            config.global.tileSize
        ),
        y: Math.floor(
          (game.player.playerPosY + game.player.playerHeight) /
            config.global.tileSize -
            1
        ),
      },
    });
  }

  update() {
    for (let item of this.items) {
      if (!item.collected) {
        game.canvas.mainCtx.fillStyle = "red";
        game.canvas.mainCtx.fillRect(
          item.position.x * config.global.tileSize,
          item.position.y * config.global.tileSize,
          item.width,
          item.height
        );
      }
    }
    game.player.isCollidingWithItem();
  }
}
