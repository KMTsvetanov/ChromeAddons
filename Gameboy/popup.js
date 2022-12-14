let gameWrapper = document.getElementById("game_wrapper"), scoreElement, refreshIntervalId, ctx, gameState, canvas, players;

function removeAllChildNodes(a) {
    for (; a.firstChild;) a.removeChild(a.firstChild)
}

function random(a) {
    return Math.floor(Math.random() * a)
}

class RectCollider {
    constructor(a, b, c, d) {
        this.x = a, this.y = b, this.width = c, this.height = d
    }

    isColliding(a) {
        return this.x < a.x + a.width && this.x + this.width > a.x && this.y < a.y + a.height && this.height + this.y > a.y
    }
}

function checkCollision(a) {
    let d = new RectCollider(a.rectPosX, a.rectPosY, 10, 10);
    let d2 = new RectCollider(a.rectPosX2, a.rectPosY2, 10, 10);
    let tmp = 1;
    if (players === 2) {
        tmp = 2;
    }
    for (let c = 0; c < a.enemies.length; ++c) {
        let e = new RectCollider(a.enemies[c].x, a.enemies[c].y, 10, 10);
        if (d.isColliding(e)) {
            players = 1;
            return !0;
        }
        if (tmp === 2) {
            if (d2.isColliding(e)) {
                players = 1;
                return !0;
            }
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height),
        gameState.enemyTimeout -= 1, 0 == gameState.enemyTimeout && (
        gameState.enemyTimeout = Math.floor(gameState.enemyTimeoutInit),
            gameState.enemies.push({
                x: canvas.width,
                y: random(canvas.height),
                velocity: gameState.enemySpeed
            }),
                gameState.enemySpeed *= 1.001,
                gameState.enemyTimeoutInit = .999 * gameState.enemyTimeoutInit
        ),
        ctx.fillStyle = "#FF0000",
        gameState.rectPosX += gameState.rectVelocity.x,
        gameState.rectPosY += gameState.rectVelocity.y,
    gameState.rectPosX > canvas.width - 10 && (gameState.rectPosX = canvas.width - 10, gameState.rectVelocity.x = 0),
    gameState.rectPosX < 0 && (gameState.rectPosX = 0, gameState.rectVelocity.x = 0),
    gameState.rectPosY < 0 && (gameState.rectPosY = 0, gameState.rectVelocity.y = 0),
    gameState.rectPosY > canvas.height - 10 && (gameState.rectPosY = canvas.height - 10, gameState.rectVelocity.y = 0),
        ctx.fillRect(gameState.rectPosX, gameState.rectPosY, 10, 10);

        if (players === 2) {
            ctx.fillStyle = "#059250",
                gameState.rectPosX2 += gameState.rectVelocity.x2,
                gameState.rectPosY2 += gameState.rectVelocity.y2,
            gameState.rectPosX2 > canvas.width - 10 && (gameState.rectPosX2 = canvas.width - 10, gameState.rectVelocity.x2 = 0),
            gameState.rectPosX2 < 0 && (gameState.rectPosX2 = 0, gameState.rectVelocity.x2 = 0),
            gameState.rectPosY2 < 0 && (gameState.rectPosY2 = 0, gameState.rectVelocity.y2 = 0),
            gameState.rectPosY2 > canvas.height - 10 && (gameState.rectPosY2 = canvas.height - 10, gameState.rectVelocity.y2 = 0),
                ctx.fillRect(gameState.rectPosX2, gameState.rectPosY2, 10, 10);
        }
        ctx.fillStyle = "#0000FF";

    for (let a = 0; a < gameState.enemies.length; ++a) gameState.enemies[a].x -= gameState.enemies[a].velocity, ctx.fillRect(gameState.enemies[a].x, gameState.enemies[a].y, 10, 10);
    for (let b = 0; b < gameState.enemies.length; ++b) gameState.enemies[b].x < -10 && (gameState.enemies.splice(b, 1), gameState.score++);
    document.getElementById("score").innerHTML = "score: " + gameState.score, gameState.score % 10 == 0 && gameState.score > 0 && gameState.score > gameState.scoreThreshold && gameState.level > 14 && (gameState.level -= 2, gameState.scoreThreshold = gameState.score, gameState.enemyTimeout = gameState.level, gameState.enemyTimeoutInit = gameState.level, console.log(gameState.enemyTimeout), console.log(gameState.enemyTimeoutInit)),
    !0 == checkCollision(gameState) && (gameState = {
        rectPosX: 10,
        rectPosY: canvas.height / 2 - 10,
        rectPosX2: 10,
        rectPosY2: canvas.height / 2 - 10,
        rectVelocity: {x: 0, y: 0, x2: 0, y2: 0},
        playerSpeed: 1,
        enemyTimeout: 60,
        enemyTimeoutInit: 60,
        enemySpeed: 1,
        enemies: [],
        friends: [],
        score: 0,
        level: 60,
        scoreThreshold: 0
    })
}

var $Osc = {
    hover: function(event) {
        event.target.style.backgroundColor = "orangered";
        event.target.style.cursor = "pointer";
    },
    out: function(event) {
        event.target.style.backgroundColor = "orange";
        event.target.style.cursor = "mouse";
    }

}

document.addEventListener("DOMContentLoaded", function () {
    let exposure = document.getElementById("exposure");
    document.getElementById("game_1").addEventListener("click", function () {
        removeAllChildNodes(exposure);

        let exposure2 = document.createElement("div");
        let btn = document.createElement("button");
        let tag = document.createElement("p")
        let text = document.createTextNode("WASD and arrow keys");
        tag.appendChild(text);
        btn.innerHTML = "Player 2";
        btn.style.margin = "20px 10px 10px 10px";
        btn.style.backgroundColor = "orange";
        players = 1;
        btn.addEventListener("click", function () {
            players = 2;
        });
        btn.addEventListener("mouseover", $Osc.hover, false);
        btn.addEventListener("mouseout", $Osc.out, false);

        exposure.appendChild(btn);
        exposure.appendChild(tag);


        exposure.style.border = "1px solid white";
        exposure.style.backgroundImage="";
        exposure.style.width = '196px';
        exposure.style.height = '188px';
        exposure.style.float = 'left';
        exposure.style.marginLeft = "0px";
        exposure.style.backgroundSize = 'cover';

        exposure2.style.border = "1px solid white";
        exposure2.style.backgroundImage="url(images/coming_soon.png)";
        exposure2.style.width = '196px';
        exposure2.style.height = '96px';
        exposure2.style.float = 'left';
        exposure2.style.marginLeft = "0px";
        exposure2.style.backgroundSize = 'contain';
        exposure.appendChild(exposure2);

        gameWrapper.style.backgroundImage="";
        gameWrapper.style.backgroundSize = '';
        gameWrapper.style.width = "300px", gameWrapper.style.height = "200px", removeAllChildNodes(gameWrapper), (scoreElement = document.createElement("p")).setAttribute("id", "score"), (canvas = document.createElement("canvas")).setAttribute("id", "canvas-top"), canvas.style.marginBottom = "8px", gameWrapper.appendChild(scoreElement), gameWrapper.appendChild(canvas),
            ctx = canvas.getContext("2d"),
            gameState = {
            rectPosX: 10,
            rectPosY: canvas.height / 2 - 10,
            rectPosX2: 10,
            rectPosY2: canvas.height / 2 - 10,
            rectVelocity: {x: 0, y: 0, x2: 0, y2: 0},
            playerSpeed: 1,
            enemyTimeout: 60,
            enemyTimeoutInit: 60,
            enemySpeed: 1,
            enemies: [],
            friends: [],
            score: 0,
            level: 60,
            scoreThreshold: 0
        }, "not set" !== refreshIntervalId && void 0 !== refreshIntervalId && (clearInterval(refreshIntervalId), refreshIntervalId = "not set", document.removeEventListener("keydown", function (a) {
            39 == a.keyCode && (gameState.rectVelocity.x = gameState.playerSpeed),      // >
            37 == a.keyCode && (gameState.rectVelocity.x = -gameState.playerSpeed),     // <
            40 == a.keyCode && (gameState.rectVelocity.y = gameState.playerSpeed),      // v
            38 == a.keyCode && (gameState.rectVelocity.y = -gameState.playerSpeed)     // ^

            68 == a.keyCode && (gameState.rectVelocity.x2 = gameState.playerSpeed),      // d
            65 == a.keyCode && (gameState.rectVelocity.x2 = -gameState.playerSpeed),     // s
            83 == a.keyCode && (gameState.rectVelocity.y2 = gameState.playerSpeed),      // a
            87 == a.keyCode && (gameState.rectVelocity.y2 = -gameState.playerSpeed)      // w
        })), refreshIntervalId = setInterval(update, 20), document.addEventListener("keydown", function (a) {
            39 == a.keyCode && (gameState.rectVelocity.x = gameState.playerSpeed),      // >
            37 == a.keyCode && (gameState.rectVelocity.x = -gameState.playerSpeed),     // <
            40 == a.keyCode && (gameState.rectVelocity.y = gameState.playerSpeed),      // v
            38 == a.keyCode && (gameState.rectVelocity.y = -gameState.playerSpeed)     // ^

            68 == a.keyCode && (gameState.rectVelocity.x2 = gameState.playerSpeed),      // d
            65 == a.keyCode && (gameState.rectVelocity.x2 = -gameState.playerSpeed),     // s
            83 == a.keyCode && (gameState.rectVelocity.y2 = gameState.playerSpeed),      // a
            87 == a.keyCode && (gameState.rectVelocity.y2 = -gameState.playerSpeed)      // w
        })
    }), document.getElementById("game_2").addEventListener("click", function () {

        removeAllChildNodes(exposure);

        exposure.style.border = "1px solid white";
        exposure.style.backgroundImage="url(images/coming_soon.png)";
        exposure.style.width = '74px';
        exposure.style.height = '406px';
        exposure.style.float = 'left';
        exposure.style.marginLeft = "10px";
        exposure.style.backgroundSize = 'contain';

        gameWrapper.style.width = "412px";
        gameWrapper.style.height = "416px";
        gameWrapper.style.backgroundImage="";
        gameWrapper.style.backgroundSize = '';

        removeAllChildNodes(gameWrapper), "not set" !== refreshIntervalId && void 0 !== refreshIntervalId && (clearInterval(refreshIntervalId), refreshIntervalId = "not set", document.removeEventListener("keydown", function (a) {
            39 == a.keyCode && (gameState.rectVelocity.x = gameState.playerSpeed), 37 == a.keyCode && (gameState.rectVelocity.x = -gameState.playerSpeed), 40 == a.keyCode && (gameState.rectVelocity.y = gameState.playerSpeed), 38 == a.keyCode && (gameState.rectVelocity.y = -gameState.playerSpeed)
        })), gameWrapper.style.width = "412px", gameTwo(gameWrapper)
    }), document.getElementById("game_3").addEventListener("click", function () {

        removeAllChildNodes(exposure);

        exposure.style.border = "1px solid white";
        exposure.style.backgroundImage="url(images/coming_soon.png)";
        exposure.style.width = '74px';
        exposure.style.height = '406px';
        exposure.style.float = 'left';
        exposure.style.marginLeft = "10px";
        exposure.style.backgroundSize = 'contain';

        removeAllChildNodes(gameWrapper), "not set" !== refreshIntervalId && void 0 !== refreshIntervalId && (clearInterval(refreshIntervalId), refreshIntervalId = "not set", document.removeEventListener("keydown", function (a) {
            39 == a.keyCode && (gameState.rectVelocity.x = gameState.playerSpeed), 37 == a.keyCode && (gameState.rectVelocity.x = -gameState.playerSpeed), 40 == a.keyCode && (gameState.rectVelocity.y = gameState.playerSpeed), 38 == a.keyCode && (gameState.rectVelocity.y = -gameState.playerSpeed)
        })),
            gameWrapper.style.width = "412px",
            gameWrapper.style.height = "416px",
            gameWrapper.style.backgroundImage="url(images/coming_soon.png)";
        gameWrapper.style.backgroundSize = 'cover';

        gameThree(gameWrapper)
    }), document.getElementById("game_4").addEventListener("click", function () {

        removeAllChildNodes(exposure);

        exposure.style.border = "1px solid white";
        exposure.style.backgroundImage="url(images/coming_soon.png)";
        exposure.style.width = '74px';
        exposure.style.height = '406px';
        exposure.style.float = 'left';
        exposure.style.marginLeft = "10px";
        exposure.style.backgroundSize = 'contain';

        removeAllChildNodes(gameWrapper), "not set" !== refreshIntervalId && void 0 !== refreshIntervalId && (clearInterval(refreshIntervalId), refreshIntervalId = "not set", document.removeEventListener("keydown", function (a) {
            39 == a.keyCode && (gameState.rectVelocity.x = gameState.playerSpeed), 37 == a.keyCode && (gameState.rectVelocity.x = -gameState.playerSpeed), 40 == a.keyCode && (gameState.rectVelocity.y = gameState.playerSpeed), 38 == a.keyCode && (gameState.rectVelocity.y = -gameState.playerSpeed)
        })),
            gameWrapper.style.width = "412px",
            gameWrapper.style.height = "416px",
            gameWrapper.style.backgroundImage="url(images/coming_soon.png)";
        gameWrapper.style.backgroundSize = 'cover';

        gameFour(gameWrapper)
    })
});

var gameFour = function (d) {

}

var gameThree = function (d) {

}

var gameTwo = function (d) {
    var c = {node: null, context: null, width: 0, height: 0, blockSide: 0};
    c.drawBackground = function () {
        this.context.fillStyle = "#f8f8ff", this.context.strokeStyle = "#696969", this.context.fillRect(0, 0, this.width, this.height), this.context.lineWidth = 8, this.context.strokeRect(0, 0, this.width, this.height), this.context.lineWidth = 4, this.context.beginPath(), this.context.moveTo(256, 0), this.context.lineTo(256, this.height), this.context.stroke(), this.context.closePath(), this.context.fillStyle = "#696969", this.context.fillText("SCORE:", 298, 75), this.context.fillText(a.score.amount, 330 - a.score.halfWidth, 125), this.context.fillText("NEXT:", 308, 220), this.context.lineWidth = 2, this.context.strokeRect(283, 255, 102, 102), this.context.strokeStyle = "#f8f8ff"
    }, c.drawBlock = function (c, d) {
        var a = d * (this.blockSide + 2) + 5, b = c * (this.blockSide + 2) + 5;
        this.context.strokeRect(a, b, this.blockSide, this.blockSide), this.context.fillRect(a, b, this.blockSide, this.blockSide)
    }, c.drawBlocks = function () {
        for (var b = 0; b < a.rows; b++) for (var c = 0; c < a.cols; c++) a.blocks[b][c] && this.drawBlock(b, c)
    }, c.drawNextBlock = function (c, d) {
        var a = d * (this.blockSide + 2) + 285, b = c * (this.blockSide + 2) + 257;
        this.context.strokeRect(a, b, this.blockSide, this.blockSide), this.context.fillRect(a, b, this.blockSide, this.blockSide)
    }, c.drawNextBlocks = function () {
        for (var c = 0; c < a.nextSide; c++) for (var d = 0; d < a.nextSide; d++) b.next.tetromino[c][d] && this.drawNextBlock(c, d)
    }, c.drawPause = function (b) {
        this.context.fillStyle = "#f8f8ff", this.context.strokeStyle = "#696969", this.context.fillRect(50, 110, 158, 80), this.context.strokeRect(50, 110, 158, 80), this.context.strokeRect(53, 113, 152, 74), this.context.fillStyle = "#696969", this.context.fillText(a.pauseText[b].text, 130 - a.pauseText[b].halfWidth, 155), this.context.strokeStyle = "#f8f8ff"
    }, c.draw = function () {
        this.drawBackground(), this.drawBlocks(), this.drawNextBlocks()
    };
    var b = {};
    b.current = {
        tetromino: null,
        number: 0,
        direction: 0,
        x: 0,
        y: 0
    }, b.next = {
        tetromino: [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]],
        number: 0,
        direction: 0
    }, b.collection = [[[[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]], [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]], [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]], [[[0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 1, 1], [0, 0, 0, 0]], [[0, 1, 1, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 1], [0, 0, 0, 1], [0, 0, 0, 0]]], [[[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0]], [[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [0, 0, 0, 0]]], [[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]], [[[0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 0, 1, 1], [0, 1, 1, 0], [0, 0, 0, 0]], [[0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 0, 1, 1], [0, 1, 1, 0], [0, 0, 0, 0]]], [[[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0]], [[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0]]], [[[0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 0, 0]], [[0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]], [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 0, 0]]]], b.chooseNext = function () {
        var e = this.collection.length, b = Math.floor(Math.random() * e);
        b = b === e ? e - 1 : b;
        var d = Math.floor(4 * Math.random());
        d = 4 === d ? 3 : d, this.current.tetromino = this.next.tetromino, this.current.number = this.next.number, this.current.direction = this.next.direction, this.current.x = a.xStart, this.current.y = a.yStart, this.next.tetromino = this.collection[b][d], this.next.number = b, this.next.direction = d, c.draw()
    }, b.move = function (a, b) {
        return !!this.checkPaste(a, b) && (this.cutTetronimo(), this.current.x += a, this.current.y += b, this.pasteTetronimo(), c.draw(), !0)
    }, b.rotate = function () {
        this.cutTetronimo();
        var a = this.current.direction;
        this.current.direction = (this.current.direction + 1) % 4, this.current.tetromino = this.collection[this.current.number][this.current.direction], this.checkPaste(0, 0) || (this.current.direction = a, this.current.tetromino = this.collection[this.current.number][this.current.direction]), this.pasteTetronimo(!1), c.draw()
    }, b.cutTetronimo = function () {
        for (var b = 0; b < a.nextSide; b++) {
            var d = this.current.y + b;
            if (d >= 0) for (var c = 0; c < a.nextSide; c++) 0 !== this.current.tetromino[b][c] && (a.blocks[d][this.current.x + c] = 0)
        }
    }, b.checkPaste = function (d, e) {
        for (var b = 0; b < a.nextSide; b++) for (var f = this.current.y + e + b, i = e + b, c = 0; c < a.nextSide; c++) if (0 !== this.current.tetromino[b][c]) {
            var g = this.current.x + d + c, h = d + c;
            if (g < 0 || g >= a.cols || f >= a.rows || f >= 0 && a.blocks[f][g] && (!(h >= 0) || !(h < a.nextSide) || !(i < a.nextSide) || 0 === this.current.tetromino[i][h] || 0 === d && 0 === e)) return !1
        }
        return !0
    }, b.pasteTetronimo = function () {
        for (var b = 0; b < a.nextSide; b++) {
            var d = this.current.y + b;
            if (d >= 0) for (var c = 0; c < a.nextSide; c++) 0 !== this.current.tetromino[b][c] && (a.blocks[d][this.current.x + c] = this.current.tetromino[b][c])
        }
    };
    var a = {
        score: {amount: 0, halfWidth: 0},
        speed: 0,
        timer: null,
        paused: !1,
        pauseText: [{text: "Start!", halfWidth: 0}, {text: "Paused", halfWidth: 0}, {text: "Game over!", halfWidth: 0}],
        blocks: [],
        rows: 16,
        cols: 10,
        nextSide: 4
    };
    a.xStart = Math.floor((a.cols - a.nextSide) / 2), a.yStart = -a.nextSide, a.setGame = function () {
        d.className += " tetris", c.node = document.createElement("canvas"), c.node.className = "tetrisCanvas", c.node.setAttribute("tabindex", "0"), c.node.innerHTML = "Your browser does not support the HTML5 canvas tag", d.appendChild(c.node), c.width = 412, c.height = 408, c.node.setAttribute("width", c.width + "px"), c.node.setAttribute("height", c.height + "px"), c.blockSide = 23, c.context = c.node.getContext("2d"), c.context.font = "bold 18px Arial";
        for (var b = 0; b < this.pauseText.length; b++) this.pauseText[b].halfWidth = Math.round(c.context.measureText(this.pauseText[b].text).width / 2);
        for (b = 0, this.score.halfWidth = Math.round(c.context.measureText(0).width / 2); b < this.rows; b++) {
            this.blocks[b] = [];
            for (var e = 0; e < this.cols; e++) this.blocks[b][e] = 1
        }
        c.drawBackground(), c.drawBlocks(), c.drawNextBlocks(), c.drawPause(0), c.node.focus(), c.node.addEventListener("click", a.resetGame, !1)
    }, a.resetGame = function () {
        c.node.removeEventListener("click", a.resetGame, !1), c.node.addEventListener("keydown", a.keyPress, !1), c.node.addEventListener("focus", a.focus, !1), c.node.addEventListener("blur", a.blur, !1), a.setScore(0);
        for (var d = 0; d < a.rows; d++) for (var e = 0; e < a.cols; e++) a.blocks[d][e] = 0;
        b.chooseNext(), b.chooseNext(), a.speed = 1e3, a.timer = setInterval(a.move, a.speed)
    }, a.move = function () {
        b.move(0, 1) || (a.checkScore(), a.checkGameOver())
    }, a.checkScore = function () {
        var d = 0, c = b.current.y + a.nextSide - 1;
        c >= a.rows && (c = a.rows - 1);
        for (var f = 0; f <= a.nextSide; f++) {
            for (var g = !0, e = 0; e < a.cols; e++) if (!a.blocks[c][e]) {
                g = !1;
                break
            }
            if (g) d++, this.scoreLine(c); else if (--c < 0) break
        }
        d > 1 && this.addScore(100 * d)
    }, a.scoreLine = function (d) {
        for (var b = d; b > 0; b--) for (var c = 0; c < a.cols; c++) a.blocks[b][c] = a.blocks[b - 1][c];
        this.addScore(100)
    }, a.setScore = function (a) {
        this.score.amount = a, this.score.halfWidth = Math.round(c.context.measureText(a).width / 2), c.draw()
    }, a.addScore = function (d) {
        var b = this.score.amount, c = b + d;
        this.setScore(c), a.speed > 100 && Math.floor(c / 1e3) > Math.floor(b / 1e3) && (a.speed -= 10, clearInterval(this.timer), a.timer = setInterval(a.move, a.speed))
    }, a.checkGameOver = function () {
        for (var c = 0; c < a.cols; c++) if (a.blocks[0][c]) {
            this.gameOver();
            return
        }
        b.chooseNext()
    }, a.gameOver = function () {
        clearInterval(this.timer), c.node.removeEventListener("keydown", a.keyPress, !1), c.node.removeEventListener("focus", a.focus, !1), c.node.removeEventListener("blur", a.blur, !1), a.animateGameOver()
    }, a.animateGameOver = function () {
        var d = a.rows - 1, b = 0;
        d >= 0 ? (a.blocks[d][b] = 1, c.draw(), c.drawPause(2), b + 1 < a.cols ? b++ : (b = 0, d--), setTimeout(arguments.callee, 20)) : c.node.addEventListener("click", a.resetGame, !1)
    }, a.pause = function () {
        a.paused ? (c.draw(), a.timer = setInterval(a.move, a.speed)) : (c.drawPause(1), clearInterval(this.timer)), a.paused = !a.paused
    }, a.focus = function () {
        a.paused && (c.node.focus(), a.pause())
    }, a.blur = function () {
        a.paused || a.pause()
    }, a.keyPress = function (c) {
        if (c.preventDefault(), a.paused) 80 === c.keyCode && a.pause(); else switch (c.keyCode) {
            case 37:
                b.move(-1, 0);
                break;
            case 38:
                b.rotate();
                break;
            case 39:
                b.move(1, 0);
                break;
            case 40:
                b.move(0, 1);
                break;
            case 80:
                a.pause()
        }
    }, a.setGame()
}