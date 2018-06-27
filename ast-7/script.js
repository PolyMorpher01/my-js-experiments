var $container = document.getElementById("container");

var numberOfBalls = 10;
var speed = 20;

var ballSize = 50;
var containerBorder = 10;
var containerTop = 0 + containerBorder; //adding offset
var containerBottom = 500 - containerBorder;  //subtracting offset

var containerLeft = 0 + containerBorder;
var containerRight = 500 - containerBorder;


var antCollection = [];



for (let i = 0; i < numberOfBalls; i++) {
    var $ant = document.createElement("div");

    var ant = {
        x: getRandom(),
        y: getRandom(),
        dx: 1,
        dy: 1,
        $ant: $ant
    };
    antCollection.push(ant);

    $ant.className = "ants";

    $ant.style.left = antCollection[i].x + "px";
    $ant.style.top = antCollection[i].y + "px";
    $container.appendChild($ant);

    $ant.onclick = function () {
        this.remove();
    }
}


var interval = function () {

    setInterval(function () {
        for (var i = 0; i < antCollection.length; i++) {
            checkBoundaryCollision(antCollection[i]);
            antCollection[i].x = antCollection[i].x + antCollection[i].dx * speed;
            antCollection[i].y = antCollection[i].y + antCollection[i].dy * speed;

            // checkBoundingBoxCollision(antCollection[i].x, antCollection[i].y);
            updateDirection(antCollection[i]);
        }
    }, 700);

};

interval();


function checkBoundaryCollision(ant) {
    var left = ant.x;
    var right = ant.x + ballSize;

    var top = ant.y;
    var bottom = ant.y + ballSize;


    if (top < containerTop) {
        ant.dy = 1;

    }
    if (left < containerLeft) {

        ant.dx = 1;
    }
    if (right > containerRight) {

        ant.dx = -1;
    }
    if (bottom > containerBottom) {
        ant.dy = -1;
    }

}

//bounding box collision
function checkBoundingBoxCollision(x, y) {
    if (x1 < x2 + ballSize && x1 + ballSize > x2 && y1 < y2 + ballSize && ballSize + y1 > y2) {

        if (x1 < x2 + ballSize) {
            ballBlue.dx = -1;
            ballRed.dx = 1;
            ballBlue.x = ballRed.x + ballSize;
        }

        if (x1 + ballSize > x2) {
            ballBlue.dx = 1;
            ballRed.dx = -1;
            ballRed.x = ballBlue.x - ballSize;
        }

        if (y1 < y2 + ballSize) {
            ballBlue.dy = 1;
            ballRed.dy = -1;
            ballBlue.y = ballRed.y + ballSize;
        }

        if (ballSize + y1 > y2) {
            ballBlue.dy = -1;
            ballRed.dy = 1;
            ballRed.y = ballBlue.y - ballSize;
        }

    }

    allAnts.forEach(function(other) {

        if (ant.x < other.x + 55 && ant.x + 55 > other.x && ant.y < other.y + 30 && 30 + ant.y > other.y) {
            console.log("collided");

            // if()

            if (ant.x < other.x+55 || ant.x+55 > other.x) {
                ant.dx = -ant.dx;
                other.dx = -other.dx

            }

            if (ant.y < other.y+30 || ant.y+30 >other.y) {
                ant.dy = -ant.dy;
                other.dy = -other.dy

            }

            // if (ant.x+55 > other.x) {
            //   other.dx = -other.dx
            // }
            // else if (ant.y+30 >other.y) {
            //   other.dy = -other.dy
            // }
            // ant.updatePosition();

        }
    });
}



function updateDirection(antCollection) {
    antCollection.$ant.style.top = antCollection.y + "px";
    antCollection.$ant.style.left = antCollection.x + "px";
}

function getRandom() {
    return Math.floor(Math.random() * Math.floor(450));
}
