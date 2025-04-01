let perksState = {
  jump: false,
  speed: false,
  instakill: false,
};

function Perks_Speedhandler() {
  let character = JSON.parse(localStorage.getItem("characters")).find(
    (c) => c.id === game.player.id
  );

  if (character.perks.includes("speed") && !perksState.speed) {
    let PERK_SPEED = document.getElementById("perk-speed");
    game.player.settings.speed = 12;
    game.perksCount++;
    perksState.speed = true;
    game.player.activePerks.push("speed");
    game.sounds.perk.play();
    PERK_SPEED.style.animation = "none";
    PERK_SPEED.offsetHeight; // Reflow erzwingen
    PERK_SPEED.style.opacity = "0.5";
    PERK_SPEED.style.animation = "Perk 3s ease-in";
    Cyberpsychose_Handler();
    Notify(
      locales[settings.language].notifyPerksTitle,
      locales[settings.language].notifyPerksSpeedYes,
      "info",
      3500
    );

    setTimeout(() => {
      game.player.settings.speed = 5;
      perksState.speed = false;
      let newPerks = game.player.activePerks.filter((perk) => {
        return perk !== "speed";
      });
      game.player.activePerks = newPerks;
    }, 6000);

    setTimeout(() => {
      console.log("speedperk ist nutzbar!");
      PERK_SPEED.style.opacity = "1";
    }, 15000);
  } else {
    Notify(
      locales[settings.language].notifyPerksTitle,
      "Speedperk not available",
      "error",
      3500
    );
  }
}

function Perks_Jumphandler() {
  let character = JSON.parse(localStorage.getItem("characters")).find(
    (c) => c.id === game.player.id
  );

  if (character.perks.includes("jump") && !perksState.jump) {
    let PERK_JUMP = document.getElementById("perk-jump");
    game.player.settings.jumpForce = 25;
    game.perksCount++;
    perksState.jump = true;
    game.player.activePerks.push("jump");
    game.sounds.perk.play();
    PERK_JUMP.style.animation = "none";
    PERK_JUMP.offsetHeight; // Reflow erzwingen
    PERK_JUMP.style.animation = "Perk 2s ease-in";
    PERK_JUMP.style.opacity = "0.5";
    Cyberpsychose_Handler();
    Notify(
      locales[settings.language].notifyPerksTitle,
      locales[settings.language].notifyPerksJumpYes,
      "info",
      3000
    );

    setTimeout(() => {
      game.player.settings.jumpForce = 20;
      perksState.jump = false;
      let newPerks = game.player.activePerks.filter((perk) => {
        return perk !== "jump";
      });
      game.player.activePerks = newPerks;
    }, 5000); // Boostzeit in Millisekunden

    setTimeout(() => {
      console.log("jumpboost ist nutzbar!");
      PERK_JUMP.style.opacity = "1";
    }, 10000); // Cooldown in Millisekunden
  } else {
    Notify(
      locales[settings.language].notifyPerksTitle,
      "Jumpboost not available",
      "error",
      3500
    );
  }
}

function Perks_Instakillhandler() {
  let character = JSON.parse(localStorage.getItem("characters")).find(
    (c) => c.id === game.player.id
  );

  if (character.perks.includes("instakill") && !perksState.instakill) {
    let PERK_INSTAKILL = document.getElementById("perk-instakill");
    game.perksCount++;
    perksState.instakill = true;
    game.sounds.perk.play();
    PERK_INSTAKILL.style.animation = "none";
    PERK_INSTAKILL.offsetHeight; // Reflow erzwingen
    PERK_INSTAKILL.style.animation = "Perk 2s ease-in";
    PERK_INSTAKILL.style.opacity = "0.5";
    Cyberpsychose_Handler();
    Notify(
      locales[settings.language].notifyPerksTitle,
      locales[settings.language].notifyPerksInstakillYes,
      "info",
      3000
    );

    setTimeout(() => {
      perksState.instakill = false;
      let newPerks = game.player.activePerks.filter((perk) => {
        return perk !== "instakill";
      });
      game.player.activePerks = newPerks;
    }, 1); //boostzeit in millisekunden

    setTimeout(() => {
      console.log("instakill ist nutzbar!");
      PERK_INSTAKILL.style.opacity = "1";
    }, 30000); //cooldown in millisekunden
  } else {
    Notify(
      locales[settings.language].notifyPerksTitle,
      "Instakill not available",
      "error",
      3500
    );
  }
}

async function Cyberpsychose_Handler() {
  if (game.perksCount >= 6) {
    Notify("Perks", "Cypberpsycho active", "info", 3500);
    if (!game.cyberpsycho) {
      game.cyberpsycho = true;
      await loadMap(game.core.map, game.core.tileSize);
    }
  }
}
