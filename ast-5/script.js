var $containerBox = document.getElementById("container");


var $movingBall = document.createElement("div");
$movingBall.className = "ball";
$containerBox.appendChild($movingBall);

var speed = 20;

var ball = {
    x: 100,
    y: 80,
    dx: 1,
    dy: 1,
    // $elem: $movingRedBall
};
ball.$elem = $movingBall;


updateBall(ball);

setInterval(function () {
    ball.x = ball.x + ball.dx * speed;
    ball.y = ball.y + ball.dy * speed;
    checkBoundaryCollison(ball);
    updateBall(ball);
}, 100);

function updateBall(ball) {
    ball.$elem.style.top = ball.y + "px";
    ball.$elem.style.left = ball.x + "px";
}

function checkBoundaryCollison(ball) {
    var ballLeft = ball.x;
    var ballRight = ball.x + 30;

    var ballTop = ball.y;
    var ballBottom = ball.y + 30;

    var containerTop = 0;
    var containerBottom = 500;

    var containerLeft = 0;
    var containerRight = 500;

    if (ballTop <= containerTop) {
        ball.dy = 1;

    }
    if (ballLeft <= containerLeft) {

        ball.dx = 1;
    }
    if (ballRight >= containerRight) {

        ball.dx = -1;
    }
    if (ballBottom >= containerBottom) {
       ball.dy = -1;
    }

}