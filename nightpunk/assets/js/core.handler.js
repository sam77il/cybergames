async function TitleScreen_Handler() {
  TITLE_SCREEN.innerHTML = `
      <h1>${locales[gameSettings.language].gameName}</h1>
      <p>${locales[gameSettings.language].titleScreenMessage}</p>
      `;
  window.addEventListener("keyup", TitleScreen_Event);
}

function TitleScreen_Event(e) {
  if (e.code === "Space") {
    window.removeEventListener("keyup", TitleScreen_Event);
    ChangeScreen("main-menu");
  }
}

async function MainMenu_Handler() {
  MAIN_MENU.innerHTML = `
    <h1>${locales[gameSettings.language].gameName}</h1>
  
    <ul>
        <li><button id="main-menu-start" type="button">${
          locales[gameSettings.language].mainMenuStartButton
        }</button></li>
        <li><button id="main-menu-settings" type="button">${
          locales[gameSettings.language].mainMenuSettingsButton
        }</button></li>
        <li><button id="main-menu-quit" type="button">${
          locales[gameSettings.language].mainMenuQuitButton
        }</button></li>
    </ul>
  `;

  const MAIN_MENU_QUIT = document.querySelector("#main-menu-quit");
  const MAIN_MENU_START = document.querySelector("#main-menu-start");

  MAIN_MENU_QUIT.addEventListener("click", () => {
    window.location.href = "/cybergame/home";
  });

  MAIN_MENU_START.addEventListener("click", async function () {
    await ChangeScreen("character-selection");
    //handleActionStart(true);
  });
  const MAIN_MENU_SETTINGS = document.querySelector("#main-menu-settings");
  MAIN_MENU_SETTINGS.addEventListener("click", () => {
    ChangeScreen("settings");
  });
}
