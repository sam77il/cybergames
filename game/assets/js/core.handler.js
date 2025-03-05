async function TitleScreen_Handler() {
  TITLE_SCREEN.innerHTML = `
      <h1>Cybergame</h1>
      <p>${locales.de.startStartMessage}</p>
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
      <h1>Cybergame</h1>
  
      <ul>
          <li><button id="main-menu-start" type="button">${locales.de.actionStartButton}</button></li>
          <li><button type="button">${locales.de.actionSettingsButton}</button></li>
          <li><button id="main-menu-quit" type="button">${locales.de.actionQuitButton}</button></li>
      </ul>
    `;
  const ACTION_MENU_QUIT = document.querySelector("#main-menu-quit");
  ACTION_MENU_QUIT.addEventListener("click", () => {
    window.location.href = "/myapache/cybergame";
  });
  const ACTION_MENU_START = document.querySelector("#main-menu-start");
  ACTION_MENU_START.addEventListener("click", async function () {
    await ChangeScreen("character-selection");
    //handleActionStart(true);
  });
}
