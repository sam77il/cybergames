class Player {
  constructor(startPosX, startPosY, width, height, id) {
    this.id = Number(id);
    this.posX = startPosX;
    this.posY = startPosY;
    this.inventory = [];
    this.health = 100;
    this.pauseMenu = false;
    this.settings = {
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
    this.inventory = JSON.parse(localStorage.getItem("characters")).find(
      (char) => {
        return Number(char.id) === Number(this.id);
      }
    ).inventory;
    // console.log(this.inventory);
    this.draw();
    this.loadInventory();
  }

  loadInventory() {
    let inventorySlots = document.querySelectorAll(
      ".game-screen-inventory-slot"
    );

    inventorySlots.forEach((el) => {
      el.innerHTML = "";
      el.style.backgroundColor = "#266881";
    });

    for (let item of this.inventory) {
      console.log(item.name);
      game.ui.inventory["slot" + item.slot].innerHTML = `
        <img src="./assets/img/items/${item.name}.png" alt="item image">
        <p>${item.amount}</p>
      `;
    }
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
    this.move();
  }

  updateHealth(type, amount) {
    if (type === "set") {
      this.health = amount;
    } else if (type === "add") {
      this.health += amount;
    } else if (type === "remove") {
      this.health -= amount;
    }
    console.log("New health: " + this.health);

    if (this.health >= 100) {
      game.ui.healthBar.style.background =
        "url('./assets/img/health/health_6.png') no-repeat center";
    } else if (this.health >= 80) {
      game.ui.healthBar.style.background =
        "url('./assets/img/health/health_5.png') no-repeat center";
    } else if (this.health >= 60) {
      game.ui.healthBar.style.background =
        "url('./assets/img/health/health_4.png') no-repeat center";
    } else if (this.health >= 40) {
      game.ui.healthBar.style.background =
        "url('./assets/img/health/health_3.png') no-repeat center";
    } else if (this.health >= 20) {
      game.ui.healthBar.style.background =
        "url('./assets/img/health/health_2.png') no-repeat center";
    } else if (this.health >= 1) {
      game.ui.healthBar.style.background =
        "url('./assets/img/health/health_1.png') no-repeat center";
    } else if (this.health <= 0) {
      game.ui.healthBar.style.background =
        "url('./assets/img/health/health_0.png') no-repeat center";
    }
    game.ui.healthBar.style.backgroundSize = "cover";
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

  isNearItem(item, range = 20) {
    return (
      this.posX <
        item.position.x * config.global.tileSize + item.width + range &&
      this.posX + this.settings.width >
        item.position.x * config.global.tileSize - range &&
      this.posY <
        item.position.y * config.global.tileSize + item.height + range &&
      this.posY + this.settings.height >
        item.position.y * config.global.tileSize - range
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
      currentNearItems = game.core.mapItems.filter((item) => {
        let characters = JSON.parse(localStorage.getItem("characters"));
        let character = characters.find((c) => c.id === game.player.id);
        let level = character.levels.find(
          (l) => l.level === game.core.currentLevel
        );
        if (!item.collected && !level.itemsCollected.includes(item.id))
          return this.isNearItem(item);
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
    let newInventory = checkAddSlot(this.inventory, newItem);

    let oldCharacters = JSON.parse(localStorage.getItem("characters")).find(
      (character) => Number(character.id) === Number(this.id)
    );
    oldCharacters.inventory = newInventory;
    let newCharacters = JSON.parse(localStorage.getItem("characters")).filter(
      (character) => Number(character.id) !== Number(this.id)
    );
    newCharacters.push(oldCharacters);
    console.log(
      newCharacters
        .find((c) => c.id === this.id)
        .levels.find((l) => l.level === game.core.currentLevel)
        .itemsCollected.push(newItem.id)
    );
    console.log(newCharacters);
    localStorage.setItem("characters", JSON.stringify(newCharacters));
    this.loadInventory();
  }

  dropItem(item) {
    if (item?.name) {
      game.map.itemsOnFloor.setItems(item);
      let newInventory = this.inventory.filter(
        (invItem) => invItem.name !== item.name
      );

      let oldCharacters = JSON.parse(localStorage.getItem("characters")).find(
        (character) => Number(character.id) === Number(this.id)
      );
      oldCharacters.inventory = newInventory;
      let newCharacters = JSON.parse(localStorage.getItem("characters")).filter(
        (character) => Number(character.id) !== Number(this.id)
      );
      newCharacters.push(oldCharacters);
      localStorage.setItem("characters", JSON.stringify(newCharacters));
      this.inventory = newInventory;
      this.loadInventory();
    }
  }

  move() {
    let nextX = this.posX;
    let nextY = this.posY;

    // Horizontale Bewegung mit Seitenkollision
    if (this.controls.left) {
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

    if (this.controls.right) {
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
    if (this.settings.onGround && this.controls.up) {
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
