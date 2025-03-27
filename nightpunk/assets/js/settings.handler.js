let settingsMenu = {
  content: null,
  tab: null,
  listeningControl: null,
};

function Settings_Handler() {
  settingsMenu.tab = null;
  screens.settings.innerHTML = `
    <div class="menus-background"></div>
    <header class="menus-content ${game.pauseMenu ? "pause-menu" : ""}">
      <h2>${locales[settings.language].settingsTitle}</h2>

      <div class="settings-menu-header">
        <ul class="settings-menu-list">
          ${
            game.pauseMenu
              ? ""
              : `<li><img class="img-btn small-btn" id="settings-language" src="./assets/img/de_imgs/language_btn.png"></li>`
          }
      
          <li><img class="img-btn small-btn" id="settings-sound" src="./assets/img/de_imgs/audio_btn.png"></li>
          <li><img class="img-btn small-btn" id="settings-controls" src="./assets/img/de_imgs/controls_btn.png"></li>
        </ul>
      </div>

      <div id="settings-content"></div>
      
      <div class="settings-menu-footer">
        <img id="settings-save" class="img-btn small-btn" src="./assets/img/de_imgs/save_btn.png">
        <img class="img-btn small-btn" id="settings-back" src="./assets/img/de_imgs/back_btn.png">
      </div>
    </header>
  `;

  settingsMenu.content = document.querySelector("#settings-content");

  const SETTINGS_BACK = document.querySelector("#settings-back");
  const SETTINGS_SOUND = document.querySelector("#settings-sound");
  const SETTINGS_SAVE = document.querySelector("#settings-save");
  const SETTINGS_CONTROLS = document.querySelector("#settings-controls");

  SETTINGS_BACK.addEventListener("click", () => {
    if (game.pauseMenu) {
      handlePauseMenu();
    } else {
      ChangeScreen("main-menu");
    }
  });

  SETTINGS_SOUND.addEventListener("click", () => {
    ChangeSettingsScreen("sound");
  });

  SETTINGS_CONTROLS.addEventListener("click", () => {
    ChangeSettingsScreen("controls");
  });

  SETTINGS_SAVE.addEventListener("click", () => {
    SaveSettings();
  });

  if (!game.pauseMenu) {
    const SETTINGS_LANGUAGE = document.querySelector("#settings-language");
    SETTINGS_LANGUAGE.addEventListener("click", () => {
      ChangeSettingsScreen("language");
    });
  }
}

