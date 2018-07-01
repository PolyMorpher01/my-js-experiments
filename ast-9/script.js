var $mainWrapper = document.getElementById("main-wrapper");
var $homeScreen = document.getElementById("home-screen");
var $gameOverWrapper = document.getElementById("game-over-wrapper");
var $startButton = document.getElementById("start-button");
var $finalScore = document.getElementById("final-score");

var CONTAINER_PADDING = 30;
var CONTAINER_LEFT = 0 + CONTAINER_PADDING;
var CONTAINER_RIGHT = 360 - CONTAINER_PADDING;
var CAR_WIDTH = 100;
var PLAYER_CAR_HEIGHT = 75;
var ENEMY_CAR_HEIGHT = 50;
var CONTAINER_TOP = 0;
var CONTAINER_BOTTOM = 600;

var GAME_LOOP_INTERVAL = 20;

var BULLET_HEIGHT = 33;
var BULLET_WIDTH = 9;
var BULLET_SPEED = 50;

var ENEMY_HEALTH = 300;
var ENEMY_SPAWN_DELAY = 60;

var BACKGROUND_UPDATE_SPEED = 2;
var SCORE_UPDATE_SPEED = 0.1;
//*******************Global Variable Declaration Ends here ***************************


//Create New Game
var newGame = new Game({
    $parent: $mainWrapper,
    $startButton: $startButton,
    $homeScreen: $homeScreen,
    $gameOverWrapper: $gameOverWrapper,
    $finalScore: $finalScore
});
newGame.init();


//*****************Game Class Definition*********************

function Game(props) {

    var self = this;

    self.$parent = props.$parent;
    self.$startButton = props.$startButton;
    self.$homeScreen = props.$homeScreen;
    self.$gameOverWrapper = props.$gameOverWrapper;
    self.$finalScore = props.$finalScore;

    self.init = function () {
        createNewContainer();
        addStartEvent();
    };

    var newContainer;
    var createNewContainer = function () {
        newContainer = new Container({
            $parent: self.$parent,
            $homeScreen: self.$homeScreen,
            $gameOverWrapper: self.$gameOverWrapper,
            $finalScore: self.$finalScore
        });

        newContainer.init();
    };

    var addStartEvent = function () {
        self.$startButton.onclick = function () {
            self.$homeScreen.style.display = "none";
            newContainer.startGame();
        };
    };

}


