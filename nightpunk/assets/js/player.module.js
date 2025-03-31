class Player {
  constructor(startPosX, startPosY, width, height, id, chartype) {
    this.id = Number(id);
    this.chartype = chartype;
    this.posX = startPosX;
    this.posY = startPosY;
    this.inventory = [];
    this.selectedItem = null;
    this.coins = 0;
    this.stats = {
      deaths: 0,
      kills: 0,
    };
    this.health = 1;
    this.dead = false;
    this.settings = {
      width: 50, // sprite width
      height: 70, // sprite height
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
    this.activePerks = [];
    this.projectiles = [];
    this.shootCooldown = 0;
    this.maxCooldown = 200;
    this.damage = 30;
    this.lastDirectionRight = true;

    // Sprite sheets for different states
    this.spriteSheets = {
      run: {
        image: new Image(),
        frames: 6,
        frameWidth: 50,
        frameHeight: 70,
      },
      idle: {
        image: new Image(),
        frames: 4,
        frameWidth: 50,
        frameHeight: 70,
      },
      jump: {
        image: new Image(),
        frames: 4,
        frameWidth: 50,
        frameHeight: 70,
      },
      superjump: {
        image: new Image(),
        frames: 6,
        frameWidth: 50,
        frameHeight: 70,
      },
      attack: {
        image: new Image(),
        frames: 6,
        frameWidth: 50,
        frameHeight: 70,
      },
    };

    // Set sprite sheet sources
    this.spriteSheets.idle.image.src = `./assets/img/player/${this.chartype}/idle.png`;
    this.spriteSheets.run.image.src = `./assets/img/player/${this.chartype}/run.png`;
    this.spriteSheets.jump.image.src = `./assets/img/player/${this.chartype}/jump.png`;
    this.spriteSheets.superjump.image.src = `./assets/img/player/${this.chartype}/superjump.png`;
    this.spriteSheets.attack.image.src = `./assets/img/player/${this.chartype}/attack.png`;

    this.animationState = "idle"; // Default state
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.framesPerSecond = 10;
    this.frameInterval = 1000 / this.framesPerSecond;
  }

  initialize() {
    const character = JSON.parse(localStorage.getItem("characters")).find(
      (char) => {
        return Number(char.id) === Number(this.id);
      }
    );
    this.inventory = character.inventory;
    this.coins = character.coins;
    this.stats.deaths = character.stats.deaths;
    this.stats.kills = character.stats.kills;
    this.draw();
    this.loadInventory();
    this.loadCoins();
    this.loadStats();
  }

  loadStats() {
    game.ui.stats.kills.innerHTML = this.stats.kills;
    game.ui.stats.deaths.innerHTML = this.stats.deaths;
    game.ui.stats.kd.innerHTML = calculateKD(
      this.stats.kills,
      this.stats.deaths
    );
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
    const ctx = game.canvas.mainCtx;

    // Get current state's sprite sheet
    const currentSpriteSheet = this.spriteSheets[this.animationState];

    // Check if sprite sheet is loaded
    if (!currentSpriteSheet.image.complete) return;

    // Update frame based on animation state and timing
    this.frameTimer += 16; // Feste Zeit oder game.core.deltaTime
    if (this.frameTimer >= this.frameInterval) {
      // For death animation, don't loop - stay on the last frame
      if (
        this.animationState === "death" &&
        this.currentFrame === currentSpriteSheet.frames - 1
      ) {
        // Stay on last frame for death animation
        this.currentFrame = currentSpriteSheet.frames - 1;
      } else {
        this.currentFrame = (this.currentFrame + 1) % currentSpriteSheet.frames;
      }
      this.frameTimer = 0;
    }

    // Determine row based on direction (top row for right, bottom row for left)
    const sourceY = this.lastDirectionRight
      ? currentSpriteSheet.frameHeight
      : 0;

    // Hier die Größe des Spielers ändern
    // Original: this.settings.width, this.settings.height
    const scaleFactor = 1.6; // Größenfaktor, z.B. 1.5 für 50% größer
    const newWidth = this.settings.width * scaleFactor;
    const newHeight = this.settings.height * scaleFactor;

    // Position anpassen, damit der Spieler vom gleichen Bezugspunkt aus vergrößert wird
    // (z.B. die Füße bleiben am gleichen Ort)
    const posYAdjusted = this.posY - (newHeight - this.settings.height);

    ctx.drawImage(
      currentSpriteSheet.image,
      this.currentFrame * currentSpriteSheet.frameWidth,
      sourceY,
      currentSpriteSheet.frameWidth,
      currentSpriteSheet.frameHeight,
      this.posX,
      posYAdjusted, // Angepasste Y-Position
      newWidth,
      newHeight
    );
  }

  shoot() {
    if (this.shootCooldown === 0) {
      // Set animation state to attack
      this.animationState = "attack";

      // Reset animation timer for smooth animation
      this.frameTimer = 0;
      this.currentFrame = 0;

      const direction = this.lastDirectionRight ? 1 : -1;
      const projectileX =
        direction > 0 ? this.posX + this.settings.width : this.posX;
      const projectileY = this.posY + 15;

      const projectile = new Projectile(
        projectileX,
        projectileY,
        direction,
        "player",
        this.damage
      );
      this.projectiles.push(projectile);
      this.shootCooldown = this.maxCooldown;
      game.sounds.shoot.play();

      // Set timeout to return to normal animation
      setTimeout(() => {
        // Only reset if still in attack animation (could have changed due to other actions)
        if (this.animationState === "attack") {
          // Return to appropriate animation based on current state
          if (!this.settings.onGround) {
            if (this.activePerks.includes("jump")) {
              this.animationState = "superjump";
            } else {
              this.animationState = "jump";
            }
          } else if (this.controls.left || this.controls.right) {
            this.animationState = "run";
          } else {
            this.animationState = "idle";
          }
        }
      }, 500); // Attack animation duration
    }
  }

  handleShooting() {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    if (this.controls.shoot && this.shootCooldown === 0 && this.selectedItem) {
      if (this.selectedItem.name === "railgun") {
        this.shoot();
      } else if (this.selectedItem.name === "katana") {
        this.knife("katana");
      } else if (this.selectedItem.name === "mantisblade") {
        this.knife("mantisblade");
      } else if (this.selectedItem.name === "ssd") {
        this.updateHealth("add", 100);

        if (this.health > 100) {
          this.updateHealth("set", 100);
        }
        this.removeInventoryItem(this.selectedItem, 1, false);
      } else if (this.selectedItem.name === "hdd") {
        this.updateHealth("add", A50);

        if (this.health > 100) {
          this.updateHealth("set", 100);
        }
        this.removeInventoryItem(this.selectedItem, 1, false);
      }
    }
  }

  knife(knifeType) {
    // Only allow knife attack if not in cooldown
    if (this.shootCooldown === 0) {
      // Set animation state to attack when using knife
      this.animationState = "attack";

      // Reset animation timer to ensure smooth animation start
      this.frameTimer = 0;
      this.currentFrame = 0;

      // Play knife sound effect
      if (game.sounds[knifeType]) {
        game.sounds[knifeType].play();
      } else {
        console.log("Knife sound effect not loaded");
      }

      // Define knife range
      const knifeRange = 80; // Pixels

      // Check for enemies within range
      console.log(game.enemies);
      const nearbyEnemies = game.enemies.filter((enemy) => {
        // Calculate distance between player and enemy
        const distanceX = Math.abs(
          this.posX +
            this.settings.width / 2 -
            (enemy.posX + enemy.settings.width / 2)
        );
        const distanceY = Math.abs(
          this.posY +
            this.settings.height / 2 -
            (enemy.posY + enemy.settings.height / 2)
        );

        // Check if enemy is in front of player based on direction
        const isInFront = this.lastDirectionRight
          ? enemy.posX > this.posX
          : enemy.posX < this.posX;

        return (
          distanceX < knifeRange && distanceY < 60 && isInFront && !enemy.dead
        );
      });

      // Deal damage to nearby enemies
      let hitAny = false;

      nearbyEnemies.forEach((enemy) => {
        // Calculate damage based on weapon
        let damage = 50; // Base knife damage

        // Increase damage for mantisblade
        if (this.selectedItem && this.selectedItem.name === "mantisblade") {
          damage = 80;
        }

        // Apply damage to enemy
        enemy.updateHealth("remove", damage);

        hitAny = true;
      });

      // Play hit sound if any enemy was hit
      if (hitAny && game.sounds.hit) {
        game.sounds.hit.play();
      }

      // Apply cooldown - reuse the same cooldown mechanism as shoot
      // You can adjust the cooldown time if knives should have different cooldown than guns
      this.shootCooldown = this.maxCooldown;

      // Set timeout to return to normal animation
      setTimeout(() => {
        // Only reset if still in attack animation (could have changed due to other actions)
        if (this.animationState === "attack") {
          // Return to appropriate animation based on current state
          if (!this.settings.onGround) {
            if (this.activePerks.includes("jump")) {
              this.animationState = "superjump";
            } else {
              this.animationState = "jump";
            }
          } else if (this.controls.left || this.controls.right) {
            this.animationState = "run";
          } else {
            this.animationState = "idle";
          }
        }
      }, 500); // Attack animation duration
    }
  }

  updateProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) =>
      projectile.update()
    );
  }

  updatePlayerSheet() {
    console.log(this.selectedItem);
    if (!this.selectedItem) {
      this.spriteSheets.idle.image.src = `./assets/img/player/${this.chartype}/idle.png`;
      this.spriteSheets.run.image.src = `./assets/img/player/${this.chartype}/run.png`;
      this.spriteSheets.jump.image.src = `./assets/img/player/${this.chartype}/jump.png`;
      this.spriteSheets.attack.image.src = `./assets/img/player/${this.chartype}/attack.png`;
    } else if (this.selectedItem.name === "railgun") {
      this.spriteSheets.idle.image.src = `./assets/img/player/${this.chartype}/railgun_idle.png`;
      this.spriteSheets.run.image.src = `./assets/img/player/${this.chartype}/railgun_run.png`;
      this.spriteSheets.jump.image.src = `./assets/img/player/${this.chartype}/railgun_jump.png`;
      this.spriteSheets.attack.image.src = `./assets/img/player/${this.chartype}/railgun_run.png`;
    } else if (this.selectedItem.name === "katana") {
      this.spriteSheets.idle.image.src = `./assets/img/player/${this.chartype}/katana_idle.png`;
      this.spriteSheets.run.image.src = `./assets/img/player/${this.chartype}/katana_run.png`;
      this.spriteSheets.jump.image.src = `./assets/img/player/${this.chartype}/katana_jump.png`;
      this.spriteSheets.attack.image.src = `./assets/img/player/${this.chartype}/katana_jump.png`;
    } else if (this.selectedItem.name === "mantisblade") {
      this.spriteSheets.idle.image.src = `./assets/img/player/${this.chartype}/mantisblade_idle.png`;
      this.spriteSheets.run.image.src = `./assets/img/player/${this.chartype}/mantisblade_run.png`;
      this.spriteSheets.jump.image.src = `./assets/img/player/${this.chartype}/mantisblade_jump.png`;
      this.spriteSheets.attack.image.src = `./assets/img/player/${this.chartype}/mantisblade_attack.png`;
    } else {
      this.spriteSheets.idle.image.src = `./assets/img/player/${this.chartype}/idle.png`;
      this.spriteSheets.run.image.src = `./assets/img/player/${this.chartype}/run.png`;
      this.spriteSheets.jump.image.src = `./assets/img/player/${this.chartype}/jump.png`;
      this.spriteSheets.attack.image.src = `./assets/img/player/${this.chartype}/attack.png`;
    }
  }

  update() {
    // Update direction based on controls
    if (this.controls.left) {
      this.lastDirectionRight = false;
    } else if (this.controls.right) {
      this.lastDirectionRight = true;
    }

    // Only update animation state if not in attack animation
    // This prevents the attack animation from being interrupted
    if (this.animationState !== "attack") {
      if (!this.settings.onGround) {
        if (this.activePerks.includes("jump")) {
          this.animationState = "superjump";
        } else {
          this.animationState = "jump";
        }
      } else if (this.controls.left || this.controls.right) {
        this.animationState = "run";
      } else {
        this.animationState = "idle";
      }
    }

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
        this.stats.kills += amount;
      } else if (type === "remove") {
        this.stats.kills -= amount;
      } else if (type === "set") {
        this.stats.kills = amount;
      }
    } else if (stat === "deaths") {
      if (type === "add") {
        this.stats.deaths += amount;
      } else if (type === "remove") {
        this.stats.deaths -= amount;
      } else if (type === "set") {
        this.stats.deaths = amount;
      }
    }
    let character = JSON.parse(localStorage.getItem("characters")).find(
      (c) => c.id === this.id
    );
    character.stats = this.stats;
    let characters = JSON.parse(localStorage.getItem("characters")).map((c) => {
      if (c.id === character.id) {
        return (c = character);
      }
      return c;
    });
    localStorage.setItem("characters", JSON.stringify(characters));
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

    // Check if player died
    if (this.health <= 0 && !this.dead) {
      this.dead = true;
      Gameover_Handler();
      this.updateStats("deaths", "add", 1);
      game.sounds.death.play();
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
    } else if (this.getTileAt(x + this.settings.width, bottomY) === "Y") {
      return { collides: true, type: "Y" };
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

    if (!newInventory) return;
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
        locales[settings.language].notifyInventoryTitle,
        `Du hast ${newItem.label} ${newItem.amount}x für ${newItem.price} Coins gekauft`,
        "info",
        3500
      );
    } else {
      Notify(
        locales[settings.language].notifyInventoryTitle,
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
      locales[settings.language].notifyInventoryTitle,
      "Der Perk " + perks[perk].label + " wurde installiert",
      "success",
      3500
    );
  }

  updateCoins(type, newCoin, from = "normal") {
    let characters = JSON.parse(localStorage.getItem("characters"));
    let character = characters.find((c) => Number(c.id) === Number(this.id));
    if (type === "add") {
      this.coins += newCoin.amount;
    } else if (type === "remove") {
      this.coins -= newCoin.amount;
    } else if (type === "set") {
      this.coins = newCoin.amount;
    }

    console.log(this.coins);

    character.coins = this.coins;
    console.log(character);
    if (from !== "shop") {
      characters
        .find((c) => c.id === this.id)
        .levels.find((l) => l.level === game.core.currentLevel)
        .coinsCollected.push(newCoin.id);
    }

    localStorage.setItem("characters", JSON.stringify(characters));
    this.loadCoins();
    if (from === "normal") {
      Notify(
        locales[settings.language].notifyInventoryTitle,
        `Du hast ${newCoin.amount}x Coins eingesammelt`,
        "info",
        3500
      );
    }
  }

  removeInventoryItem(item, amount, onMap = true) {
    if (item?.name) {
      let newInventory = this.inventory
        .map((invItem) => {
          if (invItem.name === item.name) {
            invItem.amount -= amount;
            if (invItem.amount <= 0) {
              return null; // Remove item from inventory
            }
            return invItem; // Keep item in inventory
          }
          return invItem; // Keep item in inventory
        })
        .filter(Boolean); // Filter out null values

      let characters = JSON.parse(localStorage.getItem("characters")).map(
        (c) => {
          if (c.id === this.id) {
            c.inventory = newInventory;
          }
          return c;
        }
      );
      localStorage.setItem("characters", JSON.stringify(characters));
      this.inventory = newInventory;
      this.loadInventory();
      renderInventoryItemSelection(true);
      if (onMap) {
        console.log(item);
        game.map.itemsOnFloor.setItems(item);
      }
    }
  }

  updateKilledEnemy(id) {
    let characters = JSON.parse(localStorage.getItem("characters")) || [];
    let character = characters.find((c) => c.id === this.id);

    if (character) {
      let levelIndex = character.levels.findIndex(
        (l) => l.level === game.core.currentLevel
      );

      if (levelIndex !== -1) {
        character.levels[levelIndex].enemiesKilled.push(id);
        // Speichern der aktualisierten `characters`-Liste in localStorage
        localStorage.setItem("characters", JSON.stringify(characters));
      }
    }
  }

  move() {
    if (this.dead) return;
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

      if (collision.type === "Y") {
        Nextlevel_Handler();
      }

      if (this.settings.onGround && game.sounds.run.paused) {
        game.sounds.run.play();
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

      if (collision.type === "Y") {
        Nextlevel_Handler();
      }

      if (this.settings.onGround && game.sounds.run.paused) {
        game.sounds.run.play();
      }
    }

    if (
      (!this.controls.left && !this.controls.right) ||
      !this.settings.onGround
    ) {
      if (!game.sounds.run.paused) {
        game.sounds.run.pause();
        game.sounds.run.currentTime = 0;
      }
    }

    if (this.settings.onGround && this.controls.up) {
      game.sounds.jump.pause();
      game.sounds.jump.currentTime = 0;
      game.sounds.jump.play();
      this.settings.onGround = false;
      this.settings.fall = -this.settings.jumpForce;
    }

    // Rest of the method remains the same
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
