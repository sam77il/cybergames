function Gameover_Handler() {
  let gameOverScreen = document.createElement("div");
  gameOverScreen.setAttribute("id", "gameover");
  gameOverScreen.innerHTML = `
    <div class="menus-content game-over">
      <header>
        <h3>Game Over</h3>
      </header>
      <p>Du bist gestorben. Keine Sorge dein Spielstand wurde gespeichert und du kannst ganz einfach respawnen</p>
      <div>
        <img class="img-btn" id="restart-game" src="./assets/img/${settings.language}_imgs/restart_btn.png">
        <img class="img-btn" id="back-to-home-game" src="./assets/img/${settings.language}_imgs/back_btn.png">
      </div>
    </div>  
  `;

  screens.game.appendChild(gameOverScreen);

  const RESTART_GAME = document.querySelector("#restart-game");
  const BACK_TO_HOME = document.querySelector("#back-to-home-game");

  BACK_TO_HOME.addEventListener("click", async () => {
    await ChangeScreen("character-selection");
  });

  RESTART_GAME.addEventListener("click", () => {
    initiateGameCanvas(
      game.player.id,
      game.player.chartype,
      game.core.currentLevel
    );
  });
}