// *************Container Class Definition*******************
function Container(props) {

    var self = this;


    self.$parent = props.$parent;
    self.$homeScreen = props.$homeScreen;
    self.$gameOverWrapper = props.$gameOverWrapper;
    self.$finalScore = props.$finalScore;


    self.score = 0;

    var Bullets = [];
    var EnemyCars = [];
    var gameStatus = false;

    //private function declarations
    var reset;
    var addNewContainer;
    var updateBackgroundPosition;
    var createPlayerCar;
    var createEnemyCar;
    var updateEnemyCars;
    var createNewBullet;
    var updateBullets;
    var checkBulletCollision;
    var checkCarCollision;
    var addScoreWrapper;
    var updateScore;
    var keyDownHandler;
    var gameOver;
    var playStartSound;
    var playBulletSound;
    var playGameOverSound;
    var playExplosionSound;
    var playCarExplosionSound;
    var playKeySound;


    self.init = function () {
        addNewContainer();
        createPlayerCar();
        document.onkeydown = keyDownHandler;
    };

    var delayCounter = 0;
    self.startGame = function () {
        playStartSound();
        gameStatus = true;

        self.interval = setInterval(function () {
            updateBackgroundPosition();
            updateScore();
            delayCounter++;

            if (delayCounter > ENEMY_SPAWN_DELAY) {
                EnemyCars.push(createEnemyCar());
                delayCounter = 0;
            }

            if (Bullets.length > 0) {
                updateBullets();
            }

            if (EnemyCars.length > 0) {
                updateEnemyCars();
            }
        }, GAME_LOOP_INTERVAL);
    };

    reset = function () {

        //delete remaining cars
        var temp_enemy_cars = EnemyCars;
        for (var i = 0; i < temp_enemy_cars.length; i++) {
            temp_enemy_cars[i].enemyHealth = 0;
            temp_enemy_cars[i].destroyEnemyCar();
            temp_enemy_cars[i] = null;
        }
        EnemyCars = clearArray(temp_enemy_cars);


        //delete remaining bullets
        var temp_bullets = Bullets;
        for (var j = 0; j < temp_bullets.length; j++) {
            temp_bullets[j].destroyBullet();
            temp_bullets[j] = null
        }

        Bullets = clearArray(temp_bullets);

        self.score = 0;
        delayCounter = 0;

        self.$gameOverWrapper.style.display = "none";

        self.$homeScreen.style.display = "block";

    };

    addNewContainer = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "container-wrapper";
        self.$parent.appendChild(self.$elem);

        addScoreWrapper();
    };

    var verticalBackgroundPosition = 1;
    updateBackgroundPosition = function () {
        verticalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        self.$elem.style.backgroundPosition = "0 " + verticalBackgroundPosition + "px";

    };

    var newPlayerCar;
    createPlayerCar = function () {
        newPlayerCar = new PlayerCar({
            x: 130,
            y: 500,
            $parent: self.$elem
        });

        newPlayerCar.init();
    };

    createEnemyCar = function () {

        var enemyCar = new EnemyCar({
            $parent: self.$elem,
            score: self.score
        });

        enemyCar.init();
        return enemyCar;
    };

    updateEnemyCars = function () {

        var temp_enemy_cars = EnemyCars;

        for (var i = 0; i < temp_enemy_cars.length; i++) {
            temp_enemy_cars[i].updatePosition();

            if (checkCarCollision(temp_enemy_cars[i], newPlayerCar)) {
                gameOver();
            }

            if (temp_enemy_cars[i].y > CONTAINER_BOTTOM) {
                temp_enemy_cars[i].enemyHealth = 0;
                temp_enemy_cars[i].destroyEnemyCar();
                temp_enemy_cars[i] = null
            }
        }
        EnemyCars = clearArray(temp_enemy_cars);
    };

    createNewBullet = function () {
        var newBullet = new Bullet({
            $parent: self.$elem,
            x: newPlayerCar.x + CAR_WIDTH / 2 - BULLET_WIDTH / 2, //setting the bullet position middle of the car
            y: newPlayerCar.y - BULLET_HEIGHT
        });

        newBullet.init();
        playBulletSound();
        return newBullet;
    };

    updateBullets = function () {

        var temp_bullets = Bullets;
        for (var i = 0; i < temp_bullets.length; i++) {

            if (temp_bullets[i] !== null) {

                temp_bullets[i].updatePosition();

                //remove bullet
                if (temp_bullets[i].y < CONTAINER_TOP) {
                    temp_bullets[i].destroyBullet();
                    temp_bullets[i] = null;
                    return;
                }

                if (EnemyCars.length) {
                    EnemyCars.forEach(function (car) {

                        if (checkBulletCollision(car, temp_bullets[i])) {
                            temp_bullets[i].destroyBullet();
                            temp_bullets[i] = null;
                        }

                    });
                }
            }
        }
        Bullets = clearArray(temp_bullets);

    };

    checkBulletCollision = function (enemyCar, bullet) {
        var enemyCarTop = enemyCar.y + ENEMY_CAR_HEIGHT;

        if (bullet === null) { //TODO
            return;
        }

        if (bullet.y < enemyCarTop && (bullet.x >= enemyCar.x && bullet.x <= enemyCar.x + CAR_WIDTH)) {
            if (enemyCar.destroyEnemyCar()) {
                EnemyCars.splice(EnemyCars.indexOf(enemyCar), 1);
                playExplosionSound();
            }
            return true;
        }
    };

    checkCarCollision = function (enemyCar, playerCar) {
        var enemyCarTop = enemyCar.y + ENEMY_CAR_HEIGHT;
        if (enemyCarTop > playerCar.y && (enemyCar.x + CAR_WIDTH > playerCar.x && enemyCar.x < playerCar.x + CAR_WIDTH)) {
            playCarExplosionSound();
            return true;
        }
    };

    addScoreWrapper = function () {
        self.$scoreWrapper = document.createElement("div");
        self.$scoreWrapper.className = "score-wrapper";
        self.$elem.appendChild(self.$scoreWrapper);
        self.$scoreWrapper.innerHTML = "Score";

        self.$score = document.createElement("span");
        self.$score.style.display = "block";
        self.$scoreWrapper.appendChild(self.$score);

        updateScore();
    };

    updateScore = function () {
        self.score += SCORE_UPDATE_SPEED;
        self.$score.innerHTML = Math.floor(self.score);
    };

    keyDownHandler = function (event) {
        if (gameStatus === true) {
            if (event.keyCode === 37) {
                //LEFT
                playKeySound();
                if (!(newPlayerCar.x < CONTAINER_LEFT + CAR_WIDTH)) {
                    newPlayerCar.x -= 100;
                    newPlayerCar.plotPosition();
                }
            }
            else if (event.keyCode === 39) {
                //RIGHT
                playKeySound();
                if (!(newPlayerCar.x > CONTAINER_RIGHT - CAR_WIDTH * 2)) {
                    newPlayerCar.x += 100;
                    newPlayerCar.plotPosition();
                }
            }
            else if (event.keyCode === 32) {
                //SPACE_BAR
                Bullets.push(createNewBullet());
            }
        }

        else {
            if (event.keyCode === 27) {
                //ESCAPE
                playKeySound();
                reset();
            }
        }

    };

    gameOver = function () {
        playGameOverSound();
        clearInterval(self.interval);
        gameStatus = false;
        self.$gameOverWrapper.style.display = "block";
        self.$finalScore.innerHTML = Math.floor(self.score);

        self.$gameOverWrapper.onmousedown = function () {
            playKeySound();
            reset();
        };
    };


    //Sound Functions
    playStartSound = function () {
        self.startSound = document.createElement("audio");
        self.startSound.src = "sounds/start.wav";
        self.startSound.play();
    };

    playBulletSound = function () {
        self.bulletSound = document.createElement("audio");
        self.bulletSound.src = "sounds/shoot.wav";
        self.bulletSound.play();
    };

    playGameOverSound = function () {
        self.gameOverSound = document.createElement("audio");
        self.gameOverSound.src = "sounds/dead.mp3";
        self.gameOverSound.play();
    };

    playExplosionSound = function () {
        self.explosionSound = document.createElement("audio");
        self.explosionSound.src = "sounds/explosion.wav";
        self.explosionSound.play();
    };

    playCarExplosionSound = function () {
        self.carExplosionSound = document.createElement("audio");
        self.carExplosionSound.src = "sounds/carExplosion.wav";
        self.carExplosionSound.play();
    };

    playKeySound = function () {
        self.keySound = document.createElement("audio");
        self.keySound.src = "sounds/keyPress.wav";
        self.keySound.play();
    };

}


