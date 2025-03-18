async function initiateGameCanvas(playerId) {
  GAME_SCREEN.innerHTML = `
    <div id="game-screen-box">
      <div id="game-screen-hud">
        <div id="game-screen-hud-health">
          <div id="game-screen-hud-health-bar"></div>
        </div>
        <div id="perks">
          <img id="perk1" src="./assets/img/perk_1.png">
          <img id="perk2" src="./assets/img/perk_2.png">
          <img id="perk3" src="./assets/img/perk_3.png">
        </div>
      </div>
      <div id="game-screen-helpnotify" style="display: none;">
        <!-- <div class="game-screen-helpnotify-item">E Sword</div> -->
      </div>
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
  healtBar = document.querySelector("#game-screen-hud-health-bar");
  helpNotify = document.querySelector("#game-screen-helpnotify");
  playerInventory.slot1.element = document.querySelector(
    "#game-screen-inventory-slot-1"
  );
  playerInventory.slot2.element = document.querySelector(
    "#game-screen-inventory-slot-2"
  );
  playerInventory.slot3.element = document.querySelector(
    "#game-screen-inventory-slot-3"
  );
  playerInventory.slot4.element = document.querySelector(
    "#game-screen-inventory-slot-4"
  );
  gameScreenBox.style.width = gameConfig.global.width + "px";
  gameScreenBox.style.height = gameConfig.global.height + "px";
  canvas = document.querySelector("#game-screen-canvas");
  canvas.style.backgroundColor = "#333";
  ctx = canvas.getContext("2d");
  canvas.width = gameConfig.global.width;
  canvas.height = gameConfig.global.height;
  canvas.style.objectFit = "contain";

  game = new Game();
  await loadMap(game.map, game.tileSize);
  player = new Player(50, 300, 50, 80, playerId);
  player.initialize();
  healtBar.style.width = player.playerHealth + "%";
  console.log(player.playerPosX, player.playerPosY);
  for (let item of game.mapItems) {
    item.collected = false;
    mapItems.push(item);
  }

  spawnedItems = new Items(mapItems);
  spawnedItems.initialize();

  // Initialize camera
  camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    update: function (playerX, playerY) {
      // Center the camera on the player
      this.x = playerX - this.width / 2 + player.playerWidth / 2;
      this.y = playerY - this.height / 2 + player.playerHeight / 2;

      // Constrain camera to map boundaries
      this.x = Math.max(
        0,
        Math.min(this.x, game.map[0].length * game.tileSize - this.width)
      );
      this.y = Math.max(
        0,
        Math.min(this.y, game.map.length * game.tileSize - this.height)
      );
      // Parallax-Effekt - Aktualisiere basierend auf der Kamera-Position
      updateParallaxOffset(this.x);
    },
  };

  listenToControls(true);
  startGameLoop();
}

function handleKeyDown(e) {
  switch (e.key) {
    case gameSettings.controls.walkRight:
      controls.right = true;
      break;
    case gameSettings.controls.walkLeft:
      controls.left = true;
      break;
    case gameSettings.controls.jump:
      controls.up = true;
      break;
    case "Escape":
      handlePauseMenu();
      break;
    case "h":
      player.updateHealth("remove", 50);
      break;
    case "p":
      handlePauseMenu();
      break;
  }
}

function handlePauseMenu() {
  listenToControls(false);
  isInPause = true;

  if (document.querySelector("#pause-menu")?.id === "pause-menu") {
    GAME_SCREEN.removeChild(document.querySelector("#pause-menu"));
  }
  const pauseMenu = document.createElement("div");
  pauseMenu.setAttribute("id", "pause-menu");
  pauseMenu.innerHTML = `
    <h1>${locales[gameSettings.language].pauseMenuTitle}</h1>
    <button id="resume">${
      locales[gameSettings.language].pauseMenuResumeButton
    }</button>
    <button id="settings">${
      locales[gameSettings.language].pauseMenuSettingsButton
    }</button>
    <button id="quit">${
      locales[gameSettings.language].pauseMenuQuitButton
    }</button>
  `;

  GAME_SCREEN.appendChild(pauseMenu);

  const resumeButton = pauseMenu.querySelector("#resume");
  resumeButton.addEventListener("click", () => {
    GAME_SCREEN.removeChild(pauseMenu);
    listenToControls(true);
    isInPause = false;
  });

  const settingsButton = pauseMenu.querySelector("#settings");
  settingsButton.addEventListener("click", () => {
    pauseMenu.innerHTML = "";
    SETTINGS = document.createElement("div");
    SETTINGS.setAttribute("id", "settings");
    pauseMenu.appendChild(SETTINGS);
    Settings_Handler();
  });

  const quitButton = pauseMenu.querySelector("#quit");
  quitButton.addEventListener("click", async () => {
    await ChangeScreen("main-menu");
    GAME_SCREEN.innerHTML = "";
    isInPause = false;
  });
}

function handleKeyUp(e) {
  switch (e.key) {
    case gameSettings.controls.walkRight:
      controls.right = false;
      break;
    case gameSettings.controls.walkLeft:
      controls.left = false;
      break;
    case gameSettings.controls.jump:
      controls.up = false;
      break;
  }
}

function listenToControls(state) {
  if (state) {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  } else {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  }
}

const targetFPS = 60;
const frameDuration = 1000 / targetFPS;

let lastTime = 0;

function startGameLoop(currentTime) {
  requestAnimationFrame(startGameLoop);
  const deltaTime = currentTime - lastTime;

  if (deltaTime >= frameDuration && !isInPause) {
    lastTime = currentTime - (deltaTime % frameDuration);

    ctx.clearRect(0, 0, gameConfig.global.width, gameConfig.global.height);

    // Update camera position
    camera.update(player.playerPosX, player.playerPosY);

    updateParallaxLayers();
    drawParallaxLayers();

    // Draw background with camera offset
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    ctx.drawImage(bgCanvas, 0, 0);

    player.move(controls);
    player.update();
    spawnedItems.update();
    ctx.restore();
  }
}

function loadMap(map, size) {
  return new Promise((resolve, reject) => {
    bgCanvas = document.createElement("canvas");
    bgCanvas.width = map[0].length * size; // Total map width
    bgCanvas.height = map.length * size; // Total map height
    bgCtx = bgCanvas.getContext("2d");

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        let pos = gameConfig.global.tiles.indexOf(map[row].charAt(col));

        if (pos >= 0) {
          // if (
          //   gameConfig.global.tiles[pos] === "G" ||
          //   gameConfig.global.tiles[pos] === "H"
          // ) {
          //   bgCtx.shadowColor = "red";
          //   bgCtx.shadowOffsetX = 0;
          //   bgCtx.shadowOffsetY = 0;
          //   bgCtx.shadowBlur = 50;
          // } else {
          //   bgCtx.shadowColor = "transparent";
          // }

          bgCtx.drawImage(
            tileset,
            game.tileSize * pos,
            0,
            game.tileSize,
            game.tileSize,
            game.tileSize * col,
            game.tileSize * row,
            game.tileSize,
            game.tileSize
          );
        }
      }
    }
    resolve();
  });
}
