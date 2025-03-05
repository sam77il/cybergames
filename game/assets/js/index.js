// Initializing all global variables
let TITLE_SCREEN = null;
let MAIN_MENU = null;
let CHARACTER_SELECTION = null;
let CHARACTER_CREATION = null;
let GAME_SCREEN = null;
let SETTINGS = null;
let canvas = null;
let ctx = null;
let bgCanvas = null;
let bgCtx = null;
let characterSelectioned = false;
let locales = {};
let player = null;
let game = null;
let camera = null; // Add camera variable
let tileset = null;
const controls = {
  left: false,
  right: false,
  up: false,
};
let gameSettings = {};

// Loading config.json
async function loadConfig() {
  try {
    const respone = await fetch("config.json");
    const json = await respone.json();
    gameSettings = json;
    if (respone.ok) console.log("Successfully loaded config.json");
  } catch (error) {}
}
loadConfig();

// Loading locales.json (different languages)
async function loadLocales() {
  try {
    const response = await fetch("locales.json");
    const json = await response.json();
    locales = json;
    if (response.ok) console.log("Successfully loaded locales.json");
  } catch {
    console.error("Failed fetching locales.json");
  }
}

// Loading settings from localStorage
async function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem("settings"));
    if (settings) {
      gameSettings = settings;
    } else {
      gameSettings = {
        sound: {
          volume: 0.5,
        },
        controls: {
          keyLeft: "a",
          keyRight: "d",
          keyUp: "w",
        },
        language: "de",
      };
    }
    console.log("Successfully loaded settings");
  } catch {
    console.error("Failed loading settings");
  }
}

// Game Initializing
async function initializeGame() {
  await loadLocales();
  await loadSettings();
  if (!characterSelectioned) {
    console.log("Starting game");
    tileset = document.querySelector("#tileset");
    console.log(gameSettings);
    if (gameSettings.global.dev) {
      StartGame();
    } else {
      ChangeScreen("title-screen");
    }
  }
}

document.addEventListener("DOMContentLoaded", initializeGame);
