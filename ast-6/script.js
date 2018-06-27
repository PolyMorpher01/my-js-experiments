var $containerBox = document.getElementById("container");
var $movingRedBall = document.createElement("div");
$movingRedBall.className = "ant";

var $blueBall = document.createElement("div");
$blueBall.className = "ant";
$blueBall.style.backgroundColor ="blue";

$containerBox.appendChild($movingRedBall);
$containerBox.appendChild($blueBall);

var ballSize = 50;
var containerBorder =10;
var containerTop = 0+ containerBorder ; //adding offset
var containerBottom = 500 - containerBorder;  //subtracting offset

var containerLeft = 0 + containerBorder ;
var containerRight = 500 - containerBorder;

var speed = 20;

var otherAnt = {
    x: getRandom(),
    y:  getRandom(),
    dx: 1,
    dy: 1,
    $elem: $movingRedBall
};
// otherAnt.$elem = $movingRedBall;


var ant = {
    x:  getRandom(),
    y:  getRandom(),
    dx: 1,
    dy: 1,
    $elem: $blueBall
};
updateBall(ant);
updateBall(otherAnt);

var interval = setInterval(function () {

    checkBoundaryCollision(otherAnt);
    checkBoundaryCollision(ant);

    otherAnt.x = otherAnt.x + otherAnt.dx * speed;
    otherAnt.y = otherAnt.y + otherAnt.dy * speed;

    ant.x = ant.x + ant.dx * speed;
    ant.y = ant.y + ant.dy * speed;
    updateBall(otherAnt);
    updateBall(ant);

    checkBoundingBoxCollision(ant.x, otherAnt.x, ant.y, otherAnt.y);

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
        if(!(ant.y<containerTop)){
            ant.dy = -1;
        }

    }
    else if (event.keyCode === 40) {
        //DOWN
        if(!(ant.y>containerBottom-30)) {
            ant.dy = 1;
        }
    }
    else if (event.keyCode === 37) {
        //LEFT
        if(!(ant.x<containerLeft)) {
            ant.dx = -1;
        }

    }
    else if (event.keyCode === 39) {
        //RIGHT
        if(!(ant.x>containerRight-30)) {
            ant.dx = 1;
        }

    }
};


//bounding box collision
function checkBoundingBoxCollision(x1, x2, y1, y2) {
    if (x1 < x2 + ballSize && x1 + ballSize > x2&& y1 < y2+ ballSize && ballSize + y1> y2) {
  
       if (x1 < x2 + ballSize){
           ant.dx = -1;
           otherAnt.dx = 1;
           ant.x = otherAnt.x + ballSize;
       }

       if (x1 + ballSize > x2){
           ant.dx = 1;
           otherAnt.dx = -1;
           otherAnt.x = ant.x - ballSize;
       }

       if (y1 < y2+ ballSize){
           ant.dy = 1;
           otherAnt.dy = -1;
           ant.y = otherAnt.y + ballSize;
       }

       if(ballSize + y1> y2){
           ant.dy = -1;
           otherAnt.dy = 1;
           otherAnt.y = ant.y - ballSize;
       }

    }
}


//random number generator
function getRandom() {
    return Math.floor(Math.random() * Math.floor(470));
}
