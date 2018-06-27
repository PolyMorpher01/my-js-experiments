var $container = document.getElementById("container");
var $ants = document.getElementsByClassName("ants");


var numberOfAnts = 10;
var speed = 20;

var antSize = 50;
var containerBorder = 10;
var containerTop = 0 + containerBorder; //adding offset
var containerBottom = 500 - containerBorder;  //subtracting offset

var containerLeft = 0 + containerBorder;
var containerRight = 500 - containerBorder;


var antCoordinate = [];



for (let i = 0; i < numberOfAnts; i++) {
    var $ant = document.createElement("div");

    var coordinates = {
        x: getRandom(),
        y: getRandom(),
        dx: 1,
        dy: 1,
        $ant: $ant
    };
    antCoordinate.push(coordinates);

    $ant.className = "ants";

    $ant.style.left = antCoordinate[i].x + "px";
    $ant.style.top = antCoordinate[i].y + "px";
    $container.appendChild($ant);

    $ant.onclick = function () {
        this.remove();
    }
}


var interval = function () {

    setInterval(function () {
        for (var i = 0; i < $ants.length; i++) {
            checkBoundaryCollision(antCoordinate[i]);
            antCoordinate[i].x = antCoordinate[i].x + antCoordinate[i].dx * speed;
            antCoordinate[i].y = antCoordinate[i].y + antCoordinate[i].dy * speed;

            // checkBoundingBoxCollision(antCoordinate[i].x, antCoordinate[i].y);
            updateDirection(antCoordinate[i]);
        }
    }, 700);

};

interval();


function checkBoundaryCollision(ant) {
    var left = ant.x;
    var right = ant.x + antSize;

    var top = ant.y;
    var bottom = ant.y + antSize;


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
    if (x1 < x2 + antSize && x1 + antSize > x2 && y1 < y2 + antSize && antSize + y1 > y2) {

        if (x1 < x2 + antSize) {
            ballBlue.dx = -1;
            ballRed.dx = 1;
            ballBlue.x = ballRed.x + antSize;
        }

        if (x1 + antSize > x2) {
            ballBlue.dx = 1;
            ballRed.dx = -1;
            ballRed.x = ballBlue.x - antSize;
        }

        if (y1 < y2 + antSize) {
            ballBlue.dy = 1;
            ballRed.dy = -1;
            ballBlue.y = ballRed.y + antSize;
        }

        if (antSize + y1 > y2) {
            ballBlue.dy = -1;
            ballRed.dy = 1;
            ballRed.y = ballBlue.y - antSize;
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



function updateDirection(coordinate) {
    coordinate.$ant.style.top = coordinate.y + "px";
    coordinate.$ant.style.left = coordinate.x + "px";
}

function getRandom() {
    return Math.floor(Math.random() * Math.floor(450));
}
