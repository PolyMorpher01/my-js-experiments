var $container = document.getElementById("container");

var numberOfBalls = 8;
var speed = 20;

var ballSize = 50;
var containerBorder = 10;
var containerTop = 0 + containerBorder; //adding offset
var containerBottom = 500;

var containerLeft = 0 + containerBorder;
var containerRight = 500;


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
        checkBoundingBoxCollision();
        for (var i = 0; i < antCollection.length; i++) {
            checkBoundaryCollision(antCollection[i]);
            antCollection[i].x = antCollection[i].x + antCollection[i].dx * speed;
            antCollection[i].y = antCollection[i].y + antCollection[i].dy * speed;
            updateDirection(antCollection[i]);
        }
    }, 200);

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
function checkBoundingBoxCollision() {

    antCollection.forEach(function (ant, index) {
        // console.log("Ant",ant);
        antCollection.forEach(function (otherAnt, index) {

            // console.log("ant1x", ant.x);
            // console.log("ant2x", otherAnt.x);

            // console.log("Other Ant",otherAnt);
            if (ant[index] === otherAnt[index]) {
                return;
            }


            if ((ant.x < otherAnt.x + ballSize) && (ant.x + ballSize > otherAnt.x) && (ant.y < otherAnt.y + ballSize) && (ballSize + ant.y > otherAnt.y)) {

                console.log("collision");

                if (ant.x < otherAnt.x + ballSize) {
                    ant.dx = -1;
                    otherAnt.dx = 1;
                    ant.x = otherAnt.x + ballSize;
                }

                if (ant.x + ballSize > otherAnt.x) {
                    ant.dx = 1;
                    otherAnt.dx = -1;
                    otherAnt.x = ant.x - ballSize;
                }

                if (ant.y < otherAnt.y + ballSize) {
                    ant.dy = 1;
                    otherAnt.dy = -1;
                    ant.y = otherAnt.y + ballSize;
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

function getRandom() {
    return Math.floor(Math.random() * Math.floor(450));
}
