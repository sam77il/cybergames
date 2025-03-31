class Projectile {
  constructor(x, y, direction, type, damage = 10) {
    this.posX = x;
    this.posY = y;
    this.direction = direction;
    this.speed = 9;
    this.width = 7;
    this.height = 7;
    this.damage = damage;
    this.type = type;
    this.id = Math.random().toString(36).substr(2, 9);
  }

  draw() {
    switch (this.type) {
      case "player":
        game.canvas.mainCtx.fillStyle = "cyan";
        break;
      case "enemy":
        game.canvas.mainCtx.fillStyle = "red";
        break;
    }

    game.canvas.mainCtx.fillRect(this.posX, this.posY, this.width, this.height);
  }

  update() {
    this.posX += this.speed * this.direction;

    if (
      this.posX < 0 ||
      this.posX > game.canvas.width ||
      this.posY < 0 ||
      this.posY > game.canvas.height
    ) {
      return false;
    }

    const tileX = Math.floor(this.posX / game.core.tileSize);
    const tileY = Math.floor(this.posY / game.core.tileSize);

    if (
      tileX < 0 ||
      tileY < 0 ||
      tileX >= game.core.map[0].length ||
      tileY >= game.core.map.length
    ) {
      return false;
    }

    const tile = game.core.map[tileY][tileX];
    if (config.global.blocker.includes(tile)) {
      return false;
    }

    if (this.type === "player") {
      for (let enemy of game.enemies) {
        const isColliding = this.checkCollision(enemy);
        if (isColliding) {
          enemy.updateHealth("remove", this.damage);
          return false;
        }
      }
    } else {
      const isColliding = this.checkCollision(game.player);
      if (isColliding) {
        game.player.updateHealth("remove", this.damage);
        return false;
      }
    }

    this.draw();
    return true;
  }

  checkCollision(target) {
    return (
      this.posX < target.posX + target.settings.width &&
      this.posX + this.width > target.posX &&
      this.posY < target.posY + target.settings.height &&
      this.posY + this.height > target.posY
    );
  }
}
