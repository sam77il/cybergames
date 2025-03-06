class Player {
  constructor(startPosX, startPosY, playerWidth, playerHeight) {
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
    this.blocks = "ABCMW";
  }

  initialize() {
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

    return (
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
      )
    );
  }

  move(controls) {
    let nextX = this.playerPosX;
    let nextY = this.playerPosY;

    // Horizontale Bewegung mit Seitenkollision (oben, Mitte, unten prüfen)
    if (controls.left) {
      nextX -= this.playerSpeed;
      if (this.isColliding(nextX, this.playerPosY)) {
        nextX = this.playerPosX;
      }
    }

    if (controls.right) {
      nextX += this.playerSpeed;
      if (this.isColliding(nextX, this.playerPosY)) {
        nextX = this.playerPosX;
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
      if (this.isColliding(nextX, nextY)) {
        this.onGround = true;
        this.playerFall = 0;
        nextY =
          Math.floor((nextY + this.playerHeight) / this.tileSize) *
            this.tileSize -
          this.playerHeight;
      }
    } else if (this.playerFall < 0) {
      if (this.isColliding(nextX, nextY)) {
        this.playerFall = 0;
        nextY = Math.ceil(nextY / this.tileSize) * this.tileSize;
      }
    }

    this.playerPosX = nextX;
    this.playerPosY = nextY;
  }
}
