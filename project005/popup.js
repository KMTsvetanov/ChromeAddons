let gameWrapper = document.getElementById("game_wrapper");

let scoreElement;
let refreshIntervalId;
let ctx;
let gameState;
let canvas;

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function random(n) {
    return Math.floor(Math.random() * n);
}

class RectCollider {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    isColliding(rectCollider) {
        if (
            this.x < rectCollider.x + rectCollider.width &&
            this.x + this.width > rectCollider.x &&
            this.y < rectCollider.y + rectCollider.height &&
            this.height + this.y > rectCollider.y
        ) {
            return true;
        }
        return false;
    }
}

function checkCollision(gameState) {
    let playerCollider = new RectCollider(
        gameState.rectPosX,
        gameState.rectPosY,
        10,
        10
    );
    for (let i = 0; i < gameState.enemies.length; ++i) {
        let enemyCollider = new RectCollider(
            gameState.enemies[i].x,
            gameState.enemies[i].y,
            10,
            10
        );
        if (playerCollider.isColliding(enemyCollider)) {
            return true;
        }
    }
    for (let i = 0; i < gameState.friends.length; ++i) {
        let friendCollider = new RectCollider(
            gameState.friends[i].x,
            gameState.friends[i].y,
            5,
            5
        );
        if (playerCollider.isColliding(friendCollider)) {
            gameState.playerSpeed *= 1.05;
            gameState.friends.splice(i, 1);
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameState.enemyTimeout -= 1;
    if (gameState.enemyTimeout == 0) {
        gameState.enemyTimeout = Math.floor(gameState.enemyTimeoutInit);
        gameState.enemies.push({
            x: canvas.width,
            y: random(canvas.height),
            velocity: gameState.enemySpeed
        });
        gameState.enemySpeed *= 1.001;
        gameState.enemyTimeoutInit = gameState.enemyTimeoutInit * 0.999;
    }
    ctx.fillStyle = "#FF0000";
    gameState.rectPosX += gameState.rectVelocity.x;
    gameState.rectPosY += gameState.rectVelocity.y;
    if (gameState.rectPosX > canvas.width - 10) {
        gameState.rectPosX = canvas.width - 10;
        gameState.rectVelocity.x = 0;
    }
    if (gameState.rectPosX < 0) {
        gameState.rectPosX = 0;
        gameState.rectVelocity.x = 0;
    }
    if (gameState.rectPosY < 0) {
        gameState.rectPosY = 0;
        gameState.rectVelocity.y = 0;
    }
    if (gameState.rectPosY > canvas.height - 10) {
        gameState.rectPosY = canvas.height - 10;
        gameState.rectVelocity.y = 0;
    }
    ctx.fillRect(gameState.rectPosX, gameState.rectPosY, 10, 10);
    ctx.fillStyle = "#0000FF";
    for (let i = 0; i < gameState.enemies.length; ++i) {
        gameState.enemies[i].x -= gameState.enemies[i].velocity;
        ctx.fillRect(gameState.enemies[i].x, gameState.enemies[i].y, 10, 10);
    }
    for (let i = 0; i < gameState.enemies.length; ++i) {
        if (gameState.enemies[i].x < -10) {
            gameState.enemies.splice(i, 1);
            gameState.score++;
        }
    }
    document.getElementById("score").innerHTML = "score: " + gameState.score;
    if (gameState.score % 10 == 0 && gameState.score > 0 && gameState.score > gameState.scoreThreshold) {
        if (gameState.level > 14) {
            gameState.level -= 2;
            gameState.scoreThreshold = gameState.score;
            gameState.enemyTimeout = gameState.level;
            gameState.enemyTimeoutInit = gameState.level;
            console.log(gameState.enemyTimeout);
            console.log(gameState.enemyTimeoutInit);
        }
    }
    if (checkCollision(gameState) == true) {
        gameState = {
            rectPosX: 10,
            rectPosY: canvas.height / 2 - 10,
            rectVelocity: {x: 0, y: 0},
            playerSpeed: 1,
            enemyTimeout: 60,
            enemyTimeoutInit: 60,
            enemySpeed: 1,
            enemies: [],
            friends: [],
            score: 0,
            level: 60,
            scoreThreshold: 0
        };
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let game_1 = document.getElementById('game_1');
    game_1.addEventListener('click', function () {


        gameWrapper.style.width = "300px";

        removeAllChildNodes(gameWrapper);

        scoreElement = document.createElement("p");
        scoreElement.setAttribute('id', 'score');

        canvas = document.createElement("canvas");
        canvas.setAttribute('id', 'canvas-top');

        gameWrapper.appendChild(scoreElement);
        gameWrapper.appendChild(canvas);
        ctx = canvas.getContext("2d");
        gameState = {
            rectPosX: 10,
            rectPosY: canvas.height / 2 - 10,
            rectVelocity: {x: 0, y: 0},
            playerSpeed: 1,
            enemyTimeout: 60,
            enemyTimeoutInit: 60,
            enemySpeed: 1,
            enemies: [],
            friends: [],
            score: 0,
            level: 60,
            scoreThreshold: 0
        };


        if (refreshIntervalId !== 'not set' && typeof refreshIntervalId !== "undefined") {
            clearInterval(refreshIntervalId);
            refreshIntervalId = 'not set';

            document.removeEventListener("keydown", function (event) {
                if (event.keyCode == 39) {
                    gameState.rectVelocity.x = gameState.playerSpeed;
                }
                if (event.keyCode == 37) {
                    gameState.rectVelocity.x = -gameState.playerSpeed;
                }
                if (event.keyCode == 40) {
                    gameState.rectVelocity.y = gameState.playerSpeed;
                }
                if (event.keyCode == 38) {
                    gameState.rectVelocity.y = -gameState.playerSpeed;
                }
            });
        }
        refreshIntervalId = setInterval(update, 20);

        document.addEventListener("keydown", function (event) {
            if (event.keyCode == 39) {
                gameState.rectVelocity.x = gameState.playerSpeed;
            }
            if (event.keyCode == 37) {
                gameState.rectVelocity.x = -gameState.playerSpeed;
            }
            if (event.keyCode == 40) {
                gameState.rectVelocity.y = gameState.playerSpeed;
            }
            if (event.keyCode == 38) {
                gameState.rectVelocity.y = -gameState.playerSpeed;
            }
        });
    });


    let game_2 = document.getElementById('game_2');
    game_2.addEventListener('click', function () {
        removeAllChildNodes(gameWrapper);


        if (refreshIntervalId !== 'not set' && typeof refreshIntervalId !== "undefined") {
            clearInterval(refreshIntervalId);
            refreshIntervalId = 'not set';

            document.removeEventListener("keydown", function (event) {
                if (event.keyCode == 39) {
                    gameState.rectVelocity.x = gameState.playerSpeed;
                }
                if (event.keyCode == 37) {
                    gameState.rectVelocity.x = -gameState.playerSpeed;
                }
                if (event.keyCode == 40) {
                    gameState.rectVelocity.y = gameState.playerSpeed;
                }
                if (event.keyCode == 38) {
                    gameState.rectVelocity.y = -gameState.playerSpeed;
                }
            });
        }

        gameWrapper.style.width = "412px";
        canvasTetris(gameWrapper);
    });
});


var canvasTetris = function (parentNode) {
    var canvas = {
        node: null,
        context: null,
        width: 0,
        height: 0,
        blockSide: 0
    };

    canvas.drawBackground = function () {
        this.context.fillStyle = "#f8f8ff";
        this.context.strokeStyle = "#696969";
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.lineWidth = 8;
        this.context.strokeRect(0, 0, this.width, this.height);
        this.context.lineWidth = 4;
        this.context.beginPath();
        this.context.moveTo(256, 0);
        this.context.lineTo(256, this.height);
        this.context.stroke();
        this.context.closePath();
        this.context.fillStyle = "#696969";
        this.context.fillText("SCORE:", 298, 75);
        this.context.fillText(game.score.amount, 330 - game.score.halfWidth, 125);
        this.context.fillText("NEXT:", 308, 220);
        this.context.lineWidth = 2;
        this.context.strokeRect(283, 255, 102, 102);
        this.context.strokeStyle = "#f8f8ff";
    };

    canvas.drawBlock = function (yNum, xNum) {
        var xCord = xNum * (this.blockSide + 2) + 5;
        var yCord = yNum * (this.blockSide + 2) + 5;
        this.context.strokeRect(xCord, yCord, this.blockSide, this.blockSide);
        this.context.fillRect(xCord, yCord, this.blockSide, this.blockSide);
    };

    canvas.drawBlocks = function () {
        for (var i = 0; i < game.rows; i++) {
            for (var j = 0; j < game.cols; j++) {
                if (game.blocks[i][j]) {
                    this.drawBlock(i, j);
                }
            }
        }
    };

    canvas.drawNextBlock = function (yNum, xNum) {
        var xCord = xNum * (this.blockSide + 2) + 285;
        var yCord = yNum * (this.blockSide + 2) + 257;
        this.context.strokeRect(xCord, yCord, this.blockSide, this.blockSide);
        this.context.fillRect(xCord, yCord, this.blockSide, this.blockSide);
    };

    canvas.drawNextBlocks = function () {
        for (var i = 0; i < game.nextSide; i++) {
            for (var j = 0; j < game.nextSide; j++) {
                if (tetromino.next.tetromino[i][j]) {
                    this.drawNextBlock(i, j);
                }
            }
        }
    };

    canvas.drawPause = function (gameTextNum) {
        this.context.fillStyle = "#f8f8ff";
        this.context.strokeStyle = "#696969";

        this.context.fillRect(50, 110, 158, 80);
        this.context.strokeRect(50, 110, 158, 80);
        this.context.strokeRect(53, 113, 152, 74);

        this.context.fillStyle = "#696969";
        this.context.fillText(game.pauseText[gameTextNum].text, 130 - game.pauseText[gameTextNum].halfWidth, 155);

        this.context.strokeStyle = "#f8f8ff";
    };

    canvas.draw = function () {
        this.drawBackground();
        this.drawBlocks();
        this.drawNextBlocks();
    };

    var tetromino = {};

    tetromino.current = {
        tetromino: null,
        number: 0,
        direction: 0,
        x: 0,
        y: 0
    };

    tetromino.next = {
        tetromino: [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1]
        ],
        number: 0,
        direction: 0
    };

    tetromino.collection = [
        [
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        [
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 0]
            ]
        ],
        [
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        [
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ],
        [
            [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 1, 1],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 1, 1],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ],
        [
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        [
            [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 1],
                [0, 0, 0, 0]
            ]
        ]
    ];

    tetromino.chooseNext = function () {
        var tetLen = this.collection.length;
        var tetNum = Math.floor(Math.random() * tetLen);
        tetNum = (tetNum === tetLen) ? (tetLen - 1) : tetNum;
        var tetDir = Math.floor(Math.random() * 4);
        tetDir = (tetDir === 4) ? 3 : tetDir;

        this.current.tetromino = this.next.tetromino;
        this.current.number = this.next.number;
        this.current.direction = this.next.direction;
        this.current.x = game.xStart;
        this.current.y = game.yStart;

        this.next.tetromino = this.collection[tetNum][tetDir];
        this.next.number = tetNum;
        this.next.direction = tetDir;

        canvas.draw();
    };

    tetromino.move = function (xChanging, yChanging) {
        if (this.checkPaste(xChanging, yChanging)) {
            this.cutTetronimo();
            this.current.x += xChanging;
            this.current.y += yChanging;
            this.pasteTetronimo();
            canvas.draw();
            return true;
        }
        return false;
    };

    tetromino.rotate = function () {
        this.cutTetronimo();
        var oldDirection = this.current.direction;
        this.current.direction = (this.current.direction + 1) % 4;
        this.current.tetromino = this.collection[this.current.number][this.current.direction];
        if (!this.checkPaste(0, 0)) {
            this.current.direction = oldDirection;
            this.current.tetromino = this.collection[this.current.number][this.current.direction];
        }
        this.pasteTetronimo(false);
        canvas.draw();
    };

    tetromino.cutTetronimo = function () {
        for (var i = 0; i < game.nextSide; i++) {
            var yBlock = this.current.y + i;
            if (yBlock >= 0) {
                for (var j = 0; j < game.nextSide; j++) {
                    if (this.current.tetromino[i][j] !== 0) {
                        game.blocks[yBlock][this.current.x + j] = 0;
                    }
                }
            }
        }
    };

    tetromino.checkPaste = function (xChanging, yChanging) {
        for (var i = 0; i < game.nextSide; i++) {
            var yBlock = this.current.y + yChanging + i;
            var yTetBlock = yChanging + i;
            for (var j = 0; j < game.nextSide; j++) {
                if (this.current.tetromino[i][j] !== 0) {
                    var xBlock = this.current.x + xChanging + j;
                    var xTetBlock = xChanging + j;
                    if (xBlock < 0 || xBlock >= game.cols) {
                        return false;
                    }
                    if (yBlock >= game.rows) {
                        return false;
                    }
                    if (yBlock >= 0) {
                        if (game.blocks[yBlock][xBlock]) {
                            if ((xTetBlock >= 0) && (xTetBlock < game.nextSide) && (yTetBlock < game.nextSide)) {
                                if (this.current.tetromino[yTetBlock][xTetBlock] === 0) {
                                    return false;
                                } else {
                                    if (xChanging === 0 && yChanging === 0) {
                                        return false;
                                    }
                                }
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    };

    tetromino.pasteTetronimo = function () {
        for (var i = 0; i < game.nextSide; i++) {
            var yBlock = this.current.y + i;
            if (yBlock >= 0) {
                for (var j = 0; j < game.nextSide; j++) {
                    if (this.current.tetromino[i][j] !== 0) {
                        game.blocks[yBlock][this.current.x + j] = this.current.tetromino[i][j];
                    }
                }
            }
        }
    };

    var game = {
        score: {
            amount: 0,
            halfWidth: 0
        },
        speed: 0,
        timer: null,
        paused: false,
        pauseText: [{
            text: "Start!",
            halfWidth: 0
        }, {
            text: "Paused",
            halfWidth: 0
        }, {
            text: "Game over!",
            halfWidth: 0
        }],
        blocks: [],
        rows: 16,
        cols: 10,
        nextSide: 4
    };

    game.xStart = Math.floor((game.cols - game.nextSide) / 2);
    game.yStart = -game.nextSide;

    game.setGame = function () {
        parentNode.className += " tetris";

        canvas.node = document.createElement("canvas");
        canvas.node.className = "tetrisCanvas";
        canvas.node.setAttribute("tabindex", "0");
        canvas.node.innerHTML = "Your browser does not support the HTML5 canvas tag";
        parentNode.appendChild(canvas.node);
        canvas.width = 412;
        canvas.height = 408;
        canvas.node.setAttribute("width", canvas.width + "px");
        canvas.node.setAttribute("height", canvas.height + "px");
        canvas.blockSide = 23;
        canvas.context = canvas.node.getContext("2d");
        canvas.context.font = "bold 18px Arial";

        for (var i = 0; i < this.pauseText.length; i++) {
            this.pauseText[i].halfWidth = Math.round(canvas.context.measureText(this.pauseText[i].text).width / 2);
        }
        this.score.halfWidth = Math.round(canvas.context.measureText(0).width / 2);

        for (i = 0; i < this.rows; i++) {
            this.blocks[i] = [];
            for (var j = 0; j < this.cols; j++) {
                this.blocks[i][j] = 1;
            }
        }

        canvas.drawBackground();
        canvas.drawBlocks();
        canvas.drawNextBlocks();
        canvas.drawPause(0);

        canvas.node.focus();

        canvas.node.addEventListener("click", game.resetGame, false);
    };

    game.resetGame = function () {
        canvas.node.removeEventListener("click", game.resetGame, false);
        canvas.node.addEventListener("keydown", game.keyPress, false);
        canvas.node.addEventListener("focus", game.focus, false);
        canvas.node.addEventListener("blur", game.blur, false);
        game.setScore(0);

        for (var i = 0; i < game.rows; i++) {
            for (var j = 0; j < game.cols; j++) {
                game.blocks[i][j] = 0;
            }
        }

        tetromino.chooseNext();
        tetromino.chooseNext();

        game.speed = 1000;
        game.timer = setInterval(game.move, game.speed);
    };

    game.move = function () {
        if (!tetromino.move(0, 1)) {
            game.checkScore();
            game.checkGameOver();
        }
    };

    game.checkScore = function () {
        var lines = 0;
        var curLine = tetromino.current.y + game.nextSide - 1;
        if (curLine >= game.rows) curLine = game.rows - 1;

        for (var i = 0; i <= game.nextSide; i++) {
            var filled = true;
            for (var j = 0; j < game.cols; j++) {
                if (!game.blocks[curLine][j]) {
                    filled = false;
                    break;
                }
            }
            if (filled) {
                lines++;
                this.scoreLine(curLine);
            } else {
                curLine--;
                if (curLine < 0) {
                    break;
                }
            }
        }

        if (lines > 1) {
            this.addScore(100 * lines);
        }
    };

    game.scoreLine = function (line) {
        for (var i = line; i > 0; i--) {
            for (var j = 0; j < game.cols; j++) {
                game.blocks[i][j] = game.blocks[i - 1][j];
            }
        }
        this.addScore(100);
    };

    game.setScore = function (newScore) {
        this.score.amount = newScore;
        this.score.halfWidth = Math.round(canvas.context.measureText(newScore).width / 2);
        canvas.draw();
    };

    game.addScore = function (scoreToAdd) {
        var oldScore = this.score.amount;
        var newScore = oldScore + scoreToAdd;
        this.setScore(newScore);
        if (game.speed > 100 && (Math.floor(newScore / 1000) > Math.floor(oldScore / 1000))) {
            game.speed -= 10;
            clearInterval(this.timer);
            game.timer = setInterval(game.move, game.speed);
        }
    };

    game.checkGameOver = function () {
        for (var j = 0; j < game.cols; j++) {
            if (game.blocks[0][j]) {
                this.gameOver();
                return;
            }
        }
        tetromino.chooseNext();
    };

    game.gameOver = function () {
        clearInterval(this.timer);
        canvas.node.removeEventListener("keydown", game.keyPress, false);
        canvas.node.removeEventListener("focus", game.focus, false);
        canvas.node.removeEventListener("blur", game.blur, false);
        game.animateGameOver();
    };

    game.animateGameOver = function () {
        var i = game.rows - 1;
        var j = 0;
        (function () {
            if (i >= 0) {
                game.blocks[i][j] = 1;
                canvas.draw();
                canvas.drawPause(2);
                if ((j + 1) < game.cols) {
                    j++;
                } else {
                    j = 0;
                    i--;
                }
                setTimeout(arguments.callee, 20);
            } else {
                canvas.node.addEventListener("click", game.resetGame, false);
            }
        })();
    };

    game.pause = function () {
        if (game.paused) {
            canvas.draw();
            game.timer = setInterval(game.move, game.speed);
        } else {
            canvas.drawPause(1);
            clearInterval(this.timer);
        }
        game.paused = !game.paused;
    };

    game.focus = function () {
        if (game.paused) {
            canvas.node.focus();
            game.pause();
        }
    };

    game.blur = function () {
        if (!game.paused) {
            game.pause();
        }
    };

    game.keyPress = function (e) {
        e.preventDefault();

        if (!game.paused) {
            switch (e.keyCode) {
                case 37:
                    tetromino.move(-1, 0);
                    break;
                case 38:
                    tetromino.rotate();
                    break;
                case 39:
                    tetromino.move(1, 0);
                    break;
                case 40:
                    tetromino.move(0, 1);
                    break;
                case 80:
                    game.pause();
                    break;
            }
        } else {
            if (e.keyCode === 80) {
                game.pause();
            }
        }
    };

    game.setGame();
};