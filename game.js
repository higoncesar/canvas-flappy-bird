console.log("Flap Bird ");

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

function loop() {
  bird.update();
  background.draw();
  ground.draw();
  bird.draw();

  requestAnimationFrame(loop);
}

loop();
