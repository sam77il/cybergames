let settingsMenu = {
  content: null,
  tab: null,
};

function Settings_Handler() {
  settingsMenu.tab = null;
  screens.settings.innerHTML = `
    <div class="menus-background"></div>
    <div class="menus-content">
      <h2>${locales[settings.language].settingsTitle}</h2>

      <div class="settings-menu-header">
        <ul class="settings-menu-list">
          ${
            game.paused
              ? ""
              : `<li><img class="settings-menu-btn small-btn" id="settings-language" src="./assets/img/de_imgs/Sprache_bttn.png"></li>`
          }
      
          <li><img class="settings-menu-btn small-btn" id="settings-sound" src="./assets/img/de_imgs/Audio_Bttn.png"></li>
          <li><img class="settings-menu-btn small-btn" id="settings-controls" src="./assets/img/de_imgs/Steuerung_Bttn.png"></li>
        </ul>
      </div>

      <div id="settings-content"></div>
      
      <div class="settings-menu-footer">
        <img class="settings-menu-btn small-btn" id="settings-back" src="./assets/img/de_imgs/Zurueck_Bttn.png">
        <img id="settings-save" class="settings-menu-btn small-btn" src="./assets/img/de_imgs/Speichern_Bttn.png">
      </div>
    </div>
  `;

  settingsMenu.content = document.querySelector("#settings-content");

  const SETTINGS_BACK = document.querySelector("#settings-back");
  const SETTINGS_SOUND = document.querySelector("#settings-sound");
  const SETTINGS_SAVE = document.querySelector("#settings-save");
  const SETTINGS_CONTROLS = document.querySelector("#settings-controls");

  SETTINGS_BACK.addEventListener("click", () => {
    if (game.paused) {
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

  if (!game.paused) {
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
          <select>
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
        <input type="text" id="controls-walk-left" maxlength="1" value="${
          settings.controls.walkLeft
        }">
              <label for="controls-walk-left">${
                locales[settings.language].settingsControlsWalkLeft
              }</label>
              <br>
              <input type="text" id="controls-walk-right" maxlength="1" value="${
                settings.controls.walkRight
              }">
              <label for="controls-walk-right">${
                locales[settings.language].settingsControlsWalkRight
              }</label>
              <br>
              <input type="text" id="controls-jump" maxlength="1" value="${
                settings.controls.jump
              }">
              <label for="controls-jump">${
                locales[settings.language].settingsControlsJump
              }</label>
            `;
      break;
    case "sound":
      settingsMenu.content.innerHTML = `
        <h3>${locales[settings.language].settingsSoundTitle}</h3>
        
        <input type="range" id="sound-volume" min="0" step="5" max="100" value="${
          settings.sound.volume
        }">
        <label for="sound-volume">${
          locales[settings.language].settingsSoundVolume
        } <span id="sound-volume-text">${settings.sound.volume}</span>%</label>
        <input type="range" id="sound-music" min="0" step="5" max="100" value="${
          settings.sound.music
        }">
        <label for="sound-music">${
          locales[settings.language].settingsMusicVolume
        } <span id="sound-music-text">${settings.sound.music}</span>%</label>
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

async function SaveSettings() {
  if (settingsMenu.tab === "language") {
    const languageValue = document.querySelector(
      "#settings-tab-language"
    ).value;
    console.log(languageValue);
    settings.language = languageValue;
  } else if (settingsMenu.tab === "controls") {
    const walkLeftValue =
      document.querySelector("#controls-walk-left")?.value ||
      settings.controls.walkLeft;
    const walkRightValue =
      document.querySelector("#controls-walk-right")?.value ||
      settings.controls.walkRight;
    const jumpValue =
      document.querySelector("#controls-jump")?.value || settings.controls.jump;
    settings.controls = {
      walkLeft: walkLeftValue,
      walkRight: walkRightValue,
      jump: jumpValue,
    };
  } else if (settingsMenu.tab === "sound") {
    const soundVolume =
      document.querySelector("#sound-volume")?.value || settings.sound.volume;
    const soundMusic =
      document.querySelector("#sound-music")?.value || settings.sound.music;
    settings.sound.music = soundMusic;
    settings.sound.volume = soundVolume;
  }

  console.log("Saved");
  localStorage.setItem("settings", JSON.stringify(settings));

  if (!game.paused) {
    await ChangeScreen("settings");
    ChangeSettingsScreen(settingsMenu.tab);
  }
}
