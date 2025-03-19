async function TitleScreen_Handler() {
  screens.title.innerHTML = `
    <h1>${locales[settings.language].gameName}</h1>
    <p>${locales[settings.language].titleScreenMessage}</p>
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
  screens.main.innerHTML = `
      <h1>${locales[settings.language].gameName}</h1>
  
      <ul>
          <li><button id="main-menu-start" type="button">${
            locales[settings.language].mainMenuStartButton
          }</button></li>
          <li><button id="main-menu-settings" type="button">${
            locales[settings.language].mainMenuSettingsButton
          }</button></li>
          <li><button id="main-menu-quit" type="button">${
            locales[settings.language].mainMenuQuitButton
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
