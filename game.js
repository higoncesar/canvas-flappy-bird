console.log("Flap Bird ");

const sprites = new Image();

sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const bird = {
  sourceX: 0,
  sourceY: 0,
  largura: 35,
  altura: 25,
  x: 70,
  y: 50,
  draw: () => {
    context.drawImage(
      sprites,
      bird.sourceX,
      bird.sourceY,
      bird.largura,
      bird.altura,
      bird.x,
      bird.y,
      bird.largura,
      bird.altura
    );
  },
};

const ground = {
  sourceX: 0,
  sourceY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  draw: () => {
    context.drawImage(
      sprites,
      ground.sourceX,
      ground.sourceY,
      ground.largura,
      ground.altura,
      ground.x,
      ground.y,
      ground.largura,
      ground.altura
    );

    context.drawImage(
      sprites,
      ground.sourceX,
      ground.sourceY,
      ground.largura,
      ground.altura,
      ground.x + ground.largura,
      ground.y,
      ground.largura,
      ground.altura
    );
  },
};

const background = {
  sourceX: 390,
  sourceY: 0,
  largura: 276,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  draw: () => {
    context.fillStyle = "#4ebbc5";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.sourceX,
      background.sourceY,
      background.largura,
      background.altura,
      background.x,
      background.y,
      background.largura,
      background.altura
    );

    context.drawImage(
      sprites,
      background.sourceX,
      background.sourceY,
      background.largura,
      background.altura,
      background.x + background.largura,
      background.y,
      background.largura,
      background.altura
    );
  },
};

function loop() {
  background.draw();
  ground.draw();
  bird.draw();

  bird.y++;
  requestAnimationFrame(loop);
}

loop();