function ChangeSettingsScreen(screen) {
  settingsMenu.content.innerHTML = "";
  settingsMenu.tab = screen;

  switch (screen) {
    case "language":
      settingsMenu.content.innerHTML = `
        <h3>${locales[settings.language].settingsLanguageTitle}</h3>

        <div class="select-container">
          <select id="settings-tab-language">
            <option value="de">${
              locales[settings.language].settingsLanguageGerman
            }</option>
            <option value="en">${
              locales[settings.language].settingsLanguageEnglish
            }</option>
          </select>
        </div>
      `;
      break;
    case "controls":
      settingsMenu.content.innerHTML = `
        <h3>${locales[settings.language].settingsControlsTitle}</h3>
        
        <div class="settings-controls-list">
            <div class="settings-controls-list-item">
              <p>Nach links laufen</p>
              <button class="settings-controls-list-item-btn" data-control="walkLeft">${
                settings.controls.walkLeft
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Nach rechts laufen</p>
              <button class="settings-controls-list-item-btn" data-control="walkRight">${
                settings.controls.walkRight
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Springen</p>
              <button class="settings-controls-list-item-btn" data-control="jump">${
                settings.controls.jump
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Attacke</p>
              <button class="settings-controls-list-item-btn" data-control="attack">${
                settings.controls.attack === " "
                  ? "Space"
                  : settings.controls.attack
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Item Slot 1</p>
              <button class="settings-controls-list-item-btn" data-control="itemslot1">${
                settings.controls.itemslot1
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Item Slot 2</p>
              <button class="settings-controls-list-item-btn" data-control="itemslot2">${
                settings.controls.itemslot2
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Item Slot 3</p>
              <button class="settings-controls-list-item-btn" data-control="itemslot3">${
                settings.controls.itemslot3
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Item Slot 4</p>
              <button class="settings-controls-list-item-btn" data-control="itemslot4">${
                settings.controls.itemslot4
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Interagieren</p>
              <button class="settings-controls-list-item-btn" data-control="interact">${
                settings.controls.interact
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Wegwerfen</p>
              <button class="settings-controls-list-item-btn" data-control="drop">${
                settings.controls.drop
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Jumpboost Perk</p>
              <button class="settings-controls-list-item-btn" data-control="jumpperk">${
                settings.controls.jumpperk
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Speedboost Perk</p>
              <button class="settings-controls-list-item-btn" data-control="speedperk">${
                settings.controls.speedperk
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>Instakill Perk</p>
              <button class="settings-controls-list-item-btn" data-control="instakillperk">${
                settings.controls.instakillperk
              }</button>
            </div>
        </div>
      `;
      const CONTROL_BUTTONS = document.querySelectorAll(
        ".settings-controls-list-item-btn"
      );
      for (let button of CONTROL_BUTTONS) {
        button.addEventListener("click", (event) => {
          if (!settingsMenu.listeningControl) {
            settingsMenu.listeningControl = event.target;
            event.target.innerHTML = "Hört zu...";
            window.addEventListener("keyup", listeningToSettingControls);
          } else {
            Notify(
              "Controls",
              "Du änderst bereits ein Keybind, drücke ESC um abzubrechen.",
              "error",
              3500
            );
          }
        });
      }
      break;
    case "sound":
      settingsMenu.content.innerHTML = `
        <h3>${locales[settings.language].settingsSoundTitle}</h3>
        
        <div class="settings-sound-container">
          <div>
            <input type="range" id="sound-volume" min="0" step="5" max="100" value="${
              settings.sound.volume
            }">
            <label for="sound-volume">${
              locales[settings.language].settingsSoundVolume
            } <span id="sound-volume-text">${
        settings.sound.volume
      }</span>%</label>
          </div>
          <div>
            <input type="range" id="sound-music" min="0" step="5" max="100" value="${
              settings.sound.music
            }">
            <label for="sound-music">${
              locales[settings.language].settingsMusicVolume
            } <span id="sound-music-text">${
        settings.sound.music
      }</span>%</label>
          </div>
        </div>
      `;

      setTimeout(() => {
        const SOUND_VOLUME = document.querySelector("#sound-volume");
        const SOUND_MUSIC = document.querySelector("#sound-music");

        SOUND_VOLUME.addEventListener("input", () => {
          const SOUND_VOLUME_LABEL_TEXT =
            document.querySelector("#sound-volume-text");
          SOUND_VOLUME_LABEL_TEXT.innerHTML = SOUND_VOLUME.value;
        });

        SOUND_MUSIC.addEventListener("input", () => {
          const SOUND_MUSIC_LABEL_TEXT =
            document.querySelector("#sound-music-text");
          SOUND_MUSIC_LABEL_TEXT.innerHTML = SOUND_MUSIC.value;
        });
      }, 10);
      break;
    default:
      settingsMenu.content.innerHTML = `
        <p>${locales[settings.language].settingsDefaultMessage}</p>
      `;
      break;
  }
}

function listeningToSettingControls(e) {
  if (e.key === "Escape") {
    settingsMenu.listeningControl.innerHTML =
      settings.controls[settingsMenu.listeningControl.dataset.control];
    window.removeEventListener("keyup", listeningToSettingControls);
    settingsMenu.listeningControl = null;

    return;
  }
  settings.controls[settingsMenu.listeningControl.dataset.control] = e.key;
  settingsMenu.listeningControl.innerHTML = e.key;
  Notify(
    "Controls",
    "Erfolgreich zu " + e.key.toUpperCase() + " geändert",
    "success",
    3500
  );
  window.removeEventListener("keyup", listeningToSettingControls);
  settingsMenu.listeningControl = null;
}

async function SaveSettings() {
  if (settingsMenu.tab === "language") {
    const languageValue = document.querySelector(
      "#settings-tab-language"
    ).value;
    console.log(languageValue);
    settings.language = languageValue;
  } else if (settingsMenu.tab === "sound") {
    const soundVolume =
      document.querySelector("#sound-volume")?.value || settings.sound.volume;
    const soundMusic =
      document.querySelector("#sound-music")?.value || settings.sound.music;
    settings.sound.music = soundMusic;
    settings.sound.volume = soundVolume;
  }

  Notify("Settings", "Einstellungen erfolgreich gespeichert", "success", 3000);
  localStorage.setItem("settings", JSON.stringify(settings));

  if (!game.pauseMenu) {
    await ChangeScreen("settings");
    console.log(settingsMenu.tab);
    ChangeSettingsScreen(settingsMenu.tab);
  }
}
