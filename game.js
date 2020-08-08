const sprites = new Image();
const hitSound = new Audio();

sprites.src = "./sprites.png";
hitSound.src = "./efects/hit.wav";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const globals = {};
let frame = 0;

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

function createBird() {
  const bird = {
    width: 35,
    height: 25,
    x: 55,
    y: 135,
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
      if (collisionWithGround()) {
        hitSound.play();
        hitSound.onended = () => {
          screens.change(screens.START);
        }
        return;
      }
      bird.fall();
    },
    currentFrame: 0,
    updateCurrentFrame() {
      const frameInterval = 5;

      if ((frame % frameInterval) === 0) {
        bird.currentFrame = (bird.currentFrame + 1) % bird.moviments.length;
      }
    },
    moviments: [
      { sourceX: 0, sourceY: 0 },//wing up
      { sourceX: 0, sourceY: 26 },//wing in the middle
      { sourceX: 0, sourceY: 52 },//wing down
      { sourceX: 0, sourceY: 26 },//wing in the middle
    ],
    draw() {
      bird.updateCurrentFrame();
      const { sourceX, sourceY } = bird.moviments[bird.currentFrame];
      context.drawImage(
        sprites,
        sourceX,
        sourceY,
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

function createGround() {
  const ground = {
    sourceX: 0,
    sourceY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      ground.x = (ground.x - 1) % (ground.width / 2);
    },
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

  return ground;
}

const downPipe = {
  sourceX: 52,
  sourceY: 169,
  width: 52,
  height: 400,

  draw({ x, y }) {
    context.drawImage(
      sprites,
      downPipe.sourceX,
      downPipe.sourceY,
      downPipe.width,
      downPipe.height,
      x,
      y,
      downPipe.width,
      downPipe.height
    );
  }
};

const upPipe = {
  sourceX: 0,
  sourceY: 169,
  width: 52,
  height: 400,

  draw({ y, x }) {
    context.drawImage(
      sprites,
      upPipe.sourceX,
      upPipe.sourceY,
      upPipe.width,
      upPipe.height,
      x,
      y,
      upPipe.width,
      upPipe.height
    );
  }
};

function createPipesPairs() {
  const pipesPairs = {
    yMin: -365,
    yMax: -140,
    gap: 65,
    speed: 1.8,

    pairs: [],

    draw() {
      pipesPairs.pairs.forEach(pair => {
        //downPipe
        downPipe.draw({ x: pair.x, y: pair.yRandom });

        //UpPipe
        const yUpPipe = pair.yRandom + downPipe.height + pipesPairs.gap;
        upPipe.draw({ x: pair.x, y: yUpPipe });
      })
    },

    update() {
      const frameInterval = 100;
      const currentFrameInterval = frame % frameInterval;

      if (currentFrameInterval === 0) {
        pipesPairs.pairs.push({
          x: canvas.width + 52,
          yRandom: Math.random() * (pipesPairs.yMax - pipesPairs.yMin) + pipesPairs.yMin,
        });
      }

      pipesPairs.pairs.forEach((pair, index, object) => {
        if (pair.x < -downPipe.width) {
          object.splice(index, 1);
        } else {
          pair.x = pair.x - pipesPairs.speed;
        }
      });
    }
  }

  return pipesPairs;
}

function collisionWithGround() {
  const birdY = globals.bird.y + globals.bird.height;

  const groundY = globals.ground.y;

  if (birdY >= groundY) {
    return true;
  }

  return false;
};

const screens = {
  START: {
    initialize() {
      globals.bird = createBird();
      globals.ground = createGround();
      globals.pipesPairs = createPipesPairs();
    },
    draw() {
      background.draw();
      globals.ground.draw();
      globals.bird.draw();
      messageGetReady.draw();
    },
    update() { },
    click() {
      screens.change(screens.GAME);
    },
  },
  GAME: {
    draw() {
      background.draw();
      globals.bird.draw();
      globals.pipesPairs.draw();
      globals.ground.draw();
    },
    update() {
      globals.bird.update();
      globals.ground.update();
      globals.pipesPairs.update();
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
  frame = ++frame;
  screens.current.draw();
  screens.current.update();
  requestAnimationFrame(loop);
}

canvas.addEventListener("click", function () {
  screens.current.click();
});

window.addEventListener("keypress", function (event) {
  if (event.keyCode === 32) {
    screens.current.click();
  }
});

screens.change(screens.START);
loop();
