let LEVEL_LIST = null;

function LevelSelection_Handler(id) {
  screens.level_selection.innerHTML = `
    <div class="menus-background"></div>
    <div class="menus-content">
      <h2 class="level-selection-title">Level Selection</h2>

      <div id="level-list"></div>

      <div class="level-selection-actions">
        <img class="img-btn" id="level-selection-back" src="./assets/img/de_imgs/back_btn.png">
      </div>
    </div>
  `;

  LEVEL_LIST = document.querySelector("#level-list");
  const LEVEL_BACK = document.querySelector("#level-selection-back");

  LEVEL_BACK.addEventListener("click", () => {
    ChangeScreen("character-selection");
  });

  for (let level of config.levels) {
    LevelItem(level, id);
  }
  const START_BUTTONS = document.querySelectorAll(".level-selection-start");

  for (let button of START_BUTTONS) {
    button.addEventListener("click", StartGame);
  }
}

async function StartGame(event) {
  game.paused = false;
  game.pauseMenu = false;
  await ChangeScreen("game-screen");
  initiateGameCanvas(
    event.target.dataset.id,
    Number(event.target.dataset.level)
  );
}

function LevelItem({ label, level, enemies, items }, id) {
  let characters = JSON.parse(localStorage.getItem("characters"));
  let character = characters.find((c) => Number(c.id) === Number(id));
  let classList = null;

  if (character.levels.find((l) => l.level === level)) {
    classList = "level-selection-start";
  } else {
    classList = "level-selection-start-disabled";
  }

  LEVEL_LIST.innerHTML += `
    <div class="level-selection-item">
      <p>Level Name: <b>${label}</b></p>
      <p>Level: <b>${level}</b></p>
      <p>Gegneranzahl: <b>${enemies.length}</b></p>
      <p>Itemrewards: <b>${items.length}</b></p>

      <div class="level-selection-item-actions">
        <img class="${classList}" src="./assets/img/de_imgs/play_btn.png" data-level="${level}" data-id="${id}">
      </div>
    </div>
  `;
}
