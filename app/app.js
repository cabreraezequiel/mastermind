var gameWidth = window.innerWidth
var gameHeight = window.innerHeight - 10
var ratio = 1.5
if (gameHeight / gameWidth < ratio) {
  gameWidth = Math.ceil(gameHeight / ratio)
}
let app = new PIXI.Application({ width: gameWidth, height: gameHeight });
document.body.appendChild(app.view);

let gameBoard = PIXI.Sprite.from('../assets/board_1.png');
gameBoard.x = 0;
gameBoard.y = 0;
//gameBoard.width = gameWidth * 0.7;
gameBoard.height = gameHeight;
//gameBoard.height = gameHeight;
app.stage.addChild(gameBoard);
ballSlots = [];
balls = [];
correctCode = [];
answerCode = ["","","",""];
ballTextures = ['red.png', 'green.png', 'blue.png', 'brown.png'];
answerBalls = ["", "", "", ""];

const checkSprite = PIXI.Sprite.from('assets/play.png');
checkSprite.scale.set(0.16);
checkSprite.x = 358;
checkSprite.y = 600;
checkSprite.on('pointerdown', onCkickity);
app.stage.addChild(checkSprite);
checkSprite.interactive = true;
function onCkickity(){
  arraysEqual([...answerCode], [...correctCode]);
  newBallRow();
  answerBalls = ["","","",""];
  answerCode = ["","","",""];
}


function assignCode() {
  for (let i = 0; i < 4; i++) {
    correctCode.push(ballTextures[Math.floor(Math.random() * ballTextures.length)])
  }
}
assignCode();
console.log("Code: " + correctCode);

function createBallContainer(x, y, idx) {
  ballContainer = new PIXI.Graphics();
  ballContainer.lineStyle(2, 0xFEEB77, 1);
  ballContainer.beginFill(0x650A5A, 1);
  ballContainer.interactive = true;
  ballContainer.drawCircle(0, 0, (gameBoard.height * 0.02));
  ballContainer.endFill();
  ballContainer.x = x;
  ballContainer.y = y;
  ballContainer.idx = idx;
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


createBallContainer((gameBoard.width * + 305), (gameBoard.height * 0.907), 0);
createBallContainer((gameBoard.width * + 256), (gameBoard.height * 0.907), 1);
createBallContainer((gameBoard.width * + 208), (gameBoard.height * 0.907), 2);
createBallContainer((gameBoard.width * + 160), (gameBoard.height * 0.907), 3);


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
        answerCode[obj.idx] = this.ballTexture;
        answerBalls[obj.idx] = this;
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
    chechAnswer();
    console.log(balls);
    console.log("Answer: " + answerCode);
}

function chechAnswer() {
  answerCode = ["","","",""];
  for (slot of ballSlots) {
    for (ball of balls) {
      if (ball.x === slot.x && ball.y === slot.y) {
        answerCode[slot.idx] = ball.ballTexture;
        answerBalls[slot.idx] = ball; 
  }}
}
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

function arraysEqual(answer, code) {
  let correct = 0;
  let wrong = 0;
  let semi = 0;
  let correctIdx = [];

  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === code[i]) {
      correct += 1;
      correctIdx.push(answer[i]);
    }
  }

  for (i of correctIdx) {
    answer.splice(answer.indexOf(i), 1);
    code.splice(code.indexOf(i), 1);
  }

  for (i of answer) {
    if (code.includes(i)) {
      semi += 1;
      code.splice(code.indexOf(i), 1);
    }
  }

  wrong = 4 - (correct + semi);
  console.log("Code: " + correctCode);
  console.log([correct, semi, wrong]);
  printResult([correct, semi, wrong]);
}


let ballPositionY = 0;
for (ball of ballTextures) {
  ballPositionY += 80;
createBunny(
  Math.floor((gameWidth) - 50),
  Math.floor(ballPositionY),
  ball,
)};


const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 30,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});


function printResult(res) {
  var infoText = new PIXI.Text(res[0] + ' correct, ' + res[1] + ' semi, ' + res[2] + ' wrong!', style);
  infoText.x = 10;
  infoText.y = 40;
  const richText = new PIXI.Text('Congrats!', style);
  richText.x = 60;
  richText.y = 100;

app.stage.addChild(infoText);
if (res[0] === 4) {
app.stage.addChild(richText);
}
setTimeout(function(){
  app.stage.removeChild(infoText);
}, 2000);
}

function newBallRow() {
  for (elem of ballSlots) {
    elem.y -= (gameHeight * 0.112);
    console.log("this: " + elem);
  }
  for (elem of answerBalls) {
    elem.interactive = false;
  }
}
