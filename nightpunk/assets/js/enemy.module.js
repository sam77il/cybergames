class Enemy {
  constructor(startPosX, startPosY, width, height, health, items, type) {
    this.posX = startPosX;
    this.posY = startPosY;
    this.items = items;
    this.health = health;
    this.settings = {
      type: type,
      width: width,
      height: height,
      speed: 5,
      gravity: 1,
      fall: 0,
      jumpForce: 20,
      onGround: false,
    };
    this.controls = {
      left: false,
      right: false,
      up: false,
    };
  }

  initialize() {
    this.draw();
  }

  draw() {
    game.canvas.mainCtx.fillStyle = "black";
    game.canvas.mainCtx.fillRect(
      this.posX,
      this.posY,
      this.settings.width,
      this.settings.height
    );
  }

  update() {
    this.draw();
  }

  updateHealth(type, amount) {
    if (type === "set") {
      this.health = amount;
    } else if (type === "add") {
      this.health += amount;
    } else if (type === "remove") {
      this.health -= amount;
    }
    console.log("New Playerhealth: " + this.health);
    game.ui.healthBar.style.width = this.health + "%";

    if (this.health <= 0) {
      // Game Over!!!
      game.ui.healthBar.style.width = "0%";
    }
  }

  getTileAt(x, y) {
    const col = Math.floor(x / game.core.tileSize);
    const row = Math.floor(y / game.core.tileSize);
    if (
      row >= 0 &&
      row < game.core.map.length &&
      col >= 0 &&
      col < game.core.map[0].length
    ) {
      return game.core.map[row][col];
    }
    return null;
  }

  isColliding(x, y) {
    const topY = y;
    const middleY = y + this.settings.height / 2;
    const bottomY = y + this.settings.height - 1;

    if (this.getTileAt(x, bottomY) === "G") {
      return { collides: true, type: "G" };
    } else if (this.getTileAt(x + this.settings.width, bottomY) === "H") {
      return { collides: true, type: "H" };
    }

    const collides =
      config.global.blocker.includes(this.getTileAt(x, topY)) ||
      config.global.blocker.includes(
        this.getTileAt(x + this.settings.width - 1, topY)
      ) ||
      config.global.blocker.includes(this.getTileAt(x, middleY)) ||
      config.global.blocker.includes(
        this.getTileAt(x + this.settings.width - 1, middleY)
      ) ||
      config.global.blocker.includes(this.getTileAt(x, bottomY)) ||
      config.global.blocker.includes(
        this.getTileAt(x + this.settings.width - 1, bottomY)
      );

    return { collides: collides, type: collides ? "block" : null };
  }

  move(controls) {
    let nextX = this.posX;
    let nextY = this.posY;

    // Horizontale Bewegung mit Seitenkollision
    if (controls.left) {
      const collision = this.isColliding(
        nextX - this.settings.speed,
        this.posY
      );

      if (collision.type === "G") {
        nextX -= this.settings.speed;
        nextY -= this.settings.speed;
      } else if (!collision.collides) {
        nextX -= this.settings.speed;
      }
    }

    if (controls.right) {
      const collision = this.isColliding(
        nextX + this.settings.speed,
        this.posY
      );
      if (collision.type === "H") {
        nextX += this.settings.speed;
        nextY -= this.settings.speed;
      } else if (!collision.collides) {
        nextX += this.settings.speed;
      }
    }

    // Sprunglogik
    if (this.settings.onGround && controls.up) {
      this.settings.onGround = false;
      this.settings.fall = -this.settings.jumpForce;
    }

    // Vertikale Bewegung
    this.settings.fall += this.settings.gravity;
    nextY += this.settings.fall;

    if (this.settings.fall > 0) {
      const collision = this.isColliding(nextX, nextY);
      if (collision.collides) {
        this.settings.onGround = true;
        this.settings.fall = 0;
        nextY =
          Math.floor((nextY + this.settings.height) / game.core.tileSize) *
            game.core.tileSize -
          this.settings.height;
      } else {
        this.settings.onGround = false;
      }
    } else if (this.settings.fall < 0) {
      const collision = this.isColliding(nextX, nextY);
      if (collision.collides) {
        this.settings.fall = 0;
        nextY = Math.ceil(nextY / game.core.tileSize) * game.core.tileSize;
      }
    }

    this.posX = nextX;
    this.posY = nextY;
  }
}
