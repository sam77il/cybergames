async function initiateGameCanvas(id, level) {
  screens.game.innerHTML = `
    <div id="game-screen-box">
      <div id="game-screen-hud">
        <div class="game-screen-hud-left">
          <div id="game-screen-hud-health">
            <div id="game-screen-hud-health-bar"></div>
          </div>
          <div class="game-screen-hud-coin">
            <img src="./assets/img/items/coin.png" alt="coin img">
            <p id="game-screen-hud-coin-amount">Loading...</p>
          </div>
        </div>
        <div id="perks">
          <img id="perk-jump" src="./assets/img/perks/jump.png">
          <img id="perk-speed" src="./assets/img/perks/speed.png">
          <img id="perk-instakill" src="./assets/img/perks/instakill.png">
        </div>
      </div>
      <div id="game-screen-helpnotify" style="display: none;"></div>
      <div id="game-screen-inventory">
        <div class="game-screen-inventory-slot" id="game-screen-inventory-slot-1"></div>
        <div class="game-screen-inventory-slot" id="game-screen-inventory-slot-2"></div>
        <div class="game-screen-inventory-slot" id="game-screen-inventory-slot-3"></div>
        <div class="game-screen-inventory-slot" id="game-screen-inventory-slot-4"></div>
      </div>
      <canvas id="game-screen-canvas"></canvas>
    </div>
  `;
  let gameScreenBox = document.querySelector("#game-screen-box");
  initializeInteractionSystem();
  setupInventoryControls();
  initParallaxBackground();
  game.ui.healthBar = document.querySelector("#game-screen-hud-health-bar");
  game.ui.helpNotify = document.querySelector("#game-screen-helpnotify");
  game.ui.inventory;
  game.ui.inventory.slot1 = document.querySelector(
    "#game-screen-inventory-slot-1"
  );
  game.ui.inventory.slot2 = document.querySelector(
    "#game-screen-inventory-slot-2"
  );
  game.ui.inventory.slot3 = document.querySelector(
    "#game-screen-inventory-slot-3"
  );
  game.ui.inventory.slot4 = document.querySelector(
    "#game-screen-inventory-slot-4"
  );
  gameScreenBox.style.width = config.global.width + "px";
  gameScreenBox.style.height = config.global.height + "px";
  game.canvas.main = document.querySelector("#game-screen-canvas");
  game.canvas.main.style.backgroundColor = "#333";
  game.canvas.mainCtx = game.canvas.main.getContext("2d");
  game.canvas.main.width = config.global.width;
  game.canvas.main.height = config.global.height;
  game.canvas.main.style.objectFit = "contain";

  game.core = new Game(level);
  await loadMap(game.core.map, game.core.tileSize);
  game.player = new Player(50, 300, 50, 80, id);
  if (game.core.currentLevel === 1) {
    game.npc = new Npc(400, 550, 50, 100, level);
    game.npc.initialize();
  }
  game.player.initialize();
  game.player.updateHealth("set", 100);
  game.ui.healthBar.style.width = game.player.health + "%";
  game.enemies = [];
  game.core.loadEnemies();
  for (let item of game.core.mapItems) {
    item.collected = false;
  }
  for (let coin of game.core.mapCoins) {
    coin.collected = false;
  }

  game.map.itemsOnFloor = new Items(game.core.mapItems);
  game.map.itemsOnFloor.initialize();
  game.map.coinsOnFloor = new Coins(game.core.mapCoins);
  game.map.coinsOnFloor.initialize();

  game.camera = {
    x: 0,
    y: 0,
    width: game.canvas.main.width,
    height: game.canvas.main.height,
    update: function (playerX, playerY) {
      // Center the camera on the player
      this.previousX = this.x;

      this.x = playerX - this.width / 2 + game.player.settings.width / 2;
      this.y = playerY - this.height / 2 + game.player.settings.height / 2;

      // Constrain camera to map boundaries
      this.x = Math.max(
        0,
        Math.min(
          this.x,
          game.core.map[0].length * game.core.tileSize - this.width
        )
      );
      this.y = Math.max(
        0,
        Math.min(
          this.y,
          game.core.map.length * game.core.tileSize - this.height
        )
      );
      // Parallax-Effekt - Aktualisiere basierend auf der Kamera-Position
      updateParallaxOffset(this.x, this.previousX);
    },
  };

  listenToControls(true);
  startGameLoop();
}

function handleKeyDown(e) {
  switch (e.key) {
    case settings.controls.walkRight:
      game.player.controls.right = true;
      break;
    case settings.controls.walkLeft:
      game.player.controls.left = true;
      break;
    case settings.controls.jump:
      game.player.controls.up = true;
      break;
    case "Escape":
      handlePauseMenu();
      break;
    case "h":
      game.player.updateHealth("remove", 10);
      break;
    case "p":
      handlePauseMenu();
      break;
    case "q":
      Perks_Jumphandler();
      break;
    case "e":
      Perks_Speedhandler();
      break;
    case "x":
      Perks_Instakillhandler();
      break;
  }
}

function handleResume(e) {
  switch (e.key) {
    case "Escape":
      handlePauseMenu();
      break;
    case "p":
      handlePauseMenu();
      break;
  }
}

