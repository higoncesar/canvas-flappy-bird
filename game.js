const sprites = new Image();
const hitSound = new Audio();

sprites.src = "./sprites.png";
hitSound.src = "./efects/hit.wav";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const globals = {};

function createBird() {
  const bird = {
    sourceX: 0,
    sourceY: 0,
    width: 35,
    height: 25,
    x: 10,
    y: 50,
    speed: 0,
    gravity: 0.25,
    jump: 4.5,
    rise() {
      bird.speed = -bird.jump;
    },
    fall() {
      bird.speed = bird.speed + bird.gravity;
      bird.y = bird.y + bird.speed;
    },
    update() {
      if (collision(bird, ground)) {
        hitSound.play();
        setTimeout(() => {
          screens.change(screens.START);
        }, 500);
        return;
      }
      bird.fall();
    },
    draw() {
      context.drawImage(
        sprites,
        bird.sourceX,
        bird.sourceY,
        bird.width,
        bird.height,
        bird.x,
        bird.y,
        bird.width,
        bird.height
      );
    },
  };

  return bird;
}

const collision = (bird, ground) => {
  const birdY = bird.y + bird.height;

  const groundY = ground.y;

  if (birdY >= groundY) {
    return true;
  }

  return false;
};

const ground = {
  sourceX: 0,
  sourceY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  draw() {
    context.drawImage(
      sprites,
      ground.sourceX,
      ground.sourceY,
      ground.width,
      ground.height,
      ground.x,
      ground.y,
      ground.width,
      ground.height
    );

    context.drawImage(
      sprites,
      ground.sourceX,
      ground.sourceY,
      ground.width,
      ground.height,
      ground.x + ground.width,
      ground.y,
      ground.width,
      ground.height
    );
  },
};

const background = {
  sourceX: 390,
  sourceY: 0,
  width: 276,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = "#4ebbc5";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.sourceX,
      background.sourceY,
      background.width,
      background.height,
      background.x,
      background.y,
      background.width,
      background.height
    );

    context.drawImage(
      sprites,
      background.sourceX,
      background.sourceY,
      background.width,
      background.height,
      background.x + background.width,
      background.y,
      background.width,
      background.height
    );
  },
};

const messageGetReady = {
  sourceX: 136,
  sourceY: 0,
  width: 171,
  height: 152,
  x: (canvas.width - 171) / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      messageGetReady.sourceX,
      messageGetReady.sourceY,
      messageGetReady.width,
      messageGetReady.height,
      messageGetReady.x,
      messageGetReady.y,
      messageGetReady.width,
      messageGetReady.height
    );
  },
};

const screens = {
  START: {
    initialize() {
      globals.bird = createBird();
    },
    draw() {
      background.draw();
      ground.draw();
      globals.bird.draw();
      messageGetReady.draw();
    },
    update() {},
    click() {
      screens.change(screens.GAME);
    },
  },
  GAME: {
    draw() {
      background.draw();
      ground.draw();
      globals.bird.draw();
    },
    update() {
      globals.bird.update();
    },
    click() {
      globals.bird.rise();
    },
  },
  current: undefined,
  change(screen) {
    screens.current = screen;

    if (screen.initialize) {
      screen.initialize();
    }
  },
};

function loop() {
  screens.current.draw();
  screens.current.update();
  requestAnimationFrame(loop);
}

canvas.addEventListener("click", function () {
  screens.current.click();
});

screens.change(screens.START);
loop();
