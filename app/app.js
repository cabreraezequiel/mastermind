var gameWidth = window.innerWidth
var gameHeight = window.innerHeight - 10
var ratio = 1.5
if (gameHeight / gameWidth < ratio) {
  gameWidth = Math.ceil(gameHeight / ratio)
}
let app = new PIXI.Application({ width: gameWidth, height: gameHeight });
document.body.appendChild(app.view);

let gameBoard = PIXI.Sprite.from('../assets/board.png');
gameBoard.x = 0;
gameBoard.y = 0;
gameBoard.height = gameHeight;
app.stage.addChild(gameBoard);
ballSlots = [];
balls = [];

function createBallContainer(x, y) {
  ballContainer = new PIXI.Graphics();
  ballContainer.lineStyle(2, 0xFEEB77, 1);
  ballContainer.beginFill(0x650A5A, 1);
  ballContainer.interactive = true;
  ballContainer.drawCircle(0, 0, (gameBoard.height * 0.029));
  ballContainer.endFill();
  ballContainer.x = x;
  ballContainer.y = y;
  app.stage.addChild(ballContainer);
  ballSlots.push(ballContainer);
}


function testForAABB(object1, object2) {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return bounds1.x < bounds2.x + bounds2.width
      && bounds1.x + bounds1.width > bounds2.x
      && bounds1.y < bounds2.y + bounds2.height
      && bounds1.y + bounds1.height > bounds2.y;
}


createBallContainer((gameBoard.width * + 305), (gameBoard.height * 0.907));
createBallContainer((gameBoard.width * + 256), (gameBoard.height * 0.907));
createBallContainer((gameBoard.width * + 208), (gameBoard.height * 0.907));
createBallContainer((gameBoard.width * + 160), (gameBoard.height * 0.907));


let sprite = PIXI.Sprite.from('red.png');
sprite.width = 50;
sprite.height = 50;
app.stage.addChild(sprite);

const texture = PIXI.Texture.from('red.png')

let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta;
  sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
});

function createBunny(x, y, ballTexture) {
  const texture = PIXI.Texture.from(ballTexture)
  const bunny = new PIXI.Sprite(texture);
  bunny.interactive = true;
  bunny.buttonMode = true;

  bunny.ballTexture = ballTexture;
  bunny.anchor.set(0.5);
  bunny.scale.set(0.1);

  bunny
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);

  bunny.x = x;
  bunny.y = y;
  bunny.originalX = x;
  bunny.originalY = y;

  app.stage.addChild(bunny);
  balls.push(bunny);
}

function onDragStart(event) {
  if (this.x === this.originalX && this.y === this.originalY) {
  createBunny(this.x, this.y, this.ballTexture)}
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
  this.scale.set(0.09);
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
    this.scale.set(0.1);
    let ballCheck = false;
    for (obj of ballSlots) {
      if (testForAABB(this, obj)) {
        this.x = obj.x;
        this.y = obj.y;
        ballCheck = true;
    }}
    if (ballCheck) {
      for (obj2 of balls) {
        if (this.x === obj2.x && this.y == obj2.y && (this !== obj2)) {
          const idx = balls.indexOf(obj2)
          obj2.destroy();
          balls.splice(idx,1);
      }}
    }
    else {
      if (this.x !== this.originalX && this.y !== this.originalY) {
      const idx = balls.indexOf(this);
      this.destroy();
      balls.splice(idx, 1);
    }
    }
    console.log(balls);
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

ballTextures = ['red.png', 'green.png', 'blue.png', 'brown.png']

let ballPositionY = 0;
for (ball of ballTextures) {
  ballPositionY += 80;
createBunny(
  Math.floor((gameWidth) - 50),
  Math.floor(ballPositionY),
  ball,
)};
