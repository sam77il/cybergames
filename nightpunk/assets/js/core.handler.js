async function TitleScreen_Handler() {
  SCREENS.TITLE.innerHTML = `
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
  SCREENS.MAIN.innerHTML = `
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
  const MAIN_QUIT = document.querySelector("#main-menu-quit");
  const MAIN_START = document.querySelector("#main-menu-start");
  const MAIN_SETTINGS = document.querySelector("#main-menu-settings");
  MAIN_QUIT.addEventListener("click", () => {
    window.location.href = "/cybergame/home";
  });
  MAIN_START.addEventListener("click", async function () {
    await ChangeScreen("character-selection");
    //handleActionStart(true);
  });
  MAIN_SETTINGS.addEventListener("click", () => {
    ChangeScreen("settings");
  });
}