// *************PlayerCar Class Definition*******************
function PlayerCar(props) {
    var self = this;

    self.x = props.x;
    self.y = props.y;
    self.dx = props.dx || 1;
    self.dy = props.dy || 1;
    self.$parent = props.$parent;


    self.init = function () {
        addNewCar();
        self.plotPosition();
    };

    self.plotPosition = function () {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };

    var addNewCar = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "car player-car";
        self.$parent.appendChild(self.$elem);
    };
}


//******************Bullet Class Definition***************
function Bullet(props) {
    var self = this;

    self.$parent = props.$parent;

    self.x = props.x;
    self.y = props.y;
    self.dy = props.dy || -1;


    self.init = function () {
        addNewBullet();
        plotPosition();
    };


    self.updatePosition = function () {
        self.y = self.y + self.dy * BULLET_SPEED;
        plotPosition();
    };

    self.destroyBullet = function () {
        self.$elem.remove();
    };

    var addNewBullet = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "bullet";
        self.$parent.appendChild(self.$elem);
    };

    var plotPosition = function () {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };
}


//***********************Enemy Car Class Definition*************

function EnemyCar(props) {
    var self = this;
    self.x = 0;
    self.y = CONTAINER_TOP - ENEMY_CAR_HEIGHT;
    self.dx = props.dx || 0;
    self.dy = props.dy || 0;
    self.$parent = props.$parent;
    self.enemyHealth = ENEMY_HEALTH - 100;

    self.score = props.score;

    self.init = function () {
        addNewEnemyCar();
        plotPosition();
    };

    var enemyCarSpeed = 1;
    self.updatePosition = function () {
        //increase speed with score
        enemyCarSpeed = Math.floor(self.score / 100) + 1;
        self.y = self.y + enemyCarSpeed;
        plotPosition();
    };

    self.destroyEnemyCar = function () {
        if (self.enemyHealth === 0) {
            self.$elem.remove();
            return true;
        }
        self.enemyHealth -= 100;
    };

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


}


//*****************Function Definition*********************

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function clearArray(input) {
    var temp = [];
    for (var i = 0; i < input.length; i++) {
        if (input[i] !== null) {
            (temp).push(input[i]);
        }
    }
    return temp;
}