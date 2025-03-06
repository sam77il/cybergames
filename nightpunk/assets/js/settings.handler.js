let SETTINGS_CONTENT = null;
let SETTINGS_TAB = null;

function Settings_Handler() {
  SETTINGS.innerHTML = `
      <h1>Nightpunk</h1>
      <h2>${locales[gameSettings.language].settingsTitle}</h2>
      <ul style="display: flex; flex-direction: row; justify-content: space-around;">
          <li><button id="settings-back" type="button">${
            locales[gameSettings.language].settingsBackButton
          }</button></li>
          <li><button id="settings-language" type="button">${
            locales[gameSettings.language].settingsLanguageButton
          }</button></li>
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
    ChangeScreen("main-menu");
  });
  const SETTINGS_LANGUAGE = document.querySelector("#settings-language");
  SETTINGS_LANGUAGE.addEventListener("click", () => {
    ChangeSettingsScreen("settings-language");
  });
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
    default:
      console.log("Unbekannter Einstellungsbildschirm");
      // Hier könntest du einen Standard-Inhalt einfügen, wenn kein gültiger Bildschirm ausgewählt wurde
      SETTINGS_CONTENT.innerHTML = `
        <p>${locales[gameSettings.language].settingsDefaultMessage}</p>
      `;
      break;
  }

  // Speichern-Button wird immer nach dem Switch-Statement hinzugefügt, unabhängig vom gewählten Bildschirm
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
  const languageValue = document.querySelector(
    "input[name='language']:checked"
  ).value;
  gameSettings.language = languageValue;
  console.log("Saved");
  localStorage.setItem("settings", JSON.stringify(gameSettings));
  await ChangeScreen("settings");
  ChangeSettingsScreen(SETTINGS_TAB);
}
