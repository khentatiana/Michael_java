let canvas;
let ctx;

let framesPerSecond = 30

let paddleX = 0, paddleY, paddleHeight = 200;
let enemyX = 590, enemyY = 200, enemyHeight = 200, enemySpeedX = 0, enemySpeedY = 0;
let ballX = 300, ballY = 300, ballSpeedX = 5, ballSpeedY = 4;

window.onload=function() {
    window.addEventListener('mousemove', playerMove, true);
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    setInterval(function() {
        draw();
        move();
    }, 1000 / framesPerSecond);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(paddleX, paddleY, 10, paddleHeight);

    ctx.fillStyle = "white";
    ctx.fillRect(enemyX, enemyY, 10, enemyHeight);

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(ballX, ballY, 10, 0, 2 * Math.PI);

    ctx.closePath();
    ctx.fill();
}

function playerMove(event) {
    paddleY = event.clientY - paddleHeight;
}

function move() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if(ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if(ballX > canvas.width) {
        if(ballY > enemyY && ballY < enemyY + enemyHeight) {
            ballSpeedX = - ballSpeedX;
        } else {
            ballX = 300;
            ballY = 300;
            ballSpeedY = -ballSpeedY;
            ballSpeedX = -ballSpeedX;
        }
    }

    if(ballX < 0) {
        if(ballY > paddleY && ballY < paddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            ballX = 300;
            ballY = 300;
            ballSpeedY = -ballSpeedY;
            ballSpeedX = -ballSpeedX;
        }
    }
    enemyY += enemySpeedY;
    if(enemyY > ballY + enemyHeight / 2) {
        enemySpeedY = -5;
    }
    if(enemyY < ballY - enemyHeight / 2) {
        enemySpeedY = 5;
    }
}