function handlePauseMenu() {
  listenToControls(false);
  if (game.player.pauseMenu) {
    const pauseMenu = document.querySelector("#pause-menu");
    screens.game.removeChild(pauseMenu);
    resumeGame();
    listenToControls(true);
    return;
  }
  game.paused = true;
  game.player.pauseMenu = true;
  if (document.querySelector("#pause-menu")?.id === "pause-menu") {
    screens.game.removeChild(document.querySelector("#pause-menu"));
  }
  const pauseMenu = document.createElement("div");
  screens.game.appendChild(pauseMenu);
  pauseMenu.setAttribute("id", "pause-menu");
  pauseMenu.innerHTML = `
    <div class="menus-content pause-menu">
      <h2>${locales[settings.language].pauseMenuTitle}</h2>

      <div class="pause-menu-actions">
        <img id="resume" class="img-btn small-btn" src="./assets/img/de_imgs/Weiter_bttn.png">
        <img id="shop" class="img-btn small-btn" src="./assets/img/de_imgs/Shop_Bttn.png">
        <img id="settings" class="img-btn small-btn" src="./assets/img/de_imgs/Einstellungen_Bttn.png">
        <img id="quit" class="img-btn small-btn" src="./assets/img/de_imgs/Verlassen_Bttn.png">
      </div>
    </div>
  `;

  const shopButton = pauseMenu.querySelector("#shop");
  shopButton.addEventListener("click", () => {
    pauseMenu.innerHTML = "";
    screens.shop = document.createElement("div");
    screens.shop.setAttribute("id", "shop");
    pauseMenu.appendChild(screens.shop);
    Shop_Handler();
  });

  const resumeButton = pauseMenu.querySelector("#resume");
  resumeButton.addEventListener("click", () => {
    screens.game.removeChild(pauseMenu);
    resumeGame();
  });

  const settingsButton = pauseMenu.querySelector("#settings");
  settingsButton.addEventListener("click", () => {
    pauseMenu.innerHTML = "";
    screens.settings = document.createElement("div");
    screens.settings.setAttribute("id", "settings");
    pauseMenu.appendChild(screens.settings);
    Settings_Handler();
  });

  const quitButton = pauseMenu.querySelector("#quit");
  quitButton.addEventListener("click", async () => {
    await ChangeScreen("main-menu");
    screens.game.innerHTML = "";
    game.paused = true;
  });
}

function resumeGame() {
  listenToControls(true);
  game.paused = false;
  game.player.pauseMenu = false;
}

function handleKeyUp(e) {
  switch (e.key) {
    case settings.controls.walkRight:
      game.player.controls.right = false;
      break;
    case settings.controls.walkLeft:
      game.player.controls.left = false;
      break;
    case settings.controls.jump:
      game.player.controls.up = false;
      break;
  }
}

function listenToControls(state) {
  if (state) {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.removeEventListener("keydown", handleResume);
  } else {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleResume);
  }
}

const targetFPS = 60;
const frameDuration = 1000 / targetFPS;

let lastTime = 0;

function startGameLoop(currentTime) {
  requestAnimationFrame(startGameLoop);
  const deltaTime = currentTime - lastTime;

  if (deltaTime >= frameDuration && !game.paused) {
    lastTime = currentTime - (deltaTime % frameDuration);

    game.canvas.mainCtx.clearRect(
      0,
      0,
      config.global.width,
      config.global.height
    );

    // Update camera position
    game.camera.update(game.player.posX, game.player.posY);

    updateParallaxLayers();
    drawParallaxLayers();

    // Draw background with camera offset
    game.canvas.mainCtx.save();
    game.canvas.mainCtx.translate(-game.camera.x, -game.camera.y);
    game.canvas.mainCtx.drawImage(game.canvas.bg, 0, 0);

    game.player.update();
    if (game.core.currentLevel === 1) {
      game.npc.update();
    }

    for (let enemy of game.enemies) {
      enemy.update();
    }

    game.map.itemsOnFloor.update();
    game.map.coinsOnFloor.update();
    game.canvas.mainCtx.restore();
  }
}

function loadMap(map, size) {
  return new Promise((resolve, reject) => {
    game.canvas.bg = document.createElement("canvas");
    game.canvas.bg.width = map[0].length * size; // Total map width
    game.canvas.bg.height = map.length * size; // Total map height
    game.canvas.bgCtx = game.canvas.bg.getContext("2d");

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        let pos = config.global.tiles.indexOf(map[row].charAt(col));

        if (pos >= 0) {
          // if (
          //   config.global.tiles[pos] === "G" ||
          //   config.global.tiles[pos] === "H"
          // ) {
          //   bgCtx.shadowColor = "red";
          //   bgCtx.shadowOffsetX = 0;
          //   bgCtx.shadowOffsetY = 0;
          //   bgCtx.shadowBlur = 50;
          // } else {
          //   bgCtx.shadowColor = "transparent";
          // }

          game.canvas.bgCtx.drawImage(
            game.map.tileset,
            game.core.tileSize * pos,
            0,
            game.core.tileSize,
            game.core.tileSize,
            game.core.tileSize * col,
            game.core.tileSize * row,
            game.core.tileSize,
            game.core.tileSize
          );
        }
      }
    }
    resolve();
  });
}
