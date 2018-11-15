let gameloop;
let game;
let snake;

function createGameboard() {
    const gameBoard = $('#game-board');
    for (let i = 0; i < game.size; i++) {
        const row = $('<tr></tr>');
        for (let j = 0; j < game.size; j++) {
            const cell = $('<td></td>');
            cell.attr('id', `${j}-${i}`);
            cell.addClass('cell');

            row.append(cell);
        }

        gameBoard.append(row);
    }
}

function addFruit() {
    let coords;

    function generateRandomCoordinates() {
        return {
            x: Math.floor(Math.random() * game.size),
            y: Math.floor(Math.random() * game.size)
        };
    }

    do {
        coords = generateRandomCoordinates();
    } while (snake.body.find(cell => cell.x === coords.x && cell.y === coords.y));

    game.fruit = coords;
    $('.fruit').removeClass('fruit');
    $(`#${coords.x}-${coords.y}`).addClass('fruit');
}

function drawSnake() {
    $('td').removeClass('snake');
    snake.body.forEach(snakeCell => {
        $(`#${snakeCell.x}-${snakeCell.y}`).addClass('snake');
    });
}

function getNextCell(head, direction) {
    switch(direction) {
        case 'right':
            return { x: head.x + 1, y: head.y };
        case 'left':
            return { x: head.x - 1, y: head.y };
        case 'down':
            return { x: head.x, y: head.y + 1 };
        case 'up':
            return { x: head.x, y: head.y - 1 };
    }
}

function moveSnake(growSnake) {
    if (snake.direction.length > 1) {
        snake.direction.shift();
    }

    const head = snake.body[0];
    const direction = snake.direction[0];
    const newHead = getNextCell(head, direction);

    snake.body.unshift(newHead);

    if (!growSnake) {
        snake.body.pop();
    }
}

function hasCollision() {
    const head = snake.body[0];
    let headCount = 0;

    snake.body.forEach(el => {
        if (head.x === el.x && head.y === el.y) {
            headCount++;
        }
    });

    return head.x < 0 || head.x > game.size - 1 ||
        head.y < 0 || head.y > game.size -1 ||
        headCount > 1;
}

function checkFruit() {
    return snake.body.find(cell => cell.x === game.fruit.x && cell.y === game.fruit.y);
}

function addNextDirection(e) {
    e = e || window.event;

    switch(e.key) {
        case 'd':
        case 'ArrowRight':
            snake.direction.push('right');
            break;
        case 'a':
        case 'ArrowLeft':
            snake.direction.push('left');
            break;
        case 's':
        case 'ArrowDown':
            snake.direction.push('down');
            break;
        case 'w':
        case 'ArrowUp':
            snake.direction.push('up');
            break;
        case 'Enter':
            endGame();
            break;
    }
}

function updateScore() {
    $('#score-label').text(`Score: ${game.score}`);
}

function startGame() {
    $('#button-overlay').addClass('hidden');
    setUpGame();
    runGame();
}

function endGame() {
    $('#button-overlay').removeClass('hidden');
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
}

function setUpGame() {
    game = {
        size: 25,
        dead: false,
        score: 0,
        speed: 100
    };

    snake = {
        direction: ['right'],
        body: [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 }
        ]
    };

    $('#game-board').empty();

    updateScore();
    createGameboard(game.size);
    drawSnake(snake);
    addFruit();
}

function runGame() {
    gameLoop = setInterval(() => {
        const growSnake = checkFruit();
        
        if (growSnake) {
            addFruit();
            game.score += 1;
            updateScore();
        }

        moveSnake(growSnake);

        if (hasCollision()) {
            endGame();
            return;
        }

        drawSnake();
    }, game.speed);
}

$(function() {
    setUpGame();
    $(document).keydown(addNextDirection);
    $('#start-button').click(startGame);
});
