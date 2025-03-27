class Player {
  constructor(startPosX, startPosY, width, height, id) {
    this.id = Number(id);
    this.posX = startPosX;
    this.posY = startPosY;
    this.inventory = [];
    this.coins = 0;
    this.deaths = 0;
    this.kills = 0;
    this.health = 1000;
    this.dead = false;
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
    this.projectiles = [];
    this.shootCooldown = 0;
    this.maxCooldown = 60;
    this.damage = 500;
    this.lastDirectionRight = true;
  }

  initialize() {
    const character = JSON.parse(localStorage.getItem("characters")).find(
      (char) => {
        return Number(char.id) === Number(this.id);
      }
    );
    this.inventory = character.inventory;
    this.coins = character.coins;
    this.deaths = character.deaths;
    this.kills = character.kills;
    this.draw();
    this.loadInventory();
    this.loadCoins();
    this.loadStats();
  }

  loadStats() {
    game.ui.stats.kills.innerHTML = this.kills;
    game.ui.stats.deaths.innerHTML = this.deaths;
    game.ui.stats.kd.innerHTML = calculateKD(this.kills, this.deaths);
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

  loadCoins() {
    const coinText = document.querySelector("#game-screen-hud-coin-amount");

    coinText.innerHTML = this.coins + "x";
  }

  draw() {
    game.canvas.mainCtx.fillStyle = "black";
    game.canvas.mainCtx.fillRect(
      this.posX,
      this.posY,
      this.settings.width,
      this.settings.height
    );

    this.projectiles.forEach((projectile) => projectile.draw());
  }

  shoot() {
    if (this.shootCooldown === 0) {
      const direction = this.lastDirectionRight ? 1 : -1;
      const projectileX =
        direction > 0 ? this.posX + this.settings.width : this.posX;
      const projectileY = this.posY + this.settings.height / 2;

      const projectile = new Projectile(
        projectileX,
        projectileY,
        direction,
        "player",
        this.damage
      );
      this.projectiles.push(projectile);
      this.shootCooldown = this.maxCooldown;
    }
  }

  handleShooting() {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    if (this.controls.shoot && this.shootCooldown === 0) {
      this.shoot();
    }
  }

  updateProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) =>
      projectile.update()
    );
  }

  update() {
    this.draw();
    this.move();
    this.handleShooting();
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }
    this.updateProjectiles();
  }

  updateStats(stat, type, amount) {
    if (stat === "kills") {
      if (type === "add") {
        this.kills += amount;
      } else if (type === "remove") {
        this.kills -= amount;
      } else if (type === "set") {
        this.kills = amount;
      }
    } else if (stat === "deaths") {
      if (type === "add") {
        this.deaths += amount;
      } else if (type === "remove") {
        this.deaths -= amount;
      } else if (type === "set") {
        this.deaths = amount;
      }
    }
    this.loadStats();
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

    if (this.health <= 0) {
      this.dead = true;
    }

    if (this.dead) {
      this.updateStats("deaths", "add", 1);
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

  isNearCoin(coin, range = 0) {
    return (
      this.posX <
        coin.position.x * config.global.tileSize + coin.width + range &&
      this.posX + this.settings.width >
        coin.position.x * config.global.tileSize - range &&
      this.posY <
        coin.position.y * config.global.tileSize + coin.height + range &&
      this.posY + this.settings.height >
        coin.position.y * config.global.tileSize - range
    );
  }

  isCollidingWithCoin() {
    let currentNearCoins = [];
    try {
      currentNearCoins = game.core.mapCoins.filter((coin) => {
        let characters = JSON.parse(localStorage.getItem("characters"));
        let character = characters.find((c) => c.id === game.player.id);
        let level = character.levels.find(
          (l) => l.level === game.core.currentLevel
        );
        if (!coin.collected && !level.coinsCollected.includes(coin.id))
          if (this.isNearCoin(coin)) {
            this.updateCoins("add", coin);
          }
      });
    } catch (error) {
      console.error("Fehler beim Filtern der nahen Items:", error);
      return;
    }
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

  addInventoryItem(newItem, from = "normal") {
    let newInventory = checkAddSlot(this.inventory, newItem);

    let oldCharacters = JSON.parse(localStorage.getItem("characters")).find(
      (character) => Number(character.id) === Number(this.id)
    );
    oldCharacters.inventory = newInventory;
    let newCharacters = JSON.parse(localStorage.getItem("characters")).filter(
      (character) => Number(character.id) !== Number(this.id)
    );
    newCharacters.push(oldCharacters);
    if (from !== "shop") {
      newCharacters
        .find((c) => c.id === this.id)
        .levels.find((l) => l.level === game.core.currentLevel)
        .itemsCollected.push(newItem.id);
    }

    localStorage.setItem("characters", JSON.stringify(newCharacters));
    this.loadInventory();
    if (from === "shop") {
      Notify(
        "Inventar",
        `Du hast ${newItem.label} ${newItem.amount}x für ${newItem.price} Coins gekauft`,
        "info",
        3500
      );
    } else {
      Notify(
        "Inventar",
        `Du hast ${newItem.label} ${newItem.amount}x aufgehoben`,
        "info",
        3500
      );
    }
  }

  addPerk(perk) {
    let oldCharacters = JSON.parse(localStorage.getItem("characters")).find(
      (character) => Number(character.id) === Number(this.id)
    );
    if (oldCharacters.perks.includes(perk)) {
      Notify("Perks", "Du besitzt bereits dieses Perk", "info", 3500);
      return;
    }

    oldCharacters.perks.push(perk);
    let newCharacters = JSON.parse(localStorage.getItem("characters")).filter(
      (character) => Number(character.id) !== Number(this.id)
    );
    newCharacters.push(oldCharacters);
    localStorage.setItem("characters", JSON.stringify(newCharacters));
    Notify(
      "Perks",
      "Der Perk " + perks[perk].label + " wurde installiert",
      "success",
      3500
    );
  }

  updateCoins(type, newCoin, from = "normal") {
    let oldCharacters = JSON.parse(localStorage.getItem("characters")).find(
      (character) => Number(character.id) === Number(this.id)
    );
    if (type === "add") {
      oldCharacters.coins += newCoin.amount;
      this.coins += newCoin.amount;
    } else if (type === "remove") {
      oldCharacters.coins -= newCoin.amount;
      this.coins -= newCoin.amount;
    } else if (type === "set") {
      oldCharacters.coins = newCoin.amount;
      this.coins = newCoin.amount;
    }

    let newCharacters = JSON.parse(localStorage.getItem("characters")).filter(
      (character) => Number(character.id) !== Number(this.id)
    );

    newCharacters.push(oldCharacters);

    if (from !== "shop") {
      newCharacters
        .find((c) => c.id === this.id)
        .levels.find((l) => l.level === game.core.currentLevel)
        .coinsCollected.push(newCoin.id);
    }

    localStorage.setItem("characters", JSON.stringify(newCharacters));
    this.loadCoins();
    if (from === "normal") {
      Notify(
        "Coins",
        `Du hast ${newCoin.amount}x Coins eingesammelt`,
        "info",
        3500
      );
    }
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

    if (this.controls.left) {
      this.lastDirectionRight = false;
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
      this.lastDirectionRight = true;

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

    if (this.settings.onGround && this.controls.up) {
      this.settings.onGround = false;
      this.settings.fall = -this.settings.jumpForce;
    }

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
