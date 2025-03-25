class Coins {
  constructor(coins) {
    this.coins = coins;
    this.coinImg = new Image();
    this.loadImages();
  }

  loadImages() {
    this.coinImg.src = "./assets/img/items/coin.png";
  }

  initialize() {
    this.update();
  }

  update() {
    for (let coin of this.coins) {
      let characters = JSON.parse(localStorage.getItem("characters"));
      let character = characters.find((c) => c.id === game.player.id);
      let level = character.levels.find(
        (l) => l.level === game.core.currentLevel
      );

      if (!coin.collected && !level.coinsCollected.includes(coin.id)) {
        game.canvas.mainCtx.drawImage(
          this.coinImg,
          coin.position.x * config.global.tileSize,
          coin.position.y * config.global.tileSize,
          coin.width,
          coin.height
        );
      }
    }
    game.player.isCollidingWithCoin();
  }
}
