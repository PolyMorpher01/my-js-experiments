var $containerBox = document.getElementById("container");
var $movingRedBall = document.createElement("div");
$movingRedBall.className = "ball";

var $blueBall = document.createElement("div");
$blueBall.className = "ball";
$blueBall.style.backgroundColor ="blue";

$containerBox.appendChild($movingRedBall);
$containerBox.appendChild($blueBall);

var ballSize = 50;
var containerTop = 0+10; //adding offset
var containerBottom = 500-10;  //subtracting offset

var containerLeft = 0+10;
var containerRight = 500-10;

var speed = 30;

var ballRed = {
    x: getRandom(),
    y:  getRandom(),
    dx: 1,
    dy: 1,
    $elem: $movingRedBall
};
// ballRed.$elem = $movingRedBall;


var ballBlue = {
    x:  getRandom(),
    y:  getRandom(),
    dx: 1,
    dy: 1,
    $elem: $blueBall
};
updateBall(ballBlue);
updateBall(ballRed);

var interval = setInterval(function () {
    ballRed.x = ballRed.x + ballRed.dx * speed;
    ballRed.y = ballRed.y + ballRed.dy * speed;
    checkBoundaryCollision(ballRed);
    updateBall(ballRed);

    ballBlue.x = ballBlue.x + ballBlue.dx * speed;
    ballBlue.y = ballBlue.y + ballBlue.dy * speed;
    checkBoundaryCollision(ballBlue);
    updateBall(ballBlue);

    checkBoundingBoxCollision(ballBlue.x, ballRed.x, ballBlue.y, ballRed.y);

}, 100);


function updateBall(ball) {
    ball.$elem.style.top = ball.y + "px";
    ball.$elem.style.left = ball.x + "px";
}



function checkBoundaryCollision(ball) {
    var ballLeft = ball.x;
    var ballRight = ball.x + ballSize;

    var ballTop = ball.y;
    var ballBottom = ball.y + ballSize;


    if (ballTop < containerTop) {
        ball.dy = 1;

    }
    if (ballLeft < containerLeft) {

        ball.dx = 1;
    }
    if (ballRight > containerRight) {

        ball.dx = -1;
    }
    if (ballBottom > containerBottom) {
       ball.dy = -1;
    }

}


//Arrow key press event
document.onkeydown = function (event) {
    if (event.keyCode === 38) {
        // UP
        if(!(ballBlue.y<containerTop)){
            ballBlue.dy = -1;
        }

    }
    else if (event.keyCode === 40) {
        //DOWN
        if(!(ballBlue.y>containerBottom-30)) {
            ballBlue.dy = 1;
        }
    }
    else if (event.keyCode === 37) {
        //LEFT
        if(!(ballBlue.x<containerLeft)) {
            ballBlue.dx = -1;
        }

    }
    else if (event.keyCode === 39) {
        //RIGHT
        if(!(ballBlue.x>containerRight-30)) {
            ballBlue.dx = 1;
        }

    }
};


//bounding box collision
function checkBoundingBoxCollision(x1, x2, y1, y2) {
    if (x1 < x2 + ballSize && x1 + ballSize > x2&& y1 < y2+ ballSize && ballSize + y1> y2) {
  
       if (x1 < x2 + ballSize){
           ballBlue.dx = -1;
           ballRed.dx = 1;
           ballBlue.x = ballRed.x + ballSize;
       }

       if (x1 + ballSize > x2){
           ballBlue.dx = 1;
           ballRed.dx = -1;
           ballRed.x = ballBlue.x - ballSize;
       }

       if (y1 < y2+ ballSize){
           ballBlue.dy = 1;
           ballRed.dy = -1;
           ballBlue.y = ballRed.y + ballSize;
       }

       if(ballSize + y1> y2){
           ballBlue.dy = -1;
           ballRed.dy = 1;
           ballRed.y = ballBlue.y - ballSize;
       }

    }
}


//random number generator
function getRandom() {
    return Math.floor(Math.random() * Math.floor(470));
}
