// Initializing all global variables
let screens = {
  title: null,
  main: null,
  character_selection: null,
  character_creation: null,
  game: null,
  settings: null,
  shop: null,
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
  npc: null,
  enemies: [],
  camera: null,
  paused: false,
  pauseMenu: false,
  map: {
    items: {},
    itemsOnFloor: null,
    coins: {},
    coinsOnFloor: null,
    tileset: null,
  },
  ui: {
    stats: {
      kills: null,
      deaths: null,
      kd: null,
    },
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
let perks = {};
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

async function loadPerks() {
  try {
    const respone = await fetch("perks.json");
    const json = await respone.json();
    perks = json;
    if (respone.ok) console.log("Successfully loaded perks.json");
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
    let playerSettings = JSON.parse(localStorage.getItem("settings"));

    if (playerSettings) {
      settings = playerSettings;
    } else {
      playerSettings = config.defaultSettings;
      localStorage.setItem("settings", JSON.stringify(playerSettings));
      settings = playerSettings;
    }
    console.log("Successfully loaded settings");
  } catch (e) {
    console.error("Failed loading settings", e);
  }
}

// Game Initializing
async function initializeGame() {
  await loadConfig();
  await loadLocales();
  await loadSettings();
  await loadItems();
  await loadPerks();

  console.log("Started game");
  game.map.tileset = document.querySelector("#tileset");
  npc = document.querySelector("#npc");
  if (config.global.dev) {
    StartGame();
  } else {
    ChangeScreen("title-screen");
  }
}

document.addEventListener("DOMContentLoaded", initializeGame);
