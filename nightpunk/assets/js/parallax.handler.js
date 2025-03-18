let gameObjects = [];
let gameSpeed = 0;
let previousCameraX = 0;

// Bilder für Parallax-Hintergründe
const backgroundLayer1 = new Image();
backgroundLayer1.src = "./assets/img/hintergrund_1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "./assets/img/hintergrund_2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "./assets/img/hintergrund_3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "./assets/img/hintergrund_4.png";

class Layer {
  constructor(image, speedModifier) {
    this.x = 0;
    this.y = 0;
    this.width = 1024; // Breite des Hintergrundbildes
    this.height = 600; // Höhe des Hintergrundbildes
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = 0;
  }

  update(cameraSpeed) {
    this.speed = cameraSpeed * this.speedModifier;
    this.x = (this.x - this.speed) % this.width;

    if (this.x > 0) {
      this.x -= this.width;
    }
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x - this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

function initParallaxBackground() {
  const hintergrund_1 = new Layer(backgroundLayer1, 0.1); // Am weitesten entfernt, bewegt sich am langsamsten
  const hintergrund_2 = new Layer(backgroundLayer2, 0.3);
  const hintergrund_3 = new Layer(backgroundLayer3, 0.7);
  const hintergrund_4 = new Layer(backgroundLayer4, 1.0); // Am nächsten, bewegt sich am schnellsten

  gameObjects = [hintergrund_1, hintergrund_2, hintergrund_3, hintergrund_4];
}

function updateParallaxOffset(cameraX) {
  const cameraSpeed = cameraX - previousCameraX;
  previousCameraX = cameraX;

  // Alternative: Bewegungsgeschwindigkeit basierend auf Tastatureingaben
  if (controls.right) {
    gameSpeed = 5;
  } else if (controls.left) {
    gameSpeed = -5;
  } else {
    gameSpeed = cameraSpeed;
  }
}

function updateParallaxLayers() {
  // Aktualisiere jeden Layer mit der aktuellen Geschwindigkeit
  gameObjects.forEach((layer) => {
    layer.update(gameSpeed);
  });
}

function drawParallaxLayers() {
  // Zeichne alle Parallax-Layer
  gameObjects.forEach((layer) => {
    layer.draw();
  });
}
