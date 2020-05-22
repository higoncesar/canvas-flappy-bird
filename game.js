const sprites = new Image();

sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const bird = {
  sourceX: 0,
  sourceY: 0,
  width: 35,
  height: 25,
  x: 10,
  y: 50,
  speed: 0,
  gravity: 0.25,
  update: () => {
    bird.speed = bird.speed + bird.gravity;
    bird.y = bird.y + bird.speed;
  },
  draw: () => {
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

const ground = {
  sourceX: 0,
  sourceY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  draw: () => {
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
  draw: () => {
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
  draw: () => {
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
    draw: () => {
      background.draw();
      ground.draw();
      bird.draw();
      messageGetReady.draw();
    },
    update: () => {},
    click: () => {
      screens.change(screens.GAME);
    },
  },
  GAME: {
    draw: () => {
      background.draw();
      ground.draw();
      bird.draw();
    },
    update: () => {
      bird.update();
    },
    click: () => {
      console.log("CLICK ON THE GAME SCREEN");
    },
  },
  current: undefined,
  change: (screen) => {
    screens.current = screen;
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
