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
      speed: 3,
      gravity: 1,
      fall: 0,
      jumpForce: 20,
      onGround: false,
      detectionRange: 300,
      chaseRange: 600,
    };
    this.controls = {
      left: false,
      right: false,
      up: false,
    };
    this.state = {
      isChasing: false,
      lastDirectionRight: true,
    };
    this.id = Math.random().toString(36).substr(2, 9);

    this.shootCooldown = 0;
    this.maxCooldown = 60;
    this.projectiles = [];
    this.damage = 10;
  }

  initialize() {
    this.draw();
  }

  shoot() {
    if (!game.player.dead) {
      const directionToPlayer = this.posX < game.player.posX ? 1 : -1;

      const projectileX =
        directionToPlayer > 0 ? this.posX + this.settings.width : this.posX;

      const projectileY = this.posY + this.settings.height / 2;

      const projectile = new Projectile(
        projectileX,
        projectileY,
        directionToPlayer,
        this.settings.type,
        this.damage
      );

      this.projectiles.push(projectile);

      this.shootCooldown = this.maxCooldown;
    }
  }

  updateProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) =>
      projectile.update()
    );
  }

  draw() {
    switch (this.settings.type) {
      case "bot":
        game.canvas.mainCtx.fillStyle = "blue";
        break;
      case "mutated":
        game.canvas.mainCtx.fillStyle = "green";
        break;
      case "cyberpsycho":
        game.canvas.mainCtx.fillStyle = "red";
        break;
      default:
        game.canvas.mainCtx.fillStyle = "gray";
    }

    game.canvas.mainCtx.fillRect(
      this.posX,
      this.posY,
      this.settings.width,
      this.settings.height
    );

    this.projectiles.forEach((projectile) => projectile.draw());
  }

  distanceToPlayer() {
    const centerX = this.posX + this.settings.width / 2;
    const centerY = this.posY + this.settings.height / 2;
    const playerCenterX = game.player.posX + game.player.settings.width / 2;
    const playerCenterY = game.player.posY + game.player.settings.height / 2;

    return Math.sqrt(
      Math.pow(centerX - playerCenterX, 2) +
        Math.pow(centerY - playerCenterY, 2)
    );
  }

  decideMovementDirection() {
    if (game.player.dead) {
      this.controls.left = false;
      this.controls.right = false;
      this.controls.up = false;
      return;
    }

    const playerCenterX = game.player.posX + game.player.settings.width / 2;
    const enemyCenterX = this.posX + this.settings.width / 2;

    this.controls.left = false;
    this.controls.right = false;
    this.controls.up = false;

    if (playerCenterX < enemyCenterX) {
      this.controls.left = true;
      this.state.lastDirectionRight = false;
    } else {
      this.controls.right = true;
      this.state.lastDirectionRight = true;
    }

    const nextX = this.controls.left
      ? this.posX - this.settings.speed
      : this.posX + this.settings.speed;

    const collision = this.isColliding(nextX, this.posY);

    if (collision.collides && collision.type === "block") {
      if (this.settings.onGround) {
        this.controls.up = true;
      }
    }
  }

  checkCollisionWithPlayer() {
    return (
      this.posX < game.player.posX + game.player.settings.width &&
      this.posX + this.settings.width > game.player.posX &&
      this.posY < game.player.posY + game.player.settings.height &&
      this.posY + this.settings.height > game.player.posY
    );
  }

  resolvePlayerCollision() {
    // Prüfe, ob der Spieler steht (nicht links oder rechts bewegt)
    const playerIsStanding =
      !game.player.controls.left && !game.player.controls.right;

    if (this.checkCollisionWithPlayer() && playerIsStanding) {
      const overlapX = Math.min(
        this.posX + this.settings.width - game.player.posX,
        game.player.posX + game.player.settings.width - this.posX
      );
      const overlapY = Math.min(
        this.posY + this.settings.height - game.player.posY,
        game.player.posY + game.player.settings.height - this.posY
      );

      if (overlapX < overlapY) {
        // Horizontale Kollision
        if (this.posX < game.player.posX) {
          // Gegner links vom Spieler
          this.posX -= overlapX;
        } else {
          // Gegner rechts vom Spieler
          this.posX += overlapX;
        }
      } else {
        // Vertikale Kollision
        if (this.posY < game.player.posY) {
          // Gegner über dem Spieler
          this.posY -= overlapY;
        } else {
          // Gegner unter dem Spieler
          this.posY += overlapY;
        }
      }
    }
  }

  update() {
    if (this.health <= 0) {
      this.die();
      return false;
    }

    const distance = this.distanceToPlayer();

    if (distance <= this.settings.detectionRange) {
      this.state.isChasing = true;
    }

    if (
      this.state.isChasing &&
      distance <= this.settings.chaseRange &&
      !game.player.dead
    ) {
      this.decideMovementDirection();
    } else {
      this.controls.left = false;
      this.controls.right = false;
      this.controls.up = false;
      this.state.isChasing = false;
    }

    this.handleShooting();

    this.updateProjectiles();

    this.resolveEnemyCollisions();
    this.resolvePlayerCollision(); // Füge diese Zeile hinzu

    this.draw();
    this.move();

    return true;
  }

  resolveEnemyCollisions() {
    for (let otherEnemy of game.enemies) {
      if (otherEnemy.id === this.id) continue;

      if (this.checkCollisionWithEnemy(otherEnemy)) {
        this.resolveCollision(otherEnemy);
      }
    }
  }

  checkCollisionWithEnemy(otherEnemy) {
    return (
      this.posX < otherEnemy.posX + otherEnemy.settings.width &&
      this.posX + this.settings.width > otherEnemy.posX &&
      this.posY < otherEnemy.posY + otherEnemy.settings.height &&
      this.posY + this.settings.height > otherEnemy.posY
    );
  }

  resolveCollision(otherEnemy) {
    const overlapX = Math.min(
      this.posX + this.settings.width - otherEnemy.posX,
      otherEnemy.posX + otherEnemy.settings.width - this.posX
    );
    const overlapY = Math.min(
      this.posY + this.settings.height - otherEnemy.posY,
      otherEnemy.posY + otherEnemy.settings.height - this.posY
    );

    if (overlapX < overlapY) {
      if (this.posX < otherEnemy.posX) {
        this.posX -= overlapX / 2;
        otherEnemy.posX += overlapX / 2;
      } else {
        this.posX += overlapX / 2;
        otherEnemy.posX -= overlapX / 2;
      }
    } else {
      if (this.posY < otherEnemy.posY) {
        this.posY -= overlapY / 2;
        otherEnemy.posY += overlapY / 2;
      } else {
        this.posY += overlapY / 2;
        otherEnemy.posY -= overlapY / 2;
      }
    }
  }

  handleShooting() {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    if (
      this.state.isChasing &&
      this.distanceToPlayer() <= this.settings.chaseRange &&
      !game.player.dead
    ) {
      if (this.shootCooldown === 0) {
        this.shoot();
      }
    }
  }

  die() {
    console.log(Math.floor(this.posX / config.global.tileSize));
    if (this.items && this.items.length > 0) {
      this.items.forEach((item) => {
        game.map.itemsOnFloor.setItems({
          name: items[item.name].name,
          label: items[item.name].label,
          amount: item.amount,
          position: {
            x: Math.floor(this.posX / config.global.tileSize),
            y: Math.floor(this.posY / config.global.tileSize),
          },
        });
      });
    }

    if (this.coins) {
      game.map.itemsOnFloor.setItems({
        name: "coin",
        label: "Coin",
        amount: this.coins,
        position: {
          x: Math.floor(this.posX / config.global.tileSize),
          y: Math.floor(this.posY / config.global.tileSize),
        },
      });
    }

    game.enemies = game.enemies.filter((enemy) => enemy.id !== this.id);

    game.player.updateStats("kills", "add", 1);
  }

  updateHealth(type, amount) {
    if (type === "set") {
      this.health = amount;
    } else if (type === "add") {
      this.health += amount;
    } else if (type === "remove") {
      this.health -= amount;
    }
    console.log("Enemy health: " + this.health);

    if (this.health <= 0) {
      this.die();
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

  move() {
    let nextX = this.posX;
    let nextY = this.posY;

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
