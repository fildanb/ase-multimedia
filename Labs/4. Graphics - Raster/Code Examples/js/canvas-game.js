/*
Adapted from: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
#Assignments
1. Store and display the minimum time in which the game has been won so far. The minimum time should be persisted even if the user closes the browser or navigates to another website
Hint: 
- Use the Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
- Use var d = new Date(); to get the current time
- You can subtract two Date objects to compute the difference between them in milliseconds
2. The example has a few "physics" issues. For example, we only test if the coordinates of the ball are inside a brick, but in fact we should test if any point on the contour of the ball is touching the brick. The same issue appears when the ball hits the paddle from the side.
2. Make the canvas the same size as the browser window
3. Rewrite the code that is drawing the elements (paddle, bricks and ball) in order to ajust their size based on the size of the browser window
*/

$(document).ready(function () {

    //1. SetUp variables
    //Canvas
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    
    //Ball settings
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    //we want to add a small value to x and y after every frame has been drawn to make it appear that the ball is moving
    var dxDefault = 2;
    var dyDefault = -2;
    var dx = dxDefault;
    var dy = dyDefault;

    //Paddle settings
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    //store information on whether the left or right control button is pressed
    var rightKeyPressed = false;
    var leftKeyPressed = false;
   
    //Brick settings
    var brickColumnCount = 5;
    var brickRowCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
   
    //Game data
    var score = 0;
    var lives = 3;
    var bricks = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[r] = [];
        for (var c = 0; c < brickColumnCount; c++) {
            bricks[r][c] = { x: 0, y: 0, status: 1 };
        }
    }

    //2. Handle events
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightKeyPressed = true;
        }
        else if (e.keyCode == 37) {
            leftKeyPressed = true;
        }
    }
    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightKeyPressed = false;
        }
        else if (e.keyCode == 37) {
            leftKeyPressed = false;
        }
    }
    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    //3. Methods
    function collisionDetection() {
        for (var r = 0; r < brickRowCount; r++) {
            for (var c = 0; c < brickColumnCount; c++) {
                var b = bricks[r][c];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickColumnCount * brickRowCount) {
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        //equivalen to ctx.fillRect
    }
    function drawBricks() {
        for (var r = 0; r < brickRowCount; r++) {
            for (var c = 0; c < brickColumnCount; c++) {
                if (bricks[r][c].status == 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[r][c].x = brickX;
                    bricks[r][c].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("Score: " + score, 8, 20);
    }
    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }
    function draw() {
        //clear the canvas before each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //draw the elements
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        //detect collisions
        collisionDetection();

        //Bouncing off the left and right
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        //Bouncing off the top
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        //Bouncing off the bottom
        else if (y + dy > canvas.height - ballRadius) {
           
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = dxDefault;
                    dy = dyDefault;
                    //center the paddle
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        //move the paddle right if the right control button is pressed
        if (rightKeyPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        //move the paddle left if the left control button is pressed
        else if (leftKeyPressed && paddleX > 0) {
            paddleX -= 7;
        }

        //update the location of the ball
        x += dx;
        y += dy;

        requestAnimationFrame(draw);
    }
    draw();
});