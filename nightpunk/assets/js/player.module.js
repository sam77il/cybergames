class Player {
  constructor(startPosX, startPosY, playerWidth, playerHeight, playerId) {
    this.playerId = playerId;
    this.playerPosX = startPosX;
    this.playerPosY = startPosY;
    this.playerWidth = playerWidth;
    this.playerHeight = playerHeight;
    this.tileSize = game.tileSize;
    this.playerSpeed = 5;
    this.gravity = 1;
    this.playerFall = 0;
    this.playerJumpForce = 20;
    this.onGround = false;
    this.inventory = [];
  }

  initialize() {
    this.inventory = JSON.parse(localStorage.getItem("characters")).find(
      (char) => {
        return Number(char.id) === Number(this.playerId);
      }
    ).inventory;
    console.log(this.inventory);
    this.draw();
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(
      this.playerPosX,
      this.playerPosY,
      this.playerWidth,
      this.playerHeight
    );
  }

  update() {
    this.draw();
  }

  getTileAt(x, y) {
    const col = Math.floor(x / this.tileSize);
    const row = Math.floor(y / this.tileSize);
    if (
      row >= 0 &&
      row < game.map.length &&
      col >= 0 &&
      col < game.map[0].length
    ) {
      return game.map[row][col];
    }
    return null;
  }

  isColliding(x, y) {
    const topY = y;
    const middleY = y + this.playerHeight / 2;
    const bottomY = y + this.playerHeight - 1;

    // Prüfe zuerst auf "G" und gib ein Objekt mit Informationen zurück
    if (this.getTileAt(x, bottomY) === "G") {
      return { collides: true, type: "G" };
    } else if (this.getTileAt(x + this.playerWidth, bottomY) === "H") {
      return { collides: true, type: "H" };
    }

    // Prüfe auf andere Kollisionen
    const collides =
      gameConfig.global.blocker.includes(this.getTileAt(x, topY)) ||
      gameConfig.global.blocker.includes(
        this.getTileAt(x + this.playerWidth - 1, topY)
      ) ||
      gameConfig.global.blocker.includes(this.getTileAt(x, middleY)) ||
      gameConfig.global.blocker.includes(
        this.getTileAt(x + this.playerWidth - 1, middleY)
      ) ||
      gameConfig.global.blocker.includes(this.getTileAt(x, bottomY)) ||
      gameConfig.global.blocker.includes(
        this.getTileAt(x + this.playerWidth - 1, bottomY)
      );

    return { collides: collides, type: collides ? "block" : null };
  }

  move(controls) {
    let nextX = this.playerPosX;
    let nextY = this.playerPosY;

    // Horizontale Bewegung mit Seitenkollision
    if (controls.left) {
      const collision = this.isColliding(
        nextX - this.playerSpeed,
        this.playerPosY
      );

      if (collision.type === "G") {
        nextX -= this.playerSpeed;
        nextY -= this.playerSpeed;
      } else if (!collision.collides) {
        nextX -= this.playerSpeed;
      }
    }

    if (controls.right) {
      const collision = this.isColliding(
        nextX + this.playerSpeed,
        this.playerPosY
      );
      if (collision.type === "H") {
        nextX += this.playerSpeed;
        nextY -= this.playerSpeed;
      } else if (!collision.collides) {
        nextX += this.playerSpeed;
      }
    }

    // Sprunglogik
    if (this.onGround && controls.up) {
      this.onGround = false;
      this.playerFall = -this.playerJumpForce;
    }

    // Vertikale Bewegung
    this.playerFall += this.gravity;
    nextY += this.playerFall;

    if (this.playerFall > 0) {
      const collision = this.isColliding(nextX, nextY);
      if (collision.collides) {
        this.onGround = true;
        this.playerFall = 0;
        nextY =
          Math.floor((nextY + this.playerHeight) / this.tileSize) *
            this.tileSize -
          this.playerHeight;
      } else {
        this.onGround = false;
      }
    } else if (this.playerFall < 0) {
      const collision = this.isColliding(nextX, nextY);
      if (collision.collides) {
        this.playerFall = 0;
        nextY = Math.ceil(nextY / this.tileSize) * this.tileSize;
      }
    }

    this.playerPosX = nextX;
    this.playerPosY = nextY;
  }
}
