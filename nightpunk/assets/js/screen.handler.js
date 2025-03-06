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
          TITLE_SCREEN = document.createElement("div");
          TITLE_SCREEN.setAttribute("id", "title-screen");
          content.appendChild(TITLE_SCREEN);
          TitleScreen_Handler();
          break;
        case "main-menu":
          MAIN_MENU = document.createElement("div");
          MAIN_MENU.setAttribute("id", "main-menu");
          content.appendChild(MAIN_MENU);
          MainMenu_Handler();
          break;
        case "settings":
          SETTINGS = document.createElement("div");
          SETTINGS.setAttribute("id", "settings");
          content.appendChild(SETTINGS);
          Settings_Handler();
          break;
        case "character-selection":
          CHARACTER_SELECTION = document.createElement("div");
          CHARACTER_SELECTION.setAttribute("id", "character-selection");
          content.appendChild(CHARACTER_SELECTION);
          CharacterSelection_Handler();
          break;
        case "character-creation":
          CHARACTER_CREATION = document.createElement("div");
          CHARACTER_CREATION.setAttribute("id", "character-creation");
          content.appendChild(CHARACTER_CREATION);
          CharacterCreation_Handler();
          break;
        case "game-screen":
          GAME_SCREEN = document.createElement("div");
          GAME_SCREEN.setAttribute("id", "game-screen");
          content.appendChild(GAME_SCREEN);
          break;
      }

      resolve();
    }, 500);
  });
}
