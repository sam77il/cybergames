function Perks_Speedhandler() {
  let character = JSON.parse(localStorage.getItem("characters")).find(
    (c) => c.id === game.player.id
  );

  if (character.perks.includes("speed")) {
    let PERK_SPEED = document.getElementById("perk-speed");
    game.player.settings.speed = 12;
    PERK_SPEED.style.animation = "none";
    PERK_SPEED.offsetHeight; // Reflow erzwingen
    PERK_SPEED.style.opacity = "0.5";
    PERK_SPEED.style.animation = "Perk 3s ease-in";
    Notify("Perks", "Speedboost ist aktiv", "info", 3500);

    setTimeout(() => {
      game.player.settings.speed = 5;
    }, 6000);

    setTimeout(() => {
      console.log("speedperk ist nutzbar!");
      game.player.settings.speed = 5;
      PERK_SPEED.style.opacity = "1";
    }, 15000);
  } else {
    Notify("Perks", "Du hast kein Speedboost Perk", "error", 3500);
  }
}

function Perks_Jumphandler() {
  let character = JSON.parse(localStorage.getItem("characters")).find(
    (c) => c.id === game.player.id
  );

  if (character.perks.includes("jump")) {
    let PERK_JUMP = document.getElementById("perk-jump");
    game.player.settings.jumpForce = 25;
    PERK_JUMP.style.animation = "none";
    PERK_JUMP.offsetHeight; // Reflow erzwingen
    PERK_JUMP.style.animation = "Perk 2s ease-in";
    PERK_JUMP.style.opacity = "0.5";
    Notify("Perks", "Jumpboost ist aktiv", "info", 3000);

    setTimeout(() => {
      game.player.settings.jumpForce = 20;
    }, 5000); // Boostzeit in Millisekunden

    setTimeout(() => {
      console.log("jumpboost ist nutzbar!");
      PERK_JUMP.style.opacity = "1";
      game.player.settings.jumpForce = 20;
    }, 10000); // Cooldown in Millisekunden
  } else {
    Notify("Perks", "Du hast kein Jumpboost Perk", "error", 3500);
  }
}

function Perks_Instakillhandler() {
  let character = JSON.parse(localStorage.getItem("characters")).find(
    (c) => c.id === game.player.id
  );

  if (character.perks.includes("instakill")) {
    let PERK_INSTAKILL = document.getElementById("perk-instakill");
    PERK_INSTAKILL.style.animation = "none";
    PERK_INSTAKILL.offsetHeight; // Reflow erzwingen
    PERK_INSTAKILL.style.animation = "Perk 2s ease-in";
    PERK_INSTAKILL.style.opacity = "0.5";
    Notify("Perks", "Instakill ist aktiv", "info", 3000);

    setTimeout(() => {
      kill = false;
    }, 1); //boostzeit in millisekunden

    setTimeout(() => {
      console.log("instakill ist nutzbar!");
      PERK_INSTAKILL.style.opacity = "1";
    }, 30000); //cooldown in millisekunden
  } else {
    Notify("Perks", "Du hast kein Instakill Perk", "error", 3500);
  }
}
