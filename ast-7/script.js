var $container = document.getElementById("container");

var numberOfBalls = 10;
var SPEED = 1;

var BALL_SIZE = 20;
var CONTAINER_BORDER = 10;
var CONTAINER_TOP = 0; //adding offset
var CONTAINER_BOTTOM = 600 - BALL_SIZE;
var CONTAINER_LEFT = 0;
var CONTAINER_RIGHT = 1000 - BALL_SIZE;


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
            x: getRandom(0, CONTAINER_RIGHT),
            y: getRandom(0, CONTAINER_LEFT),
            dx: getRandom(-1, 1),
            dy: getRandom(-1, 1),
            $ant: $ant
        };
        antCollection.push(ant);

        ant.$ant.className = "ants";

        ant.$ant.style.left = ant.x + "px";
        ant.$ant.style.top = ant.y + "px";
        $container.appendChild(ant.$ant);
    }

    //adding click events
    antCollection.forEach(function (ant) {
        ant.$ant.onclick = function () {
            this.style.background = "url(\'ant-squashed.png\')";
            var self = this;
            // console.log();
            var index = antCollection.indexOf(ant); // removing ant
            antCollection.splice(index, 1);
            setTimeout(function () {
                self.remove();
            }, 800);

            score += 1;
            $score.innerHTML = score;
        }
    })

}


function startInterval() {

    setInterval(function () {

        checkBoundingBoxCollision();
        antCollection.forEach(function (ant) {
            // var index = antCollection.indexOf(ant);
            checkBoundaryCollision(ant);
            ant.x = ant.x + ant.dx * SPEED;
            ant.y = ant.y + ant.dy * SPEED;
            updateDirection(ant);
        });

    }, 1);

}


function checkBoundaryCollision(ant) {
    var left = ant.x;
    var right = ant.x + BALL_SIZE;

    var top = ant.y;
    var bottom = ant.y + BALL_SIZE;


    if (top < CONTAINER_TOP) {
        ant.dy = 1;

    }
    if (left < CONTAINER_LEFT) {

        ant.dx = 1;
    }
    if (right > CONTAINER_RIGHT) {

        ant.dx = -1;
    }
    if (bottom > CONTAINER_BOTTOM) {
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


            if ((ant.x < otherAnt.x + BALL_SIZE) && (ant.x + BALL_SIZE > otherAnt.x) && (ant.y < otherAnt.y + BALL_SIZE) && (BALL_SIZE + ant.y > otherAnt.y)) {

                if (ant.x < otherAnt.x + BALL_SIZE) {
                    ant.dx = -1;
                    otherAnt.dx = 1;

                    //so that it does not overflow container at right
                    if (otherAnt.x + BALL_SIZE < CONTAINER_RIGHT - BALL_SIZE) {
                        ant.x = otherAnt.x + BALL_SIZE;
                    }

                }

                if (ant.x + BALL_SIZE > otherAnt.x) {
                    ant.dx = 1;
                    otherAnt.dx = -1;
                    otherAnt.x = ant.x - BALL_SIZE;
                }

                if (ant.y < otherAnt.y + BALL_SIZE) {
                    ant.dy = 1;
                    otherAnt.dy = -1;

                    //so that it does not overflow container at bottom
                    if (otherAnt.y + BALL_SIZE < CONTAINER_BOTTOM - BALL_SIZE) {
                        ant.y = otherAnt.y + BALL_SIZE;
                    }
                }

                if (BALL_SIZE + ant.y > otherAnt.y) {
                    ant.dy = -1;
                    otherAnt.dy = 1;

                    otherAnt.y = ant.y - BALL_SIZE;


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

