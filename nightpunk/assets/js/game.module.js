class Game {
  constructor(level) {
    this.currentLevel = level;
    this.deltaTime = 0;
    this.level = config.levels.find((map) => map.level === this.currentLevel);
    this.tileSize = config.global.tileSize;

    this.map = this.level.map;
    this.mapItems = this.level.items;
    this.mapCoins = this.level.coins;
  }

  loadEnemies() {
    for (let enemy of this.level.enemies) {
      let characters = JSON.parse(localStorage.getItem("characters"));
      let character = characters.find((c) => c.id === game.player.id);
      let level = character.levels.find(
        (l) => l.level === game.core.currentLevel
      );

      if (!level.enemiesKilled.includes(enemy.id)) {
        let enemyClass = new Enemy(
          enemy.position.x,
          enemy.position.y,
          50,
          80,
          enemy.health,
          enemy.items,
          enemy.id,
          enemy.type
        );

        game.enemies.push(enemyClass);
      }
    }
  }
}
