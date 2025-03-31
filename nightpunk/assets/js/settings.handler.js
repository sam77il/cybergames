let settingsMenu = {
  content: null,
  tab: null,
  listeningControl: null,
};

function Settings_Handler() {
  settingsMenu.tab = settingsMenu.tab ? settingsMenu.tab : null;
  screens.settings.innerHTML = `
    <div class="menus-background"></div>
    <header class="menus-content ${game.pauseMenu ? "pause-menu" : ""}">
      <h2>${locales[settings.language].settingsScreenTitle}</h2>

      <div class="settings-menu-header">
        <ul class="settings-menu-list">
          ${
            game.pauseMenu
              ? ""
              : `<li><img class="img-btn small-btn" id="settings-language" src="./assets/img/${settings.language}_imgs/language_btn.png"></li>`
          }
      
          <li><img class="img-btn small-btn" id="settings-sound" src="./assets/img/${
            settings.language
          }_imgs/audio_btn.png"></li>
          <li><img class="img-btn small-btn" id="settings-controls" src="./assets/img/${
            settings.language
          }_imgs/controls_btn.png"></li>
        </ul>
      </div>

      <div id="settings-content"></div>
      
      <div class="settings-menu-footer">
        <img id="settings-save" class="img-btn small-btn" src="./assets/img/${
          settings.language
        }_imgs/save_btn.png">
        <img class="img-btn small-btn" id="settings-back" src="./assets/img/${
          settings.language
        }_imgs/back_btn.png">
      </div>
    </header>
  `;

  settingsMenu.content = document.querySelector("#settings-content");

  const SETTINGS_BACK = document.querySelector("#settings-back");
  const SETTINGS_SOUND = document.querySelector("#settings-sound");
  const SETTINGS_SAVE = document.querySelector("#settings-save");
  const SETTINGS_CONTROLS = document.querySelector("#settings-controls");

  SETTINGS_BACK.addEventListener("click", () => {
    game.sounds.ui.pause();
    game.sounds.ui.currentTime = 0;
    game.sounds.ui.play();
    if (game.pauseMenu) {
      handlePauseMenu();
    } else {
      ChangeScreen("main-menu");
    }
  });

  SETTINGS_SOUND.addEventListener("click", () => {
    game.sounds.ui.pause();
    game.sounds.ui.currentTime = 0;
    game.sounds.ui.play();
    ChangeSettingsScreen("sound");
  });

  SETTINGS_CONTROLS.addEventListener("click", () => {
    game.sounds.ui.pause();
    game.sounds.ui.currentTime = 0;
    game.sounds.ui.play();
    ChangeSettingsScreen("controls");
  });

  SETTINGS_SAVE.addEventListener("click", () => {
    game.sounds.ui.pause();
    game.sounds.ui.currentTime = 0;
    game.sounds.ui.play();
    SaveSettings();
  });

  if (!game.pauseMenu) {
    const SETTINGS_LANGUAGE = document.querySelector("#settings-language");
    SETTINGS_LANGUAGE.addEventListener("click", () => {
      game.sounds.ui.pause();
      game.sounds.ui.currentTime = 0;
      game.sounds.ui.play();
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
        <h3>${locales[settings.language].settingsScreenLanguageTitle}</h3>

        <div class="select-container">
          <select id="settings-tab-language">
            <option value="de">${
              locales[settings.language].settingsScreenLanguageGerman
            }</option>
            <option value="en">${
              locales[settings.language].settingsScreenLanguageEnglish
            }</option>
          </select>
        </div>
      `;
      break;
    case "controls":
      settingsMenu.content.innerHTML = `
        <h3>${locales[settings.language].settingsScreenControlsTitle}</h3>
        
        <div class="settings-controls-list">
            <div class="settings-controls-list-item">
              <p>${
                locales[settings.language].settingsScreenControlsWalkLeft
              }</p>
              <button class="settings-controls-list-item-btn" data-control="walkLeft">${
                settings.controls.walkLeft
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${
                locales[settings.language].settingsScreenControlsWalkRight
              }</p>
              <button class="settings-controls-list-item-btn" data-control="walkRight">${
                settings.controls.walkRight
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${locales[settings.language].settingsScreenControlsJump}</p>
              <button class="settings-controls-list-item-btn" data-control="jump">${
                settings.controls.jump
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${locales[settings.language].settingsScreenControlsAttack}</p>
              <button class="settings-controls-list-item-btn" data-control="attack">${
                settings.controls.attack === " "
                  ? "Space"
                  : settings.controls.attack
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${
                locales[settings.language].settingsScreenControlsItemSlot1
              }</p>
              <button class="settings-controls-list-item-btn" data-control="itemslot1">${
                settings.controls.itemslot1
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${
                locales[settings.language].settingsScreenControlsItemSlot2
              }</p>
              <button class="settings-controls-list-item-btn" data-control="itemslot2">${
                settings.controls.itemslot2
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${
                locales[settings.language].settingsScreenControlsItemSlot3
              }</p>
              <button class="settings-controls-list-item-btn" data-control="itemslot3">${
                settings.controls.itemslot3
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${
                locales[settings.language].settingsScreenControlsItemSlot4
              }</p>
              <button class="settings-controls-list-item-btn" data-control="itemslot4">${
                settings.controls.itemslot4
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${
                locales[settings.language].settingsScreenControlsInteract
              }</p>
              <button class="settings-controls-list-item-btn" data-control="interact">${
                settings.controls.interact
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${locales[settings.language].settingsScreenControlsThrow}</p>
              <button class="settings-controls-list-item-btn" data-control="drop">${
                settings.controls.drop
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${locales[settings.language].settingsScreenPerkJump}</p>
              <button class="settings-controls-list-item-btn" data-control="jumpperk">${
                settings.controls.jumpperk
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${locales[settings.language].settingsScreenPerkSpeed}</p>
              <button class="settings-controls-list-item-btn" data-control="speedperk">${
                settings.controls.speedperk
              }</button>
            </div>
            <div class="settings-controls-list-item">
              <p>${locales[settings.language].settingsScreenPerkInstakill}</p>
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
              locales[settings.language].notifySettingsTitle,
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
        <h3>${locales[settings.language].settingsScreenAudioTitle}</h3>
        
        <div class="settings-sound-container">
          <div>
            <input type="range" id="sound-volume" min="0" step="5" max="100" value="${
              settings.sound.volume
            }">
            <label for="sound-volume">${
              locales[settings.language].settingsScreenSoundVolume
            } <span id="sound-volume-text">${
        settings.sound.volume
      }</span>%</label>
          </div>
          <div>
            <input type="range" id="sound-music" min="0" step="5" max="100" value="${
              settings.sound.music
            }">
            <label for="sound-music">${
              locales[settings.language].settingsScreenSoundMusic
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
        <p>${locales[settings.language].settingsScreenDefaultMessage}</p>
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
