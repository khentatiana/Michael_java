const BG_COLOR = '#231f20'
const SNAKE_COLOR = '#7CFC00'
const FOOD_COLOR = '#cc0600'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const score = document.getElementById('score');

canvas.width = canvas.height = 500;

const FR = 10;
const S = 20;
const T = canvas.width / S;

let pos, vel, food, snake;

function init() {
    pos = {x: 10, y: 10};
    vel = {x: 0, y: 0};

    snake = [
        {x: 8, y: 10},
        {x: 9, y: 10},
        {x: 10, y: 10},
    ];

    randomFood();
}

init()

function randomFood() {
    food = {
        x: Math.floor(Math.random() * T),
        y: Math.floor(Math.random() * T)
    }

    for (let cell of snake) {
        if (cell.x >= food.x && food.y === cell.y) {
            return randomFood();
        }
    }
}

document.addEventListener('keydown', keydown);

function keydown(e) {
    switch(e.key) {
        case 'ArrowLeft': {
            return vel = {x: -1, y: 0};
        }
        case 'ArrowUp': {
            return vel = {x: 0, y: -1};
        }
        case 'ArrowRight': {
            return vel = {x: 1, y: 0};
        }
        case 'ArrowDown': {
            return vel = {x: 0, y: 1};
        }
    }
}

setInterval(() => {
    requestAnimationFrame(gameLoop);
}, 1000 / FR);

function gameLoop() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = SNAKE_COLOR;
    for (let cell of snake) {
        ctx.fillRect(cell.x * S, cell.y * S, S, S);
    }

    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food.x * S, food.y * S, S, S);

    pos.x += vel.x;
    pos.y += vel.y;

    if (pos.x < 0 || pos.x > T || pos.y < 0 || pos.y > T) {
        init();
    }

    if (food.x === pos.x && food.y === pos.y) {
        snake.push({...pos});
        pos.x += vel.x;
        pos.y += vel.y;
        randomFood();
    }

    if (vel.x || vel.y) {
        for (let cell of snake) {
            if (cell.x === pos.x && cell.y === pos.y) {
                return init();
            }
        }
        snake.push({...pos});
        snake.shift();
    }
}
