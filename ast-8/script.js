var $container = document.getElementById("container");

var numberOfBoxes = 10;
var SPEED = 1;

var BOX_SIZE = 20;
var CONTAINER_BORDER = 10;
var CONTAINER_TOP = 0 ; //adding offset
var CONTAINER_BOTTOM = 600 - BOX_SIZE -CONTAINER_BORDER;
var CONTAINER_LEFT = 0 ;
var CONTAINER_RIGHT = 1000 - BOX_SIZE - CONTAINER_BORDER;

var Boxes =[];

CreateBoxes();
startInterval();

function Box(props) {

    var self = this;


    var addNewBoxes = function () {
        self.$parent = props.$parent;
        self.$elem = document.createElement("div");
        self.$elem.className = "ants";
        self.$parent.appendChild(self.$elem);
    };

    
    var plotPosition = function () {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };

    var updatePosition = function () {
        self.x = self.x + self.dx * SPEED;
        self.y = self.y + self.dy * SPEED;
    };
    
    self.init = function () {
        self.x = props.x;
        self.y = props.y;
        self.dx = props.dx||1;
        self.dy = props.dy||1;

        addNewBoxes();
        plotPosition();
    };


    self.checkBoundaryCollision = function () {

        self.leftEdge = self.x;
        self.rightEdge = self.x + BOX_SIZE;
        self.topEgde = self.y;
        self.bottomEdge = self.y + BOX_SIZE;

        if (self.topEgde < CONTAINER_TOP) {
            self.dy = 1;
        }
        if (self.leftEdge < CONTAINER_LEFT) {

            self.dx = 1;
        }
        if (self.rightEdge > CONTAINER_RIGHT) {

            self.dx = -1;
        }
        if (self.bottomEdge > CONTAINER_BOTTOM) {
            self.dy = -1;
        }

        updatePosition();
        plotPosition();

    }


}


function CreateBoxes() {
    for (var i=0; i<numberOfBoxes;i++){
        Boxes[i] = new Box({
            x: getRandom(1,950),
            y: getRandom(1,550),
            $parent:$container
        });

        Boxes[i].init();
    }

}

function startInterval() {

    setInterval(function () {
        // checkBoundingBoxCollision();
        Boxes.forEach(function (box) {
            box.checkBoundaryCollision(box);
        });

    }, 1);

}


function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
}

