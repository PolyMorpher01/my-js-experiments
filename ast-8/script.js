var $container = document.getElementById("container");
var $mainWrapper = document.getElementById("main-wrapper");

var $startButton = document.getElementById("start");
var $resetButton = document.getElementById("reset");

var numberOfBoxes = 10;
var SPEED = 1;

var BOX_SIZE = 20;
var CONTAINER_BORDER = 10;
var CONTAINER_TOP = 0; //adding offset
var CONTAINER_BOTTOM = 600 - BOX_SIZE - CONTAINER_BORDER;
var CONTAINER_LEFT = 0;
var CONTAINER_RIGHT = 1000 - BOX_SIZE - CONTAINER_BORDER;



$startButton.onclick = function () {
    var container1 = new Container($mainWrapper);
    container1.init();

    this.style.display = "none";
    $resetButton.style.display = "block";
};

$resetButton.onclick = function () {
  //TODO
};




//*****************Container Class Definition************************
function Container(props) {

    var self = this;
    self.Boxes = [];

    var addNewContainer = function () {
        self.$parent = props.$parent || $mainWrapper;
        self.$elem = document.createElement("div");
        self.$elem.className = "container";
        self.$parent.appendChild(self.$elem);

    };

    var createBoxes = function () {
        for (var i = 0; i < numberOfBoxes; i++) {
            self.Boxes[i] = new Box({
                x: getRandom(1, 950),
                y: getRandom(1, 550),
                $parent: self.$elem
            });

            self.Boxes[i].init();
        }

        //adding click events
        self.Boxes.forEach(function (box) {

            box.$elem.onclick = function () {
                var that = this;

                //stop the motion
                box.dx = 0;
                box.dy = 0;

                setTimeout(function () {
                    that.remove(); // remove
                }, 800);
            }
        })
    };

    var checkBoundingBoxCollision = function () {

        self.Boxes.forEach(function (box) {
            // console.log("Ant",ant);
            self.Boxes.forEach(function (otherBox) {

                if (box === otherBox) {
                    return;
                }


                if ((box.x < otherBox.x + BOX_SIZE) && (box.x + BOX_SIZE > otherBox.x) && (box.y < otherBox.y + BOX_SIZE) && (BOX_SIZE + box.y > otherBox.y)) {

                    if (box.x < otherBox.x + BOX_SIZE) {
                        box.dx = -1;
                        otherBox.dx = 1;

                        //so that it does not overflow container at right
                        if (otherBox.x + BOX_SIZE < CONTAINER_RIGHT - BOX_SIZE) {
                            box.x = otherBox.x + BOX_SIZE;
                        }

                    }

                    if (box.x + BOX_SIZE > otherBox.x) {
                        box.dx = 1;
                        otherBox.dx = -1;
                        otherBox.x = box.x - BOX_SIZE;
                    }

                    if (box.y < otherBox.y + BOX_SIZE) {
                        box.dy = 1;
                        otherBox.dy = -1;

                        //so that it does not overflow container at bottom
                        if (otherBox.y + BOX_SIZE < CONTAINER_BOTTOM - BOX_SIZE) {
                            box.y = otherBox.y + BOX_SIZE;
                        }
                    }

                    if (BOX_SIZE + box.y > otherBox.y) {
                        box.dy = -1;
                        otherBox.dy = 1;

                        otherBox.y = box.y - BOX_SIZE;


                    }
                }
            })
        });

    };

    var start = function () {
    createBoxes();

    self.interval =  setInterval(function () {
            checkBoundingBoxCollision();

            self.Boxes.forEach(function (box) {
                box.checkBoundaryCollision();
            });

        }, 100);
    };

    var reset = function () {
        clearInterval(self.interval);
        console.log(1)
    };

    self.init = function () {
        addNewContainer();
        start();
        // reset();
    }
}


//**************Box Class Definition************************
function Box(props) {

    var self = this;

    self.x = props.x;
    self.y = props.y;
    self.dx = props.dx || 1;
    self.dy = props.dy || 1;


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

    };

    self.init = function () {
        addNewBoxes();
        plotPosition();
    };

}


//*****************Function Definition*********************
function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
}

