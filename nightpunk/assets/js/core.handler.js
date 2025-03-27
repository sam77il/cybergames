async function TitleScreen_Handler() {
  screens.title.innerHTML = `
    <div class="menus-background"></div>
    <div class="menus-content">
      <img class="menus-logo" src="./assets/img/logo_game.png">
      <p class="title-screen-text">${
        locales[settings.language].titleScreenMessage
      }</p>
    </div>
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
    <div class="menus-background"></div>
    <div class="menus-content">
      <img class="menus-logo small" src="./assets/img/logo_game.png">
      <ul class="main-menu-selection">
          <li><img class="img-btn" id="main-menu-start" src="./assets/img/de_imgs/start_btn.png"></li>
          <li><img class="img-btn" id="main-menu-settings" src="./assets/img/de_imgs/settings_btn.png"></li>
          <li><img class="img-btn" id="main-menu-quit" src="./assets/img/de_imgs/leave_btn.png"></li>
      </ul>
    </div>
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
