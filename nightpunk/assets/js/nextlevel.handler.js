let isNear = false;

async function Nextlevel_Handler() {
  if (game.enemies.length <= 0) {
    game.paused = true;
    let character = JSON.parse(localStorage.getItem("characters")).find((c) => {
      return c.id === game.player.id;
    });
    console.log(character);
    if (!character.levels.find((l) => l.level === game.core.currentLevel + 1)) {
      character.levels.push({
        level: game.core.currentLevel + 1,
        itemsCollected: [],
        coinsCollected: [],
        enemiesKilled: [],
      });
      let newCharacters = JSON.parse(localStorage.getItem("characters")).map(
        (c) => {
          if (c.id === character.id) {
            return character;
          }
          return c;
        }
      );
      localStorage.setItem("characters", JSON.stringify(newCharacters));
    }
    await ChangeScreen("level-selection");
    LevelSelection_Handler(game.player.id, game.player.chartype);
  } else {
    if (!isNear) {
      isNear = true;
      Notify(
        locales[settings.language].notifyLevelTitle,
        locales[settings.language].notifyLevelNotKilledAll,
        "error",
        3500
      );
    }
  }
}
