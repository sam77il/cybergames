let SETTINGS_CONTENT = null;
let SETTINGS_TAB = null;

function Settings_Handler() {
  screens.settings.innerHTML = `
      ${game.paused ? "" : `<h1>Nightpunk</h1>`}
      <h2>${locales[settings.language].settingsTitle}</h2>
      <hr>
      <br>
      <ul style="display: flex; flex-direction: row; justify-content: space-around;">
          <li><button id="settings-back" type="button">${
            locales[settings.language].settingsBackButton
          }</button></li>
          ${
            game.paused
              ? ""
              : `<li><button id="settings-language" type="button">${
                  locales[settings.language].settingsLanguageButton
                }</button></li>`
          }
          
          <li><button id="settings-sound" type="button">${
            locales[settings.language].settingsSoundButton
          }</button></li>
          <li><button id="settings-controls" type="button">${
            locales[settings.language].settingsControlsButton
          }</button></li>
      </ul>

      <div id="settings-content"></div>
    `;
  SETTINGS_CONTENT = document.querySelector("#settings-content");

  const SETTINGS_BACK = document.querySelector("#settings-back");
  SETTINGS_BACK.addEventListener("click", () => {
    if (game.paused) {
      handlePauseMenu();
    } else {
      ChangeScreen("main-menu");
    }
  });

  if (!game.paused) {
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
  console.log(settings);
  SETTINGS_TAB = screen;

  switch (screen) {
    case "settings-language":
      SETTINGS_CONTENT.innerHTML = `
              <h3>${locales[settings.language].settingsLanguageTitle}</h3>
              <input type="radio" id="language-de" name="language" value="de" ${
                settings.language === "de" ? "checked" : ""
              }>
              <label for="language-de">${
                locales[settings.language].settingsLanguageGerman
              }</label>
              <input type="radio" id="language-en" name="language" value="en" ${
                settings.language === "en" ? "checked" : ""
              }>
              <label for="language-en">${
                locales[settings.language].settingsLanguageEnglish
              }</label>
            `;
      break;
    case "settings-controls":
      SETTINGS_CONTENT.innerHTML = `
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
    case "settings-sound":
      SETTINGS_CONTENT.innerHTML = `
                <h3>${locales[settings.language].settingsSoundTitle}</h3>
                <input type="range" id="sound-volume" min="0" step="5" max="100" value="${
                  settings.sound.volume
                }">
                <label for="sound-volume">${
                  locales[settings.language].settingsSoundVolume
                } <span id="sound-volume-text">${
        settings.sound.volume
      }</span>%</label>
      <input type="range" id="sound-music" min="0" step="5" max="100" value="${
        settings.sound.music
      }">
      <label for="sound-music">${
        locales[settings.language].settingsMusicVolume
      } <span id="sound-music-text">${settings.sound.music}</span>%</label>
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
            <p>${locales[settings.language].settingsDefaultMessage}</p>
          `;
      break;
  }

  SETTINGS_CONTENT.innerHTML += `
      <button id="settings-save" type="button">${
        locales[settings.language].settingsSaveButton
      }</button>
    `;

  const SETTINGS_SAVE = document.querySelector("#settings-save");
  SETTINGS_SAVE.addEventListener("click", () => {
    SaveSettings();
  });
}

async function SaveSettings() {
  if (!game.paused) {
    const languageValue =
      document.querySelector("input[name='language']:checked")?.value ||
      settings.language;
    settings.language = languageValue;
  }
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
  const soundVolume =
    document.querySelector("#sound-volume")?.value || settings.sound.volume;
  const soundMusic =
    document.querySelector("#sound-music")?.value || settings.sound.music;
  settings.sound.music = soundMusic;
  settings.sound.volume = soundVolume;
  console.log("Saved");
  localStorage.setItem("settings", JSON.stringify(settings));
  if (game.paused) {
    handlePauseMenu();
  } else {
    await ChangeScreen("settings");
    ChangeSettingsScreen(SETTINGS_TAB);
  }
}
