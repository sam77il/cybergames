class Game {
  constructor() {
    console.log(gameConfig);
    this.currentLevel = 1;
    this.level = gameConfig.levels.find(
      (map) => map.level === this.currentLevel
    );
    this.tileSize = gameConfig.global.tileSize;

    this.map = this.level.map;
    this.mapItems = this.level.items;
  }
}
