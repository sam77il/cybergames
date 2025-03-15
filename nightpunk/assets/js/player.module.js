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
    this.playerHealth = 100;
  }

  initialize() {
    this.inventory = JSON.parse(localStorage.getItem("characters")).find(
      (char) => {
        return Number(char.id) === Number(this.playerId);
      }
    ).inventory;
    // console.log(this.inventory);
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

  updateHealth(type, amount) {
    if (type === "set") {
      this.playerHealth = amount;
    } else if (type === "add") {
      this.playerHealth += amount;
    } else if (type === "remove") {
      this.playerHealth -= amount;
    }
    console.log("New Playerhealth: " + this.playerHealth);
    healtBar.style.width = this.playerHealth + "%";

    if (this.playerHealth <= 0) {
      // Game Over!!!
      healtBar.style.width = "0%";
    }
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

    if (this.getTileAt(x, bottomY) === "G") {
      return { collides: true, type: "G" };
    } else if (this.getTileAt(x + this.playerWidth, bottomY) === "H") {
      return { collides: true, type: "H" };
    }

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

  isNearItem(item, range = 20) {
    return (
      this.playerPosX <
        item.position.x * gameConfig.global.tileSize + item.width + range &&
      this.playerPosX + this.playerWidth >
        item.position.x * gameConfig.global.tileSize - range &&
      this.playerPosY <
        item.position.y * gameConfig.global.tileSize + item.height + range &&
      this.playerPosY + this.playerHeight >
        item.position.y * gameConfig.global.tileSize - range
    );
  }

  isCollidingWithItem() {
    if (!gameState.helpNotifyRef) {
      gameState.helpNotifyRef = document.getElementById(
        "game-screen-helpnotify"
      );
    }

    let currentNearItems = [];
    try {
      currentNearItems = mapItems.filter((item) => {
        if (!item.collected) return this.isNearItem(item);
      });
    } catch (error) {
      console.error("Fehler beim Filtern der nahen Items:", error);
      return;
    }

    const itemsChanged = !areItemArraysEqual(
      currentNearItems,
      gameState.nearItems
    );

    if (currentNearItems.length === 0) {
      if (gameState.nearItems.length > 0) {
        gameState.helpNotifyRef.style.display = "none";
        gameState.helpNotifyRef.innerHTML = "";
        gameState.nearItems = [];
        gameState.selectedItemIndex = 0;
      }
      return;
    }

    if (itemsChanged) {
      gameState.nearItems = [...currentNearItems];

      gameState.selectedItemIndex = Math.min(
        gameState.selectedItemIndex,
        currentNearItems.length - 1
      );

      updateHelpNotifyUI();
    }
  }

  addInventoryItem(newItem) {
    // Prüfen, ob das Item bereits im Inventar vorhanden ist
    let newInventory = checkSlot(this.inventory, newItem);

    let oldCharacters = JSON.parse(localStorage.getItem("characters")).find(
      (character) => Number(character.id) === Number(this.playerId)
    );
    oldCharacters.inventory = newInventory;
    let newCharacters = JSON.parse(localStorage.getItem("characters")).filter(
      (character) => Number(character.id) !== Number(this.playerId)
    );
    newCharacters.push(oldCharacters);
    localStorage.setItem("characters", JSON.stringify(newCharacters));
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
