var $mainWrapper = document.getElementById("main-wrapper");

var CONTAINER_PADDING = 30;
var CONTAINER_LEFT = 0 + CONTAINER_PADDING;
var CONTAINER_RIGHT = 360 - CONTAINER_PADDING;
var CAR_SIZE = 100;
var CONTAINER_TOP = 0;
var CONTAINER_BOTTOM = 600;

var GAME_LOOP_INTERVAL = 20;

var BULLET_SIZE = 10;
var BULLET_SPEED = 4;

var ENEMY_CAR_SPEED = 2;
var MAXIMUM_ENEMY_PER_FRAME = 2;
var ENEMY_HEALTH = 300;

var BACKGROUND_UPDATE_SPEED = 2;

var newContainer = new Container({
    $mainWrapper: $mainWrapper
});

newContainer.init();
newContainer.startGame();


// *************Container Class Definition*******************
function Container(props) {

    var self = this;

    var Bullets = [];
    var EnemyCars = [];
    var enemyCarsCounter = 0;

    var score = 0;

    var addNewContainer = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "container-wrapper";
        props.$mainWrapper.appendChild(self.$elem);

        addScoreWrapper();
    };


    var addScoreWrapper = function () {
        self.$scoreWrapper = document.createElement("div");
        self.$scoreWrapper.className = "score-wrapper";
        self.$elem.appendChild(self.$scoreWrapper);
        self.$scoreWrapper.innerHTML = "Score";

        self.$score = document.createElement("span");
        self.$score.style.display = "block";
        self.$scoreWrapper.appendChild(self.$score);

        updateScore();
    };

    var updateScore = function () {
        score++;
        self.$score.innerHTML = score;
    };

    var newGoodCar;
    var createGoodCar = function () {
        newGoodCar = new GoodCar({
            x: 130,
            y: 500,
            $parent: self.$elem
        });

        newGoodCar.init();
    };


    var createEnemyCars = function () {

        var enemyCar = new EnemyCar({
            $parent: self.$elem
        });

        enemyCar.init();
        return enemyCar;
    };


    var createNewBullet = function () {
        var newBullet = new Bullet({
            $parent: self.$elem,
            x: newGoodCar.x + CAR_SIZE / 2 - BULLET_SIZE / 2, //setting the bullet position middle of the car
            y: newGoodCar.y - BULLET_SIZE
        });

        newBullet.init();

        return newBullet;
    };


    var addKeyEvents = function () {
        document.onkeydown = function (event) {
            if (event.keyCode === 37) {
                //LEFT
                if (!(newGoodCar.x < CONTAINER_LEFT + CAR_SIZE)) {
                    newGoodCar.x -= 100;
                    newGoodCar.plotPosition();
                }
            }
            else if (event.keyCode === 39) {
                //RIGHT
                if (!(newGoodCar.x > CONTAINER_RIGHT - CAR_SIZE * 2)) {
                    newGoodCar.x += 100;
                    newGoodCar.plotPosition();
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

            var collisionWithEnemy = false;

            if (EnemyCars.length) {
                EnemyCars.forEach(function (car) {
                    collisionWithEnemy = checkBulletCollision(car, Bullets[i])
                });
            }

            //remove bullet
            if (Bullets[i].y < CONTAINER_TOP || collisionWithEnemy) {
                Bullets[i].destroyBullet();
                Bullets.splice(i, 1);
            }

        }
    };


    var updateEnemyCars = function () {
        for (var i = 0; i < EnemyCars.length; i++) {
            EnemyCars[i].updatePosition();

            if (EnemyCars[i].y > CONTAINER_BOTTOM) {
                EnemyCars[i].enemyHealth = 0;
                EnemyCars[i].destroyEnemyCar();
                EnemyCars.splice(i, 1);
                enemyCarsCounter--;
            }

            if (checkCarCollision(EnemyCars[i], newGoodCar)) {
                gameOver();
            }

        }
    };


    var gameOver = function () {
        clearInterval(self.interval);
        alert("game over");
        // location.reload();
    };


    var checkBulletCollision = function (enemyCar, bullet) {
        var enemyCarTop = enemyCar.y + CAR_SIZE;
        if (bullet.y < enemyCarTop && (bullet.x >= enemyCar.x && bullet.x <= enemyCar.x + CAR_SIZE)) {
            if (enemyCar.destroyEnemyCar()) {
                enemyCarsCounter--;
                EnemyCars.splice(EnemyCars.indexOf(enemyCar), 1)
            }
            return true;
        }
    };


    var checkCarCollision = function (enemyCar, goodCar) {
        var enemyCarTop = enemyCar.y + CAR_SIZE;
        if (enemyCarTop > goodCar.y && (enemyCar.x + CAR_SIZE > goodCar.x && enemyCar.x < goodCar.x + CAR_SIZE)) {
            return true;
        }
    };


    var verticalBackgroundPosition = 1;
    var updateBackgroundPosition = function () {
        verticalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        self.$elem.style.backgroundPosition = "0 " + verticalBackgroundPosition + "px";

    };


    self.startGame = function () {
        self.interval = setInterval(function () {
            updateBackgroundPosition();

            updateScore();

            if (enemyCarsCounter < MAXIMUM_ENEMY_PER_FRAME) {
                EnemyCars.push(createEnemyCars());
                enemyCarsCounter++;
            }


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
    self.x = 0;
    self.y = CONTAINER_TOP;
    self.dx = props.dx || 0;
    self.dy = props.dy || 0;
    self.$parent = props.$parent;
    self.enemyHealth = ENEMY_HEALTH;

    var getRandomXPosition = function () {
        var randomValue = getRandom(1, 3);
        if (randomValue === 1) return 30;
        if (randomValue === 2) return 130;
        if (randomValue === 3) return 230;
    };

    self.x = getRandomXPosition();


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
        console.log(self.enemyHealth);
        if (self.enemyHealth === 0) {
            self.$elem.remove();
            return true;
        }
        self.enemyHealth -= 100;
    };

    self.init = function () {
        addNewEnemyCar();
        plotPosition();
    }

}


//*****************Function Definition*********************
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}