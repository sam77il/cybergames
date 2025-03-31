class Enemy {
  constructor(
    startPosX,
    startPosY,
    width,
    height,
    health,
    items,
    enemyId,
    type
  ) {
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
      isAttacking: false, // Neue Variable für den Angriffszustand
      attackAnimationDuration: 30, // Dauer der Angriffsanimation in Frames (30 frames ≈ 0.5 Sekunden)
      attackAnimationTimer: 0, // Timer für die Angriffsanimation
    };
    this.id = enemyId;

    this.shootCooldown = 0;
    this.maxCooldown = 60;
    this.projectiles = [];
    this.damage = 10;

    this.lastDirectionRight = true;

    // Sprite sheets for different states
    this.spriteSheets = {
      run: {
        image: new Image(),
        frames: 6,
        frameWidth: 96,
        frameHeight: 96,
      },
      idle: {
        image: new Image(),
        frames: 4,
        frameWidth: 96,
        frameHeight: 96,
      },
      jump: {
        image: new Image(),
        frames: 4,
        frameWidth: 96,
        frameHeight: 96,
      },
      attack: {
        image: new Image(),
        frames: 6,
        frameWidth: 96,
        frameHeight: 96,
      },
    };

    // Set sprite sheet sources
    this.spriteSheets.idle.image.src = `./assets/img/enemy/${this.settings.type}/idle.png`;
    this.spriteSheets.run.image.src = `./assets/img/enemy/${this.settings.type}/run.png`;
    this.spriteSheets.jump.image.src = `./assets/img/enemy/${this.settings.type}/jump.png`;
    this.spriteSheets.attack.image.src = `./assets/img/enemy/${this.settings.type}/attack.png`;

    this.animationState = "idle"; // Default state
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.framesPerSecond = 10;
    this.frameInterval = 1000 / this.framesPerSecond;
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
        "enemy",
        this.damage
      );

      this.projectiles.push(projectile);

      this.shootCooldown = this.maxCooldown;

      // Starten der Angriffsanimation
      this.state.isAttacking = true;
      this.state.attackAnimationTimer = this.state.attackAnimationDuration;
      this.animationState = "attack";
      this.currentFrame = 0; // Animation von Anfang an starten
    }
  }

  updateProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) =>
      projectile.update()
    );
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
      if (this.currentFrame === currentSpriteSheet.frames - 1) {
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
    const scaleFactor = 2.7; // Größenfaktor, z.B. 1.5 für 50% größer
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
      this.lastDirectionRight = false;
    } else {
      this.controls.right = true;
      this.lastDirectionRight = true;
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

    // Aktualisiere den Attack-Animation-Timer
    if (this.state.isAttacking) {
      this.state.attackAnimationTimer--;
      if (this.state.attackAnimationTimer <= 0) {
        this.state.isAttacking = false;
      }
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
    this.resolvePlayerCollision();

    // Setze animationState je nach Zustand
    if (this.state.isAttacking) {
      this.animationState = "attack";
    } else if (!this.settings.onGround) {
      this.animationState = "jump";
    } else if (this.controls.left || this.controls.right) {
      this.animationState = "run";
    } else {
      this.animationState = "idle";
    }

    this.draw();
    this.move();
    this.updateProjectiles();
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
      // Der Angriffszustand hat jetzt höhere Priorität als der Cooldown
      if (this.shootCooldown === 0) {
        this.shoot(); // Diese Methode setzt jetzt auch isAttacking und den Timer
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
    game.player.updateKilledEnemy(this.id);
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
    if (this.dead) return;
    let nextX = this.posX;
    let nextY = this.posY;

    // Bewege den Gegner nicht, wenn er gerade angreift
    if (this.state.isAttacking) {
      // Nur Gravitation und Bodenkollision anwenden, keine horizontale Bewegung
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
      }

      this.posY = nextY;
      return;
    }

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

      // Play run sound if not already playing
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

      // Play run sound if not already playing
      if (this.settings.onGround && game.sounds.run.paused) {
        game.sounds.run.play();
      }
    }

    // Stop run sound if player stopped running or is in the air
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
