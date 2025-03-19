class Game {
  constructor() {
    console.log(config);
    this.currentLevel = 1;
    this.level = config.levels.find((map) => map.level === this.currentLevel);
    this.tileSize = config.global.tileSize;

    this.map = this.level.map;
    this.mapItems = this.level.items;
  }
}
