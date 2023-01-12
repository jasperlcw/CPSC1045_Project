let gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");
const WIDTH = 900;
const HEIGHT = 500;
const BOX_HEIGHT = 70;
const BOX_WIDTH = 50;
const RIGHT_END = WIDTH / 2 - BOX_WIDTH;
const LEFT_END = -WIDTH / 2;
const WIDTH_MID = WIDTH / 2;
let p1, p2;
let movementInterval;
let gameOverInterval;
let winnerMessage;
let isReset = false;
let sunPicture;
let backgroundSong;
let firstAudioPlay = false;
let audioMute = false;

function setUp() {
    p1 = new PlayerEntity(LEFT_END, 0, "red");
    p2 = new PlayerEntity(RIGHT_END, 0, "blue");
    winnerMessage = new GameOverBanner("Hello World!!!!!", "OrangeRed");
    if (!isReset) {
        sunPicture = new Image();
        sunPicture.src = "teletubby_baby_sun.png";
        backgroundSong = new Audio("Teletubbies Theme Song - (Instrumental) - (HD).mp3");
        backgroundSong.loop = true;
        addEventListener("keydown", startMove);
        addEventListener("keyup", endMove);
        ctx.translate(WIDTH_MID, HEIGHT);
        ctx.scale(1, -1);
    }
    movementInterval = setInterval(movement, 7);

    animate();
}

function startMove() {
    if (!firstAudioPlay) {
        backgroundSong.play();
    }

    if (event.keyCode == 87) { //w key
        p1.canJump -= 1;
    } else if (event.keyCode == 65) { //a key
        p1.moveLeft = true;
    } else if (event.keyCode == 68) { //d key
        p1.moveRight = true;
    }

    if (event.keyCode == 38) { //up arrow key
        p2.canJump -= 1;
    } else if (event.keyCode == 37) { //left arrow key
        p2.moveLeft = true;
    } else if (event.keyCode == 39) { // right arrow key
        p2.moveRight = true;
    }
}

function endMove() {
    if (event.keyCode == 87) {
        p1.canJump = 1;
    } else if (event.keyCode == 65) {
        p1.moveLeft = false;
    } else if (event.keyCode == 68) {
        p1.moveRight = false;
    }

    if (event.keyCode == 38) {
        p2.canJump = 1;
    } else if (event.keyCode == 37) {
        p2.moveLeft = false;
    } else if (event.keyCode == 39) {
        p2.moveRight = false;
    }
}

function movement() {
    if (p1.canJump == 0  && p1.yPosition == 0) {
        p1.canJump -= 1;
        p1.jumpCounter = 35;
        let jumpSound = new Audio("Mario Jump.wav");
        jumpSound.volume = 0.25;
        jumpSound.play();
    }

    if (p1.moveRight && p1.xPosition < RIGHT_END && !collisionChecker(p1.xPosition + 4, p1.yPosition, p2.xPosition, p2.yPosition)) {
        p1.xPosition += 5;
    }

    if (p1.moveLeft && p1.xPosition > LEFT_END && !collisionChecker(p1.xPosition - 4, p1.yPosition, p2.xPosition, p2.yPosition)) {
        p1.xPosition -= 5;
    }

    if (p2.canJump == 0 && p2.yPosition == 0) {
        p2.canJump -= 1;
        p2.jumpCounter = 35;
        let jumpSound = new Audio("Mario Jump.wav");
        jumpSound.volume = 0.25;
        jumpSound.play();
    }

    if (p2.moveRight && p2.xPosition < RIGHT_END && !collisionChecker(p2.xPosition + 4, p2.yPosition, p1.xPosition, p1.yPosition)) {
        p2.xPosition += 5;
    }

    if (p2.moveLeft && p2.xPosition > LEFT_END && !collisionChecker(p2.xPosition - 4, p2.yPosition, p1.xPosition, p1.yPosition)) {
        p2.xPosition -= 5;
    }

    if (p1.jumpCounter > 0) {
        p1.yPosition += 10;
        p1.jumpCounter--;
    } else if (p1.yPosition > 0) {
        p1.yPosition -= 10;
    }

    if (p2.jumpCounter > 0) {
        p2.yPosition += 10;
        p2.jumpCounter--;
    } else if (p2.yPosition > 0) {
        p2.yPosition -= 10;
    }


    
    if ((p1.yPosition == p2.yPosition + BOX_HEIGHT && p1.jumpCounter == 0 && collisionChecker(p1.xPosition, p1.yPosition, p2.xPosition, p2.yPosition))) {
        winnerMessage.displayString = "Player 1 is the Winner!!!!!";
        gameOver();
    } else if ((p2.yPosition == p1.yPosition + BOX_HEIGHT && p2.jumpCounter == 0 && collisionChecker(p2.xPosition, p2.yPosition, p1.xPosition, p1.yPosition))) {
        winnerMessage.displayString = "Player 2 is the Winner!!!!!";
        gameOver();
    }

    animate();
}

function collisionChecker(x1,y1,x2,y2) {
    return (((x1 >= x2 && x1 <= x2 + BOX_WIDTH) || (x1 + BOX_WIDTH >= x2 && x1 + BOX_WIDTH <= x2 + BOX_WIDTH)) && ((y1 >= y2 && y1 <= y2 + BOX_HEIGHT) || (y1 + BOX_HEIGHT >= p2 && y1 + BOX_HEIGHT <= y2 + BOX_HEIGHT)));
}

function gameOver() {
    clearInterval(movementInterval);
    gameOverInterval = setInterval(gameOverAnimate, 20);
}

function gameOverAnimate() {
    animate();
    winnerMessage.draw();
    winnerMessage.x += 1;

    if (winnerMessage.x > RIGHT_END + 100) {
        winnerMessage.x = LEFT_END - 400;
    }
}

function mute() {
    audioMute = audioMute ? false : true;
    backgroundSong.muted = audioMute;
}

function animate() {
    ctx.fillStyle = "rgb(0,255,255)";
    ctx.fillRect(-WIDTH / 2, 0, WIDTH, HEIGHT);
    ctx.save();
    ctx.scale(1, -1);
    ctx.drawImage(sunPicture, 245, -HEIGHT + 3, 200, 200);
    ctx.restore();

    p2.draw();
    p1.draw();
}

function reset() {
    clearInterval(movementInterval);
    clearInterval(gameOverInterval);
    isReset = true;
    setUp();
}

function PlayerEntity(x, y, color) {
    this.xPosition = x;
    this.yPosition = y;
    this.canJump = 1;
    this.jumpCounter = 0;
    this.moveRight = false;
    this.moveLeft = false;
    this.color = color;

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPosition, this.yPosition, BOX_WIDTH, BOX_HEIGHT);
        ctx.strokeRect(this.xPosition, this.yPosition, BOX_WIDTH, BOX_HEIGHT);

        //square is drawn from bottom left corner
        //ctx.beginPath();
        //ctx.fillStyle = "yellow"
        //ctx.arc(this.xPosition, this.yPosition + BOX_HEIGHT, 10, 0, 2 * Math.PI);
        //ctx.fill();
    }
}

function GameOverBanner(msg, color) {
    this.x = LEFT_END - 400;
    this.y = -HEIGHT + 75;
    this.displayString = msg;
    this.color = color;
    this.draw = function () {
        ctx.save();
        ctx.scale(1, -1);
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = this.color;
        ctx.fillText(this.displayString, this.x, this.y);
        ctx.restore();
    }
}