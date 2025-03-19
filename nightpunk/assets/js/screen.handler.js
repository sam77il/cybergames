const box = document.querySelector("#box");
const content = document.querySelector("#content");

function ChangeScreen(screen) {
  return new Promise((resolve) => {
    box.style.opacity = "1";
    box.style.zIndex = "2";
    setTimeout(() => {
      box.style.zIndex = "-1";
      box.style.opacity = "0";
      content.innerHTML = "";

      switch (screen) {
        case "title-screen":
          SCREENS.TITLE = document.createElement("div");
          SCREENS.TITLE.setAttribute("id", "title-screen");
          content.appendChild(SCREENS.TITLE);
          TitleScreen_Handler();
          break;
        case "main-menu":
          SCREENS.MAIN = document.createElement("div");
          SCREENS.MAIN.setAttribute("id", "main-menu");
          content.appendChild(SCREENS.MAIN);
          MainMenu_Handler();
          break;
        case "settings":
          SCREENS.SETTINGS = document.createElement("div");
          SCREENS.SETTINGS.setAttribute("id", "settings");
          content.appendChild(SCREENS.SETTINGS);
          Settings_Handler();
          break;
        case "character-selection":
          SCREENS.CHARACTER_SELECTION = document.createElement("div");
          SCREENS.CHARACTER_SELECTION.setAttribute("id", "character-selection");
          content.appendChild(SCREENS.CHARACTER_SELECTION);
          CharacterSelection_Handler();
          break;
        case "character-creation":
          SCREENS.CHARACTER_CREATION = document.createElement("div");
          SCREENS.CHARACTER_CREATION.setAttribute("id", "character-creation");
          content.appendChild(SCREENS.CHARACTER_CREATION);
          CharacterCreation_Handler();
          break;
        case "game-screen":
          SCREENS.GAME = document.createElement("div");
          SCREENS.GAME.setAttribute("id", "game-screen");
          content.appendChild(SCREENS.GAME);
          break;
      }

      resolve();
    }, 500);
  });
}
