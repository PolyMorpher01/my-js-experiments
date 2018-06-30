$mainWrapper = document.getElementById("main-wrapper");

var CONTAINER_PADDING = 30;
var CONTAINER_LEFT = 0 + CONTAINER_PADDING;
var CONTAINER_RIGHT = 360 - CONTAINER_PADDING;
var CAR_SIZE = 100;
var CONTAINER_TOP = 0;
var CONTAINER_BOTTOM = 600;

var GAME_LOOP_INTERVAL = 10;

var BULLET_SIZE = 10;
var BULLET_SPEED = 4;

var ENEMY_CAR_SPEED = 2;

var BACKGROUND_UPDATE_SPEED = 1;

var newContainer = new Container({
    $mainWrapper: $mainWrapper
});

newContainer.init();
newContainer.startGame();


// *************Container Class Definition*******************
function Container(props) {

    var self = this;


    var addNewContainer = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "container-wrapper";
        props.$mainWrapper.appendChild(self.$elem);
    };

    var newCar;
    var createGoodCar = function () {
        newCar = new GoodCar({
            x: 130,
            y: 500,
            $parent: self.$elem
        });

        newCar.init();
    };

    var EnemyCars = [];
    var createEnemyCars = function () {

        var enemyCar = new EnemyCar({
            x: CONTAINER_LEFT,
            y: CONTAINER_TOP,
            $parent: self.$elem
        });

        enemyCar.init();
        return enemyCar;
    };


    var createNewBullet = function () {
        var newBullet = new Bullet({
            $parent: self.$elem,
            x: newCar.x + CAR_SIZE / 2 - BULLET_SIZE / 2, //setting the bullet position middle of the car
            y: newCar.y - BULLET_SIZE
        });

        newBullet.init();

        return newBullet;
    };


    var checkCollision = function (enemyCar, bullet) {
        var enemyCarTop = enemyCar.y + CAR_SIZE;
        if (bullet.y < enemyCarTop && (bullet.x >= enemyCar.x && bullet.x <= enemyCar.x + CAR_SIZE)) {
            console.log("ahhh");
            console.log(EnemyCars.indexOf(enemyCar));
            if (enemyCar.destroyEnemyCar()) {
                EnemyCars.splice(EnemyCars.indexOf(enemyCar), 1)
            }
            return true;
        }
    };


    var verticalBackgroundPosition = 1;
    var updateBackgroundPosition = function () {
        verticalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        self.$elem.style.backgroundPosition = "0 " + verticalBackgroundPosition + "px";

    };

    var Bullets = [];
    var addKeyEvents = function () {
        document.onkeydown = function (event) {
            if (event.keyCode === 37) {
                //LEFT
                if (!(newCar.x < CONTAINER_LEFT + CAR_SIZE)) {
                    newCar.x -= 100;
                    newCar.plotPosition();
                }

            }
            else if (event.keyCode === 39) {
                //RIGHT
                if (!(newCar.x > CONTAINER_RIGHT - CAR_SIZE * 2)) {
                    newCar.x += 100;
                    newCar.plotPosition();
                }

            }
            else if (event.keyCode === 32) {
                //SPACE_BAR
                Bullets.push(createNewBullet());
            }
        };
    };


    var updateBullets = function () {
        for (var i = 0; i < Bullets.length; i++) {
            Bullets[i].updatePosition();

            if (EnemyCars.length > 0) {
                var collisionWithEnemy = checkCollision(EnemyCars[0], Bullets[i])
            }

            //remove bullet
            if (Bullets[i].y < CONTAINER_TOP || collisionWithEnemy) {
                Bullets[i].destroyBullet();
                Bullets.splice(i, 1);
            }

        }
        // console.log(Bullets.length);
    };


    var updateEnemyCars = function () {
        for (var i = 0; i < EnemyCars.length; i++) {
            EnemyCars[i].updatePosition();

            if (EnemyCars[i].y > CONTAINER_BOTTOM) {
                EnemyCars[i].enemyHealth = 0;
                EnemyCars[i].destroyEnemyCar();
                EnemyCars.splice(i, 1);
            }
        }
    };

    self.startGame = function () {
        self.interval = setInterval(function () {
            updateBackgroundPosition();

            if (Bullets.length > 0) {
                updateBullets();
            }

            if (EnemyCars.length > 0) {
                updateEnemyCars();
            }


        }, GAME_LOOP_INTERVAL);
    };


    self.init = function () {
        addNewContainer();
        createGoodCar();
        addKeyEvents();
        EnemyCars.push(createEnemyCars());
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


    self.plotPosition = function () {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };


    var addNewCar = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "car good-car";
        self.$parent.appendChild(self.$elem);
    };


    self.init = function () {
        addNewCar();
        self.plotPosition();
    }

}


//******************Bullet Class Definition***************
function Bullet(props) {
    var self = this;

    self.$parent = props.$parent;

    self.x = props.x;
    self.y = props.y;
    self.dy = props.dy || -1;


    var addNewBullet = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "bullet";
        self.$parent.appendChild(self.$elem);
    };

    var plotPosition = function () {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };


    self.updatePosition = function () {
        self.y = self.y + self.dy * BULLET_SPEED;
        plotPosition();
    };

    self.destroyBullet = function () {
        self.$elem.remove();
    };

    self.init = function () {
        addNewBullet();
        plotPosition();
    }

}


//***********************Enemy Car Class Definition*************

function EnemyCar(props) {
    var self = this;

    self.x = props.x;
    self.y = props.y;
    self.dx = props.dx || 0;
    self.dy = props.dy || 0;
    self.$parent = props.$parent;
    self.enemyHealth = 300;


    var plotPosition = function () {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };


    var addNewEnemyCar = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "car enemy-car";
        self.$parent.appendChild(self.$elem);
    };

    self.updatePosition = function () {
        self.y = self.y + ENEMY_CAR_SPEED;
        plotPosition();
    };

    self.destroyEnemyCar = function () {
        self.enemyHealth -= 100;
        if (self.enemyHealth <= 0) {
            self.$elem.remove();
            return true;
        }
    };

    self.init = function () {
        addNewEnemyCar();
        plotPosition();
    }

}