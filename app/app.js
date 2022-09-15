const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const ballImage = new Image();
ballImage.src = 'red.png';

function drawBall() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(ballImage, 0, 0, 600, 600);
}
drawBall();

var background = new Image();
background.src = "http://i.imgur.com/yf6d9SX.jpg";

background.onload = function(){
    ctx.drawImage(background,0,0);   
}
