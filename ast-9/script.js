$mainWrapper = document.getElementById("main-wrapper");

var CONTAINER_PADDING = 30;
var CONTAINER_LEFT = 0+ CONTAINER_PADDING;
var CONTAINER_RIGHT = 360 - CONTAINER_PADDING;
var CAR_SIZE = 100;


var newContainer = new Container({
    $mainWrapper : $mainWrapper
});

newContainer.init();
newContainer.start();



// *************Container Class Definition*******************
function Container(props) {

    var self = this;



    var addNewContainer = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "container-wrapper";
        props.$mainWrapper.appendChild(self.$elem);
    };

    var newCar;
    var addGoodCar = function () {
        newCar = new GoodCar({
            x: 130,
            y: 500,
            $parent: self.$elem
        });

        newCar.init();
    };


    var verticalBackgroundPosition = 1;
    var BACKGROUND_UPDATE_SPEED = 1;

    var updateBackgroundPosition = function () {
        verticalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        self.$elem.style.backgroundPosition = "0 "+ verticalBackgroundPosition + "px";

    };




    self.start = function () {
        self.interval = setInterval(function () {
            updateBackgroundPosition();

        },10);
    };




    self.init = function () {
        addNewContainer();
        addGoodCar();
    }

}



// *************GoodCar Class Definition*******************
function GoodCar(props) {
    var self = this;

    self.x = props.x;
    self.y = props.y;
    self.dx = props.dx || 1;
    self.dy = props.dy || 1;
    self.$parent = props.$parent;


    var plotPosition = function () {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };


    var addNewCar = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "car";
        self.$parent.appendChild(self.$elem);
    };

    self.init = function () {
        addNewCar();
        plotPosition();

        //Arrow key press event
        document.onkeydown = function (event) {
            if (event.keyCode === 37) {
                //LEFT
                if(!(self.x<CONTAINER_LEFT+CAR_SIZE)) {
                    self.x -= 100;
                    plotPosition();
                }

            }
            else if (event.keyCode === 39) {
                //RIGHT
                if(!(self.x>CONTAINER_RIGHT-CAR_SIZE*2)) {
                    self.x += 100;
                    plotPosition();
                }

            }
        };
    }

}


//******************Bullet Class Definition***************
function Bullet(props) {
    var self = this
}