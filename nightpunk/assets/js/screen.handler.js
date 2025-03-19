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
          screens.title = document.createElement("div");
          screens.title.setAttribute("id", "title-screen");
          content.appendChild(screens.title);
          TitleScreen_Handler();
          break;
        case "main-menu":
          screens.main = document.createElement("div");
          screens.main.setAttribute("id", "main-menu");
          content.appendChild(screens.main);
          MainMenu_Handler();
          break;
        case "settings":
          screens.settings = document.createElement("div");
          screens.settings.setAttribute("id", "settings");
          content.appendChild(screens.settings);
          Settings_Handler();
          break;
        case "character-selection":
          screens.character_selection = document.createElement("div");
          screens.character_selection.setAttribute("id", "character-selection");
          content.appendChild(screens.character_selection);
          CharacterSelection_Handler();
          break;
        case "character-creation":
          screens.character_creation = document.createElement("div");
          screens.character_creation.setAttribute("id", "character-creation");
          content.appendChild(screens.character_creation);
          CharacterCreation_Handler();
          break;
        case "game-screen":
          screens.game = document.createElement("div");
          screens.game.setAttribute("id", "game-screen");
          content.appendChild(screens.game);
          break;
      }

      resolve();
    }, 500);
  });
}
