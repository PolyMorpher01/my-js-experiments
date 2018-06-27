var $container = document.getElementById("container");
var $ants = document.getElementsByClassName("ants");


var numberOfAnts = 10;
var speed =20;

var ballSize = 50;
var containerBorder =10;
var containerTop = 0+ containerBorder ; //adding offset
var containerBottom = 500 - containerBorder;  //subtracting offset

var containerLeft = 0 + containerBorder ;
var containerRight = 500 - containerBorder;


var antCoordinate =[];


for (let i = 0; i < numberOfAnts; i++) {
   var coordinates = {
        x: getRandom(),
        y: getRandom(),
        dx: 1,
        dy: 1
    };
    antCoordinate.push(coordinates);
}


for (let i = 0; i < numberOfAnts; i++) {
    var $ant = document.createElement("div");

    $ant.className = "ants";

    $ant.style.left = antCoordinate[i].x + "px";
    $ant.style.top = antCoordinate[i].y + "px";
    $container.appendChild($ant);

    $ant.onclick = function () {
        this.style.display = "none";
        // var listElement = document.createElement("li");
        // listElement.innerText = "Top: " + this.style.top + ", " + "Left: " + this.style.left;
        // list.appendChild(listElement);
    }
}


var interval = function () {
    for (var i = 0; i < numberOfAnts; i++) {
    setInterval(function (index) {

        return function () {
            checkBoundaryCollision(antCoordinate[index]);
            antCoordinate[index].x = antCoordinate[index].x + antCoordinate[index].dx * speed;
            antCoordinate[index].y = antCoordinate[index].y + antCoordinate[index].dy * speed;
            updateDirection($ants[index]);
            // console.log($ants[i]);
        }
    }(i), 1000);
    }
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


function updateDirection(ant) {
   ant.style.top = ant.y+ "px";
    ant.style.left = ant.x+ "px";
}

function getRandom() {
    return Math.floor(Math.random() * Math.floor(450));
}
