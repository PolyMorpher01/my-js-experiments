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

            checkBoundingBoxCollision();
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
function checkBoundingBoxCollision() {

    antCollection.forEach(function (ant) {
        console.log("Ant",ant);
        antCollection.forEach(function(otherAnt) {
            console.log("Other Ant",otherAnt);
            if(ant===otherAnt){
                //do Nothing
                // console.log("hoho");
            }

            else if (ant.x < otherAnt.x + ballSize && ant.x + ballSize > otherAnt && ant.y < otherAnt.y + ballSize && ballSize + ant.y > otherAnt.y) {

                console.log("collision");
                // if (ant.x < otherAnt.x + ballSize) {
                //     ballBlue.dx = -1;
                //     ballRed.dx = 1;
                //     ballBlue.x = ballRed.x + ballSize;
                // }
                //
                // if (ant.x + ballSize > otherAnt.x) {
                //     ballBlue.dx = 1;
                //     ballRed.dx = -1;
                //     ballRed.x = ballBlue.x - ballSize;
                // }
                //
                // if (ant.y < otherAnt.y + ballSize) {
                //     ballBlue.dy = 1;
                //     ballRed.dy = -1;
                //     ballBlue.y = ballRed.y + ballSize;
                // }
                //
                // if (ballSize + ant.y > otherAnt.y) {
                //     ballBlue.dy = -1;
                //     ballRed.dy = 1;
                //     ballRed.y = ballBlue.y - ballSize;
                // }
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
