class Npc {
  constructor(startPosX, startPosY, npcWidth, npcHeight) {
    this.npcPosX = startPosX;
    this.npcPosY = startPosY;
    this.npcWidth = npcWidth;
    this.npcHeight = npcHeight;
    this.npc = document.getElementById("npc");

    // Dialog Eigenschaften
    this.dialogImage = document.getElementById("dialog"); // Das Bild für den Dialog
    this.showDialog = true;
    this.dialogTexts = [
      `W, A, S, D zum bewegen
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
    this.frameWidth = this.npc.width / this.frameCount;
    this.frameHeight = this.npc.height;
    this.frameTimer = 0;
    this.frameInterval = 25;
    this.initialize();

    this.enterCount = 0;
  }

  initialize() {
    this.draw();
    // Event-Listener für Enter-Taste hinzufügen
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
  nextDialogText() {
    // Zum nächsten Text wechseln
    this.currentTextIndex =
      (this.currentTextIndex + 1) % this.dialogTexts.length;
    this.dialogText = this.dialogTexts[this.currentTextIndex];
  }

  draw() {
    // NPC zeichnen
    const sourceX = this.currentFrame * this.frameWidth;
    const sourceY = 0;

    ctx.drawImage(
      this.npc,
      sourceX,
      sourceY,
      this.frameWidth,
      this.frameHeight,
      this.npcPosX,
      this.npcPosY,
      this.npcWidth,
      this.npcHeight
    );

    // Dialog zeichnen
    if (this.showDialog) {
      this.drawDialog();
    }
  }

  drawDialog() {
    const dialogWidth = 300; // Breite des Dialogfensters
    const dialogHeight = 150; // Höhe des Dialogfensters

    const dialogX = this.npcPosX + this.npcWidth / 3 - dialogWidth / 3;
    const dialogY = this.npcPosY + this.dialogOffsetY;

    // Dialogbild mit benutzerdefinierter Größe zeichnen
    ctx.drawImage(
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
    ctx.font = "14px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left"; // Von zentriert auf linksbündig geändert

    // Position für den Text berechnen
    const textX = dialogX + 20; // Abstand vom linken Rand des Dialogs
    const textY = dialogY + 40; // Abstand vom oberen Rand des Dialogs

    // Mehrere Zeilen Text zeichnen
    const lines = this.dialogText.split("\n");
    const lineHeight = 16; // Zeilenhöhe

    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), textX, textY + index * lineHeight);
    });

    // "Drücke Enter" Hinweis am unteren Rand des Dialogs
    ctx.font = "12px Arial";
    const enterText =
      this.enterCount === 4
        ? "   Drücke Enter zum Schließen"
        : "   Drücke Enter für mehr...";
    ctx.fillText(enterText, textX, dialogY + dialogHeight - 30);
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
    // this.showDialog = true;
    this.updateAnimation();

    // Zeichne den NPC
    this.draw();
  }
}
