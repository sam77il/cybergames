// Initializing all global variables
let screens = {
  title: null,
  main: null,
  character_selection: null,
  character_creation: null,
  game: null,
  settings: null,
  level_selection: null,
};

let game = {
  canvas: {
    main: null,
    mainCtx: null,

    bg: null,
    bgCtx: null,
  },
  core: null,
  player: null,
  enemies: [],
  camera: null,
  paused: false,
  map: {
    items: {},
    itemsOnFloor: null,
    tileset: null,
  },
  ui: {
    healthBar: null,
    helpNotify: null,
    inventory: {
      slot1: null,
      slot2: null,
      slot3: null,
      slot4: null,
    },
  },
};

let locales = {};
let items = {};
let config = {};
let settings = {};

// Loading config.json
async function loadConfig() {
  try {
    const respone = await fetch("config.json");
    const json = await respone.json();
    config = json;
    if (respone.ok) console.log("Successfully loaded config.json");
  } catch (error) {}
}

async function loadItems() {
  try {
    const respone = await fetch("items.json");
    const json = await respone.json();
    items = json;
    if (respone.ok) console.log("Successfully loaded items.json");
  } catch (error) {}
}

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
    const playerSettings = JSON.parse(localStorage.getItem("settings"));
    if (playerSettings) {
      settings = playerSettings;
    } else {
      playerSettings = config.defaultSettings;
      localStorage.setItem("settings", JSON.stringify(playerSettings));
    }
    console.log("Successfully loaded settings");
  } catch {
    console.error("Failed loading settings");
  }
}

// Game Initializing
async function initializeGame() {
  await loadConfig();
  await loadLocales();
  await loadSettings();
  await loadItems();

  console.log("Started game");
  game.map.tileset = document.querySelector("#tileset");
  if (config.global.dev) {
    StartGame();
  } else {
    ChangeScreen("title-screen");
  }
}

document.addEventListener("DOMContentLoaded", initializeGame);
