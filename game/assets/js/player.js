class Player {
  constructor(
    context,
    startPosX,
    startPosY,
    playerWidth,
    playerHeight,
    tileSize,
    map
  ) {
    this.context = context;
    this.playerPosX = startPosX;
    this.playerPosY = startPosY;
    this.playerWidth = playerWidth;
    this.playerHeight = playerHeight;
    this.tileSize = tileSize;
    this.map = map;
    this.playerSpeed = 5;
    this.gravity = 1;
    this.playerFall = 0;
    this.playerJumpForce = 20;
    this.onGround = false;
    this.blocks = "PB";
  }

  initialize() {
    this.draw();
  }

  draw() {
    this.context.fillStyle = "black";
    this.context.fillRect(
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
      row < this.map.length &&
      col >= 0 &&
      col < this.map[0].length
    ) {
      return this.map[row][col];
    }
    return null;
  }

  isColliding(x, y) {
    const topY = y;
    const middleY = y + this.playerHeight / 2;
    const bottomY = y + this.playerHeight - 1;

    return (
      this.blocks.includes(this.getTileAt(x, topY)) ||
      this.blocks.includes(this.getTileAt(x + this.playerWidth - 1, topY)) ||
      this.blocks.includes(this.getTileAt(x, middleY)) ||
      this.blocks.includes(this.getTileAt(x + this.playerWidth - 1, middleY)) ||
      this.blocks.includes(this.getTileAt(x, bottomY)) ||
      this.blocks.includes(this.getTileAt(x + this.playerWidth - 1, bottomY))
    );
  }

<<<<<<< HEAD
=======
  block() {
    let b = {}; // Blockade-Objekt als Rückgabewert
    b.spalteL = Math.floor(this.playerPosX / this.tileSize); // Spaltennummer der linken Spielerkante
    b.spalteR = Math.floor(
      (this.playerPosX + this.playerWidth) / this.tileSize
    ); // Spaltennummer der rechten Spielerkante
    b.zeileO = Math.floor(this.playerPosY / this.tileSize); // Zeilennummer der oberen Spielerkante
    b.zeileU = Math.floor(
      (this.playerPosY + this.playerHeight) / this.tileSize
    ); // Zeilennummer der unteren Spielerkante
    // Prüfung, ob Spieler mit einer seiner Ecken in einem BLOCKER-Tile steht:
    b.links =
      this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteL)) >= 0 ||
      this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteL)) >= 0;
    b.rechts =
      this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteR)) >= 0 ||
      this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteR)) >= 0;

    b.oben =
      this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteL)) >= 0 ||
      this.blocks.indexOf(this.map[b.zeileO].charAt(b.spalteR)) >= 0;

    b.unten =
      this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteL)) >= 0 ||
      this.blocks.indexOf(this.map[b.zeileU].charAt(b.spalteR)) >= 0;

    return b; // Liefert das Objekt an die Stelle des Aufrufs zurück
  }

>>>>>>> ca07d0c961251f75f1bbbd0d61ef84ec981af1f1
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
