class Game {
  constructor(level) {
    this.currentLevel = level;
    this.level = config.levels.find((map) => map.level === this.currentLevel);
    this.tileSize = config.global.tileSize;

    this.map = this.level.map;
    this.mapItems = this.level.items;
    this.mapCoins = this.level.coins;
  }

  loadEnemies() {
    for (let enemy of this.level.enemies) {
      let enemyClass = new Enemy(
        enemy.position.x,
        enemy.position.y,
        50,
        80,
        enemy.health,
        enemy.items,
        enemy.type
      );

      game.enemies.push(enemyClass);
    }
  }
}
