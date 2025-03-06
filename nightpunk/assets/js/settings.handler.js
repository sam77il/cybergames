let SETTINGS_CONTENT = null;
let SETTINGS_TAB = null;

function Settings_Handler() {
  SETTINGS.innerHTML = `
      ${isInPause ? "" : `<h1>Nightpunk</h1>`}
      <h2>${locales[gameSettings.language].settingsTitle}</h2>
      <hr>
      <br>
      <ul style="display: flex; flex-direction: row; justify-content: space-around;">
          <li><button id="settings-back" type="button">${
            locales[gameSettings.language].settingsBackButton
          }</button></li>
          ${
            isInPause
              ? ""
              : `<li><button id="settings-language" type="button">${
                  locales[gameSettings.language].settingsLanguageButton
                }</button></li>`
          }
          
          <li><button id="settings-sound" type="button">${
            locales[gameSettings.language].settingsSoundButton
          }</button></li>
          <li><button id="settings-controls" type="button">${
            locales[gameSettings.language].settingsControlsButton
          }</button></li>
      </ul>

      <div id="settings-content"></div>
    `;
  SETTINGS_CONTENT = document.querySelector("#settings-content");

  const SETTINGS_BACK = document.querySelector("#settings-back");
  SETTINGS_BACK.addEventListener("click", () => {
    if (isInPause) {
      handlePauseMenu();
    } else {
      ChangeScreen("main-menu");
    }
  });
  if (!isInPause) {
    const SETTINGS_LANGUAGE = document.querySelector("#settings-language");
    SETTINGS_LANGUAGE.addEventListener("click", () => {
      ChangeSettingsScreen("settings-language");
    });
  }
  const SETTINGS_SOUND = document.querySelector("#settings-sound");
  SETTINGS_SOUND.addEventListener("click", () => {
    ChangeSettingsScreen("settings-sound");
  });
  const SETTINGS_CONTROLS = document.querySelector("#settings-controls");
  SETTINGS_CONTROLS.addEventListener("click", () => {
    ChangeSettingsScreen("settings-controls");
  });
}

function ChangeSettingsScreen(screen) {
  SETTINGS_CONTENT.innerHTML = "";
  console.log(gameSettings);
  SETTINGS_TAB = screen;

  switch (screen) {
    case "settings-language":
      SETTINGS_CONTENT.innerHTML = `
              <h3>${locales[gameSettings.language].settingsLanguageTitle}</h3>
              <input type="radio" id="language-de" name="language" value="de" ${
                gameSettings.language === "de" ? "checked" : ""
              }>
              <label for="language-de">${
                locales[gameSettings.language].settingsLanguageGerman
              }</label>
              <input type="radio" id="language-en" name="language" value="en" ${
                gameSettings.language === "en" ? "checked" : ""
              }>
              <label for="language-en">${
                locales[gameSettings.language].settingsLanguageEnglish
              }</label>
            `;
      break;
    case "settings-controls":
      SETTINGS_CONTENT.innerHTML = `
              <h3>${locales[gameSettings.language].settingsControlsTitle}</h3>
              <input type="text" id="controls-walk-left" maxlength="1" value="${
                gameSettings.controls.walkLeft
              }">
              <label for="controls-walk-left">${
                locales[gameSettings.language].settingsControlsWalkLeft
              }</label>
              <br>
              <input type="text" id="controls-walk-right" maxlength="1" value="${
                gameSettings.controls.walkRight
              }">
              <label for="controls-walk-right">${
                locales[gameSettings.language].settingsControlsWalkRight
              }</label>
              <br>
              <input type="text" id="controls-jump" maxlength="1" value="${
                gameSettings.controls.jump
              }">
              <label for="controls-jump">${
                locales[gameSettings.language].settingsControlsJump
              }</label>
            `;
      break;
    case "settings-sound":
      SETTINGS_CONTENT.innerHTML = `
                <h3>${locales[gameSettings.language].settingsSoundTitle}</h3>
                <input type="range" id="sound-volume" min="0" step="5" max="100" value="${
                  gameSettings.sound.volume
                }">
                <label for="sound-volume">${
                  locales[gameSettings.language].settingsSoundVolume
                } <span id="sound-volume-text">${
        gameSettings.sound.volume
      }</span>%</label>
      <input type="range" id="sound-music" min="0" step="5" max="100" value="${
        gameSettings.sound.music
      }">
      <label for="sound-music">${
        locales[gameSettings.language].settingsMusicVolume
      } <span id="sound-music-text">${gameSettings.sound.music}</span>%</label>
              `;

      setTimeout(() => {
        const SOUND_VOLUME = document.querySelector("#sound-volume");
        SOUND_VOLUME.addEventListener("input", () => {
          const SOUND_VOLUME_LABEL_TEXT =
            document.querySelector("#sound-volume-text");
          SOUND_VOLUME_LABEL_TEXT.innerHTML = SOUND_VOLUME.value;
        });
        const SOUND_MUSIC = document.querySelector("#sound-music");
        SOUND_MUSIC.addEventListener("input", () => {
          const SOUND_MUSIC_LABEL_TEXT =
            document.querySelector("#sound-music-text");
          SOUND_MUSIC_LABEL_TEXT.innerHTML = SOUND_MUSIC.value;
        });
      }, 10);
      break;
    default:
      console.log("Unbekannter Einstellungsbildschirm");
      // Hier könntest du einen Standard-Inhalt einfügen, wenn kein gültiger Bildschirm ausgewählt wurde
      SETTINGS_CONTENT.innerHTML = `
            <p>${locales[gameSettings.language].settingsDefaultMessage}</p>
          `;
      break;
  }

  SETTINGS_CONTENT.innerHTML += `
      <button id="settings-save" type="button">${
        locales[gameSettings.language].settingsSaveButton
      }</button>
    `;

  const SETTINGS_SAVE = document.querySelector("#settings-save");
  SETTINGS_SAVE.addEventListener("click", () => {
    SaveSettings();
  });
}

async function SaveSettings() {
  if (!isInPause) {
    const languageValue =
      document.querySelector("input[name='language']:checked")?.value ||
      gameSettings.language;
    gameSettings.language = languageValue;
  }
  const walkLeftValue =
    document.querySelector("#controls-walk-left")?.value ||
    gameSettings.controls.walkLeft;
  const walkRightValue =
    document.querySelector("#controls-walk-right")?.value ||
    gameSettings.controls.walkRight;
  const jumpValue =
    document.querySelector("#controls-jump")?.value ||
    gameSettings.controls.jump;
  gameSettings.controls = {
    walkLeft: walkLeftValue,
    walkRight: walkRightValue,
    jump: jumpValue,
  };
  const soundVolume =
    document.querySelector("#sound-volume")?.value || gameSettings.sound.volume;
  const soundMusic =
    document.querySelector("#sound-music")?.value || gameSettings.sound.music;
  gameSettings.sound.music = soundMusic;
  gameSettings.sound.volume = soundVolume;
  console.log("Saved");
  localStorage.setItem("settings", JSON.stringify(gameSettings));
  if (isInPause) {
    handlePauseMenu();
  } else {
    await ChangeScreen("settings");
    ChangeSettingsScreen(SETTINGS_TAB);
  }
}
