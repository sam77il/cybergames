let LEVEL_LIST = null;

function LevelSelection_Handler(id, chartype) {
  screens.level_selection.innerHTML = `
    <div class="menus-background"></div>
    <div class="menus-content">
      <h2 class="level-selection-title">${
        locales[settings.language].levelSelectionScreenTitle
      }</h2>

      <div id="level-list"></div>

      <div class="level-selection-actions">
        <img class="img-btn" id="level-selection-back" src="./assets/img/${
          settings.language
        }_imgs/back_btn.png">
      </div>
    </div>
  `;

  LEVEL_LIST = document.querySelector("#level-list");
  const LEVEL_BACK = document.querySelector("#level-selection-back");

  LEVEL_BACK.addEventListener("click", () => {
    game.sounds.ui.pause();
    game.sounds.ui.currentTime = 0;
    game.sounds.ui.play();
    ChangeScreen("character-selection");
  });

  console.log(chartype);

  for (let level of config.levels) {
    LevelItem(level, id, chartype);
  }
  const START_BUTTONS = document.querySelectorAll(".level-selection-start");

  for (let button of START_BUTTONS) {
    button.addEventListener("click", StartGame);
  }
}

async function StartGame(event) {
  game.sounds.ui.pause();
  game.sounds.ui.currentTime = 0;
  game.sounds.ui.play();
  game.paused = false;
  game.pauseMenu = false;
  await ChangeScreen("game-screen");
  initiateGameCanvas(
    event.target.dataset.id,
    event.target.dataset.chartype,
    Number(event.target.dataset.level)
  );
}

function LevelItem({ label, level, enemies, items }, id, chartype) {
  let characters = JSON.parse(localStorage.getItem("characters"));
  let character = characters.find((c) => Number(c.id) === Number(id));
  let classList = null;
  console.log(chartype);
  if (character.levels.find((l) => l.level === level)) {
    classList = "level-selection-start";
  } else {
    classList = "level-selection-start-disabled";
  }

  LEVEL_LIST.innerHTML += `
    <div class="level-selection-item">
      <p>${
        locales[settings.language].levelSelectionScreenName
      }: <b>${label}</b></p>
      <p>${
        locales[settings.language].levelSelectionScreenLevel
      }: <b>${level}</b></p>
      <p>${locales[settings.language].levelSelectionScreenEnemies}: <b>${
    enemies.length
  }</b></p>
      <p>${locales[settings.language].levelSelectionScreenItems}: <b>${
    items.length
  }</b></p>

      <div class="level-selection-item-actions">
        <img class="${classList}" src="./assets/img/${
    settings.language
  }_imgs/play_btn.png" data-level="${level}" data-id="${id}" data-chartype="${chartype}">
      </div>
    </div>
  `;
}
