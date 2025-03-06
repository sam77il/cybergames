function Settings_Handler() {
  SETTINGS.innerHTML = `
      <h1>Nightpunk</h1>
      <h2>${locales.de.settingsTitle}</h2>
      <ul>
          <li><button id="settings-back" type="button">${locales.de.settingsBackButton}</button></li>
          <li><button id="settings-language" type="button">${locales.de.settingsLanguageButton}</button></li>
          <li><button id="settings-sound" type="button">${locales.de.settingsSoundButton}</button></li>
          <li><button id="settings-controls" type="button">${locales.de.settingsControlsButton}</button></li>
      </ul>
    `;
  const SETTINGS_BACK = document.querySelector("#settings-back");
  SETTINGS_BACK.addEventListener("click", () => {
    ChangeScreen("main-menu");
  });
  const SETTINGS_LANGUAGE = document.querySelector("#settings-language");
  SETTINGS_LANGUAGE.addEventListener("click", () => {
    ChangeScreen("settings-language");
  });
  const SETTINGS_SOUND = document.querySelector("#settings-sound");
  SETTINGS_SOUND.addEventListener("click", () => {
    ChangeScreen("settings-sound");
  });
  const SETTINGS_GRAPHICS = document.querySelector("#settings-graphics");
  SETTINGS_GRAPHICS.addEventListener("click", () => {
    ChangeScreen("settings-graphics");
  });
  const SETTINGS_CONTROLS = document.querySelector("#settings-controls");
  SETTINGS_CONTROLS.addEventListener("click", () => {
    ChangeScreen("settings-controls");
  });
}
