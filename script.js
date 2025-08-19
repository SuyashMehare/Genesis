let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
  x: boardWidth / 2 - playerWidth / 2,
  y: boardHeight - playerHeight - 5,
  width: playerWidth,
  height: playerHeight,
  velocityX: playerVelocityX,
};

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: ballVelocityX,
  velocityY: ballVelocityY,
};

// Brick setup
let brickWidth = 50;
let brickHeight = 15;
let brickRows = 4;
let brickColumns = 8;
let brickPadding = 10;
let brickOffsetTop = 60;
let brickOffsetLeft = 30;
let bricks = [];
let score = 0;

function initBricks() {
  bricks = [];
  for (let c = 0; c < brickColumns; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRows; r++) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
      };
    }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumns; c++) {
    for (let r = 0; r < brickRows; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        context.fillStyle = bricks[c][r].color;
        context.fillRect(brickX, brickY, brickWidth, brickHeight);
        context.strokeStyle = "#000";
        context.strokeRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function checkBrickCollisions() {
  for (let c = 0; c < brickColumns; c++) {
    for (let r = 0; r < brickRows; r++) {
      let brick = bricks[c][r];
      if (brick.status === 1) {
        if (detectCollision(ball, brick)) {
          ball.velocityY *= -1;
          brick.status = 0;
          score += 10;

          // Check if all bricks are broken
          if (checkWin()) {
            alert("YOU WIN! Score: " + score);
            document.location.reload();
          }
        }
      }
    }
  }
}

function checkWin() {
  for (let c = 0; c < brickColumns; c++) {
    for (let r = 0; r < brickRows; r++) {
      if (bricks[c][r].status === 1) {
        return false;
      }
    }
  }
  return true;
}

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  context.fillStyle = "lightgreen";
  context.fillRect(player.x, player.y, player.width, player.height);


  initBricks();
  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer);
};

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  context.fillStyle = "lightgreen";
  context.fillRect(player.x, player.y, player.width, player.height);

  context.fillStyle = "white";
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  drawBricks();
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("Score: " + score, 10, 25);

  if (ball.y <= 0) {
    ball.velocityY *= -1;
  }
  else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
    ball.velocityX *= -1;
  }
  else if (ball.y + ball.height >= boardHeight) {
   
  }
  if (topCollision(ball, player) || bottomCollision(ball, player)) {
    ball.velocityY *= -1;
  }
  else if (leftCollision(ball, player) || rightCollision(ball, player)) {
    ball.velocityX *= -1;
  }

  checkBrickCollisions();
}

function outOfBounds(xPosition) {
  return xPosition < 0 || xPosition + playerWidth > boardWidth;
}

function movePlayer(e) {
  if (e.code == "ArrowLeft") {
    let nextPlayerX = player.x - player.velocityX;
    if (!outOfBounds(nextPlayerX)) {
      player.x = nextPlayerX;
    }
  } else if (e.code == "ArrowRight") {
    let nextPlayerX = player.x + player.velocityX;
    if (!outOfBounds(nextPlayerX)) {
      player.x = nextPlayerX;
    }
  }
}

function detectCollision(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function topCollision(ball, block) {
  return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) {
  return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {
  return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
  return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}