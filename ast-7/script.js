var $container = document.getElementById("container");

var numberOfBalls = getRandom(5,15);
var speed = 20;

var ballSize = 50;
var containerBorder = 10;
var containerTop = 0 + containerBorder; //adding offset
var containerBottom = 600;
var containerLeft = 0 + containerBorder;
var containerRight = 1000;


var antCollection = [];

var $score = document.getElementById("score");
var score = 0;
$score.innerHTML = score;


addAnts();

startInterval();



//****************function definitions****************************

function addAnts() {
    for (var i = 0; i < numberOfBalls; i++) {

        var $ant = document.createElement("div");

        var ant = {
            x: getRandom(0, containerRight),
            y: getRandom(0, containerLeft),
            dx: getRandom(-1, 1),
            dy: getRandom(-1, 1),
            $ant: $ant
        };
        antCollection.push(ant);

        $ant.className = "ants";

        $ant.style.left = antCollection[i].x + "px";
        $ant.style.top = antCollection[i].y + "px";
        $container.appendChild($ant);

        $ant.onclick = function () {
            this.style.background = "url(\'ant-squashed.png\')";
            var that = this;
            setTimeout(function () {
                that.remove();
            }, 1000);

            score += 1;
            $score.innerHTML = score;
        }
    }

}

function startInterval() {

    setInterval(function () {

        checkBoundingBoxCollision();

        antCollection.forEach(function (ant, index) {
            checkBoundaryCollision(antCollection[index]);
            antCollection[index].x = antCollection[index].x + antCollection[index].dx * speed;
            antCollection[index].y = antCollection[index].y + antCollection[index].dy * speed;
            updateDirection(antCollection[index]);
        });

    }, 200);

}


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
function checkBoundingBoxCollision() {

    antCollection.forEach(function (ant) {
        // console.log("Ant",ant);
        antCollection.forEach(function (otherAnt) {

            if (ant === otherAnt) {
                return;
            }


            if ((ant.x < otherAnt.x + ballSize) && (ant.x + ballSize > otherAnt.x) && (ant.y < otherAnt.y + ballSize) && (ballSize + ant.y > otherAnt.y)) {

                if (ant.x < otherAnt.x + ballSize) {
                    ant.dx = -1;
                    otherAnt.dx = 1;

                    //so that it does not overflow container at right
                    if (otherAnt.x + ballSize < containerRight) {
                        ant.x = otherAnt.x + ballSize;
                    }

                }

                if (ant.x + ballSize > otherAnt.x) {
                    ant.dx = 1;
                    otherAnt.dx = -1;
                    otherAnt.x = ant.x - ballSize;
                }

                if (ant.y < otherAnt.y + ballSize) {
                    ant.dy = 1;
                    otherAnt.dy = -1;

                    //so that it does not overflow container at bottom
                    if (otherAnt.y + ballSize < containerBottom) {
                        ant.y = otherAnt.y + ballSize;
                    }
                }

                if (ballSize + ant.y > otherAnt.y) {
                    ant.dy = -1;
                    otherAnt.dy = 1;

                    otherAnt.y = ant.y - ballSize;

                }
            }
        })
    });


}


function updateDirection(antCollection) {
    antCollection.$ant.style.top = antCollection.y + "px";
    antCollection.$ant.style.left = antCollection.x + "px";
}

function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
}

