class Items {
  constructor(items) {
    this.items = items;
    this.itemImgs = {
      katana: new Image(),
      mantisblade: new Image(),
      railgun: new Image(),
      hdd: new Image(),
      ssd: new Image(),
    };
    this.loadImages();
  }

  loadImages() {
    this.itemImgs.katana.src = "./assets/img/items/katana.png";
    this.itemImgs.mantisblade.src = "./assets/img/items/mantisblade.png";
    this.itemImgs.hdd.src = "./assets/img/items/hdd.png";
    this.itemImgs.ssd.src = "./assets/img/items/ssd.png";
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
          (game.player.posX + game.player.settings.width) /
            config.global.tileSize
        ),
        y: Math.floor(
          (game.player.posY + game.player.settings.height) /
            config.global.tileSize -
            1
        ),
      },
    });
  }

  update() {
    for (let item of this.items) {
      let characters = JSON.parse(localStorage.getItem("characters"));
      let character = characters.find((c) => c.id === game.player.id);
      let level = character.levels.find(
        (l) => l.level === game.core.currentLevel
      );

      if (!item.collected && !level.itemsCollected.includes(item.id)) {
        game.canvas.mainCtx.drawImage(
          this.itemImgs[item.name],
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
