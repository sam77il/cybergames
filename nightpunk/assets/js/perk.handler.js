let cyberPh = {};
let kill = true;

function speedperk() {
  let q = true;
  document.addEventListener("keydown", function (event) {
    if (event.key === "q" && q) {
      let displaied = document.getElementById("perk2");
      console.log("speedperk hat einen cooldown!");
      game.player.settings.speed = 12;
      displaied.style.animation = "none";
      displaied.offsetHeight; // Reflow erzwingen
      displaied.style.opacity = "0.5";
      displaied.style.animation = "Perk 3s ease-in";
      Notify("Perks", "Speedboost ist aktiv", "info", 3000);

      if (game.player.settings.speed === 12 && event.key === "q" && q) {
        setTimeout(() => {
          game.player.settings.speed = 5;
        }, 6000); //boostzeit in millisekunden
      }
      q = false;

      setTimeout(() => {
        q = true;
        console.log("speedperk ist nutzbar!");
        game.player.settings.speed = 5;
        displaied.style.opacity = "1";
      }, 15000); //cooldown in millisekunden
    } else if (event.key === "q") {
      console.log("speedperk hat einen cooldown...");
    }
  });
}

//double jump perk

function jumpboost() {
  let e = true;
  document.addEventListener("keydown", function (event) {
    // Event als Parameter hinzugefügt
    if (event.key === "e" && e) {
      let displaied = document.getElementById("perk1");
      console.log("jumpboost hat einen cooldown!");
      game.player.settings.jumpForce = 25;
      displaied.style.animation = "none";
      displaied.offsetHeight; // Reflow erzwingen
      displaied.style.animation = "Perk 2s ease-in";
      displaied.style.opacity = "0.5";
      Notify("Perks", "Jumpboost ist aktiv", "info", 3000);

      if (game.player.settings.jumpForce === 25 && event.key === "e" && e) {
        setTimeout(() => {
          game.player.settings.jumpForce = 20;
        }, 5000); // Boostzeit in Millisekunden
      }

      e = false;

      setTimeout(() => {
        e = true;

        console.log("jumpboost ist nutzbar!");
        displaied.style.opacity = "1";

        if (displaied.style.opacity === "1") {
          displaied = null;
        }
        game.player.settings.jumpForce = 20;
      }, 10000); // Cooldown in Millisekunden
    } else if (event.key === "e") {
      console.log("jumpboost hat einen cooldown...");
    }
  });
}

// instakill perk

function instakill() {
  let x = true;
  document.addEventListener("keydown", function (event) {
    if (event.key === "x" && x) {
      let displaied = document.getElementById("perk3");
      console.log("instakill hat einen cooldown!");
      kill = true;
      displaied.style.animation = "none";
      displaied.offsetHeight; // Reflow erzwingen
      displaied.style.animation = "Perk 2s ease-in";
      displaied.style.opacity = "0.5";
      Notify("Perks", "Instakill ist aktiv", "info", 3000);

      if (kill === true && event.key === "x" && x) {
        setTimeout(() => {
          kill = false;
        }, 1); //boostzeit in millisekunden
      }
      x = false;

      setTimeout(() => {
        x = true;
        console.log("instakill ist nutzbar!");
        displaied.style.opacity = "1";
        kill = false;
      }, 30000); //cooldown in millisekunden
    } else if (event.key === "x") {
      console.log("instakill hat einen cooldown...");
    }
  });
}

instakill();
jumpboost();
speedperk();
