class Npc {
  constructor(startPosX, startPosY, width, height, level) {
    this.posX = startPosX;
    this.posY = startPosY;
    this.settings = {
      width: width,
      height: height,
      sprite: document.getElementById("npc"),
      level: level,
    };

    // Dialog Eigenschaften
    this.dialogImage = document.getElementById("dialog"); // Das Bild für den Dialog
    this.showDialog = true;
    this.dialogTexts = [
      `A, D, W zum bewegen
       und 1-4 um
       die Items auszuwählen
      `,
      `Du bist bereit den 
      Datenträger zu liefern!
      Viel Erfolg!`,
      `Deine Fähigkeiten
      kannst du mit Q, E und X 
      einzusetzen!
      Sie können dich retten.`,
    ];
    this.currentTextIndex = 0;
    this.dialogText = this.dialogTexts[this.currentTextIndex];
    this.dialogOffsetY = -150; // Position des Dialogs über dem NPC

    this.frameCount = 4;
    this.currentFrame = 0;
    this.frameWidth = this.settings.sprite.width / this.frameCount;
    this.frameHeight = this.settings.sprite.height;
    this.frameTimer = 0;
    this.frameInterval = 25;
    this.enterCount = 0;
  }

  initialize() {
    if (this.settings.level === game.core.currentLevel) {
      this.draw();
      document.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && this.showDialog) {
          this.enterCount++;
          console.log("Enter gedrückt:", this.enterCount, "mal");

          if (this.enterCount >= 5) {
            // Nach 3 Mal Enter Dialog ausblenden
            this.showDialog = false;
            console.log("Dialog ausgeblendet");
          } else {
            // Sonst zum nächsten Text wechseln
            this.nextDialogText();
          }
        }
      });
    }
  }

  nextDialogText() {
    this.currentTextIndex =
      (this.currentTextIndex + 1) % this.dialogTexts.length;
    this.dialogText = this.dialogTexts[this.currentTextIndex];
  }

  draw() {
    const sourceX = this.currentFrame * this.frameWidth;
    const sourceY = 0;

    game.canvas.mainCtx.drawImage(
      this.settings.sprite,
      sourceX,
      sourceY,
      this.frameWidth,
      this.frameHeight,
      this.posX,
      this.posY,
      this.settings.width,
      this.settings.height
    );

    // Dialog zeichnen
    if (this.showDialog) {
      this.drawDialog();
    }
  }

  drawDialog() {
    const dialogWidth = 300; // Breite des Dialogfensters
    const dialogHeight = 150; // Höhe des Dialogfensters

    const dialogX = this.posX + this.settings.width / 3 - dialogWidth / 3;
    const dialogY = this.posY + this.dialogOffsetY;

    // Dialogbild mit benutzerdefinierter Größe zeichnen
    game.canvas.mainCtx.drawImage(
      this.dialogImage,
      0,
      0,
      this.dialogImage.width,
      this.dialogImage.height,
      dialogX,
      dialogY,
      dialogWidth,
      dialogHeight
    );

    // Text im Dialog zeichnen
    game.canvas.mainCtx.font = "14px Arial";
    game.canvas.mainCtx.fillStyle = "white";
    game.canvas.mainCtx.textAlign = "left"; // Von zentriert auf linksbündig geändert

    // Position für den Text berechnen
    const textX = dialogX + 20; // Abstand vom linken Rand des Dialogs
    const textY = dialogY + 40; // Abstand vom oberen Rand des Dialogs

    // Mehrere Zeilen Text zeichnen
    const lines = this.dialogText.split("\n");
    const lineHeight = 16; // Zeilenhöhe

    lines.forEach((line, index) => {
      game.canvas.mainCtx.fillText(
        line.trim(),
        textX,
        textY + index * lineHeight
      );
    });

    // "Drücke Enter" Hinweis am unteren Rand des Dialogs
    game.canvas.mainCtx.font = "12px Arial";
    const enterText =
      this.enterCount === 4
        ? "   Drücke Enter zum Schließen"
        : "   Drücke Enter für mehr...";
    game.canvas.mainCtx.fillText(enterText, textX, dialogY + dialogHeight - 30);
  }

  updateAnimation() {
    this.frameTimer++;

    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }

  setDialogText(text) {
    this.dialogText = text;
  }

  update() {
    if (this.settings.level === game.core.currentLevel) {
      this.updateAnimation();
      this.draw();
    }
  }
}
