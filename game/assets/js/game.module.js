let gameConfig = {};

async function loadConfig() {
  try {
    const respone = await fetch("config.json");
    const json = await respone.json();
    gameConfig = json;
    if (respone.ok) console.log("Successfully loaded config.json");
  } catch (error) {}
}

loadConfig();

class Game {
  constructor() {
    this.level = 1;
    this.tileSize = gameConfig.global.tileSize;
    this.map = gameConfig.levels[this.level].map;
  }
}
