const sprites = new Image();
const hitSound = new Audio();
const pointSound = new Audio();

sprites.src = "./sprites.png";
hitSound.src = "./efects/hit.wav";
pointSound.src = "./efects/point.wav"

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const globals = {};
let frame = 0;
let score = 0;

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

const medal = {
  bronze: {
    sourceX: 48,
    sourceY: 124,
    width: 44,
    height: 44,
  },
  silver: {
    sourceX: 48,
    sourceY: 78,
    width: 44,
    height: 44,
  },
  gold: {
    sourceX: 0,
    sourceY: 124,
    width: 44,
    height: 44,
  },
  platinum: {
    sourceX: 0,
    sourceY: 78,
    width: 44,
    height: 44,
  },
  getAward: () => {
    const bestScore = localStorage.getItem('@FlappyBird/bestScore');

    let award = undefined;

    if (bestScore >= 10 && bestScore < 20) {
      award = medal.bronze;
    }

    if (bestScore >= 20 && bestScore < 30) {
      award = medal.silver;
    }

    if (bestScore >= 30 && bestScore < 40) {
      award = medal.gold;
    }

    if (bestScore >= 40) {
      award = medal.platinum;
    }

    return award;
  }
}

const messageGameOver = {
  sourceX: 134,
  sourceY: 153,
  width: 226,
  height: 200,
  x: (canvas.width - 226) / 2,
  y: 50,

  font: "18px FlappyBird",
  color: "#FFF",

  draw() {
    context.drawImage(
      sprites,
      messageGameOver.sourceX,
      messageGameOver.sourceY,
      messageGameOver.width,
      messageGameOver.height,
      messageGameOver.x,
      messageGameOver.y,
      messageGameOver.width,
      messageGameOver.height
    );

    context.font = messageGameOver.font;
    context.fillStyle = messageGameOver.color;
    context.fillText(score, 225, 145);

    const bestScore = localStorage.getItem('@FlappyBird/bestScore');
    context.font = messageGameOver.font;
    context.fillStyle = messageGameOver.color;
    context.fillText(bestScore, 225, 185);


    const award = medal.getAward();

    if (award) {
      context.drawImage(
        sprites,
        award.sourceX,
        award.sourceY,
        award.width,
        award.height,
        73,
        137,
        award.width,
        award.height
      );
    }

  },
}

const scoreboard = {
  font: "30px FlappyBird",
  color: "#FFF",

  draw() {
    context.font = scoreboard.font;
    context.fillStyle = scoreboard.color;
    context.fillText(score, canvas.width / 2, 40)
  }
}

function createBird() {
  const bird = {
    width: 33,
    height: 23,
    x: 40,
    y: 135,
    speed: 0,
    gravity: 0.25,
    jump: 4.5,
    dead: false,

    rise() {
      bird.speed = -bird.jump;
    },
    fall() {
      bird.speed = bird.speed + bird.gravity;
      bird.y = bird.y + bird.speed;
    },
    collision: () => {
      return {
        withGround: () => {
          const birdY = bird.y + bird.height;

          const groundY = globals.ground.y;

          if (birdY >= groundY) {
            bird.dead = true;
            return true;
          }

          return false;
        },
        withPipe: () => {
          const invadePipeArea = globals.pipesPairs.pairs[0] && bird.x + bird.width >= globals.pipesPairs.pairs[0].x;

          if (invadePipeArea) {
            const leavePipeArea = bird.x > globals.pipesPairs.pairs[0].x + upPipe.width;

            if (!leavePipeArea) {
              if (bird.y <= globals.pipesPairs.pairs[0].skyPipe.y + globals.pipesPairs.pairs[0].skyPipe.height) {
                bird.dead = true;
                return true;
              }

              if (bird.y + bird.height >= globals.pipesPairs.pairs[0].groundPipe.y) {
                bird.dead = true;
                return true;
              }
            }
          }
          return false;
        }
      }
    },
    makePoint: () => {
      pointSound.play();
      score = score + 1;
    },
    update() {
      if (bird.collision().withGround() || bird.collision().withPipe()) {
        const curretBestScore = localStorage.getItem("@FlappyBird/bestScore");

        if (score > Number(curretBestScore)) {
          localStorage.setItem("@FlappyBird/bestScore", score);
        }

        hitSound.play();
        hitSound.onended = () => {
          screens.change(screens.GAME_OVER);
        }
        return;
      }

      if (!bird.dead) {
        bird.fall();
      }
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

      // context.strokeRect(
      //   bird.x,
      //   bird.y,
      //   bird.width,
      //   bird.height
      // );
    },
  };

  return bird;
};

function createGround() {
  const ground = {
    sourceX: 0,
    sourceY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      if (!globals.bird.dead) {
        ground.x = (ground.x - 1) % (ground.width / 2);
      }
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
};

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
  },
  getDimessions: () => {
    const { width, height } = downPipe;
    return {
      width,
      height
    }
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
  },
  getDimessions: () => {
    const { width, height } = upPipe;
    return {
      width,
      height
    }
  }
};

function createPipesPairs() {
  const pipesPairs = {
    yMin: -365,
    yMax: -140,
    gap: 80,
    speed: 1.8,

    pairs: [],

    draw() {
      pipesPairs.pairs.forEach(pair => {
        //downPipe
        downPipe.draw({ x: pair.x, y: pair.skyPipe.y });

        //UpPipe
        upPipe.draw({ x: pair.x, y: pair.groundPipe.y });
      })
    },

    update() {
      if (!globals.bird.dead) {
        const frameInterval = 110;
        const currentFrameInterval = frame % frameInterval;

        if (currentFrameInterval === 0) {
          const x = canvas.width + 52;
          const yRandom = Math.random() * (pipesPairs.yMax - pipesPairs.yMin) + pipesPairs.yMin;
          const yWithGap = yRandom + downPipe.height + pipesPairs.gap;

          const skyPipe = { ...downPipe.getDimessions(), y: yRandom };
          const groundPipe = { ...downPipe.getDimessions(), y: yWithGap };

          pipesPairs.pairs.push({
            x,
            skyPipe,
            groundPipe
          });
        }

        pipesPairs.pairs.forEach((pair, index, object) => {
          if (pair.x < -pair.skyPipe.width) {
            globals.bird.makePoint();
            object.splice(index, 1);
          } else {
            pair.x = pair.x - pipesPairs.speed;
          }
        });
      }
    }
  }

  return pipesPairs;
};

const screens = {
  START: {
    initialize() {
      const bestScore = localStorage.getItem("@FlappyBird/bestScore");

      if (!bestScore) {
        localStorage.setItem("@FlappyBird/bestScore", 0);
      }

      globals.bird = createBird();
      globals.ground = createGround();
      globals.pipesPairs = createPipesPairs();
      score = 0;
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
      scoreboard.draw();
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
  GAME_OVER: {
    initialize() {
      globals.bird = createBird();
      globals.ground = createGround();
      globals.pipesPairs = createPipesPairs();
    },
    draw() {
      background.draw();
      globals.ground.draw();
      messageGameOver.draw();
    },
    update() { },
    click() {
      screens.change(screens.START);
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
