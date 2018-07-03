var $mainWrapper = document.getElementById("main-wrapper");
var $homeScreen = document.getElementById("home-screen");
var $gameOverWrapper = document.getElementById("game-over-wrapper");
var $startButton = document.getElementById("start-button");
var $finalScore = document.getElementById("final-score");

var CONTAINER_PADDING = 30;
var CONTAINER_LEFT = 0 + CONTAINER_PADDING;
var CONTAINER_RIGHT = 360 - CONTAINER_PADDING;
var CONTAINER_TOP = 0;
var CONTAINER_BOTTOM = 600;

var CAR_WIDTH = 100;
var PLAYER_CAR_HEIGHT = 75;

var ENEMY_CAR_HEIGHT = 50;
var ENEMY_HEALTH = 300;
var ENEMY_SPAWN_DELAY = 60;

var METEOR_HEIGHT = 96;
var METEOR_SPAWN_DELAY = 250;

var BULLET_HEIGHT = 33;
var BULLET_WIDTH = 9;
var BULLET_SPEED = 50;

var SMALL_EXPLOSION_WIDTH = 56;
var BIG_EXPLOSION_WIDTH = 62;
var EXPLOSION_TIMEOUT = 100;

var GAME_LOOP_INTERVAL = 20;

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
    var Meteors = [];
    var gameStatus = false;


    self.init = function () {
        addNewContainer();
        createPlayerCar();
        document.onkeydown = keyDownHandler;
    };

    var enemySpawnDelayCounter = 0;
    var meteorSpawnDelayCounter = 0;
    self.startGame = function () {
        playStartSound();
        gameStatus = true;

        self.interval = setInterval(function () {
            updateBackgroundPosition();
            updateScore();
            enemySpawnDelayCounter++;
            meteorSpawnDelayCounter++;

            if (enemySpawnDelayCounter > ENEMY_SPAWN_DELAY) {
                EnemyCars.push(createEnemyCar());
                enemySpawnDelayCounter = 0;
            }

            if (meteorSpawnDelayCounter > METEOR_SPAWN_DELAY) {
                Meteors.push(createMeteor());
                meteorSpawnDelayCounter = 0;
            }

            if (Bullets.length > 0) {
                updateBullets();
            }

            if (EnemyCars.length > 0) {
                updateEnemyCars();
            }

            if (Meteors.length > 0) {
                updateMeteors();
            }

        }, GAME_LOOP_INTERVAL);
    };

    var reset = function () {

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
            if (temp_bullets[j] !== null)
                temp_bullets[j].destroyBullet();
            temp_bullets[j] = null;
        }
        Bullets = clearArray(temp_bullets);

        //delete remaining meteors
        var temp_meteors = Meteors;
        for (var k = 0; k < temp_meteors.length; k++) {
            temp_meteors[k].destroyMeteor();
            temp_meteors[k] = null;
        }
        Meteors = clearArray(temp_meteors);


        self.score = 0;
        enemySpawnDelayCounter = 0;
        meteorSpawnDelayCounter = 0;

        self.$gameOverWrapper.style.display = "none";
        newPlayerCar.$elem.style.background = "url(\'images/player.png\') no-repeat";
        self.$homeScreen.style.display = "block";

    };

    var addNewContainer = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "container-wrapper";
        self.$parent.appendChild(self.$elem);

        addScoreWrapper();
    };

    var verticalBackgroundPosition = 1;
    var updateBackgroundPosition = function () {
        verticalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        self.$elem.style.backgroundPosition = "0 " + verticalBackgroundPosition + "px";

    };

    var newPlayerCar;
    var createPlayerCar = function () {
        newPlayerCar = new PlayerCar({
            x: CONTAINER_LEFT + CAR_WIDTH,
            y: CONTAINER_BOTTOM - PLAYER_CAR_HEIGHT,
            $parent: self.$elem
        });

        newPlayerCar.init();
    };

    var createEnemyCar = function () {

        var enemyCar = new EnemyCar({
            $parent: self.$elem,
            score: self.score
        });

        enemyCar.init();
        return enemyCar;
    };

    var updateEnemyCars = function () {

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

    var createMeteor = function () {

        var meteor = new Meteor({
            $parent: self.$elem,
            score: self.score
        });

        meteor.init();
        return meteor;
    };

    var updateMeteors = function () {

        var temp_meteors = Meteors;

        for (var i = 0; i < temp_meteors.length; i++) {
            temp_meteors[i].updatePosition();

            if (checkCarCollision(temp_meteors[i], newPlayerCar)) {
                gameOver();
            }

            if (temp_meteors[i].y > CONTAINER_BOTTOM) {
                temp_meteors[i].destroyMeteor();
                temp_meteors[i] = null
            }
        }
        Meteors = clearArray(temp_meteors);
    };


    var createNewBullet = function () {
        var newBullet = new Bullet({
            $parent: self.$elem,
            x: newPlayerCar.x + CAR_WIDTH / 2 - BULLET_WIDTH / 2, //setting the bullet position middle of the car
            y: newPlayerCar.y - BULLET_HEIGHT
        });

        newBullet.init();
        playBulletSound();
        return newBullet;
    };

    var updateBullets = function () {

        var temp_bullets = Bullets;
        for (var i = 0; i < temp_bullets.length; i++) {

            if (temp_bullets[i] !== null) {

                temp_bullets[i].updatePosition();

                //remove bullet
                if (temp_bullets[i].y < CONTAINER_TOP - BULLET_HEIGHT) {
                    temp_bullets[i].destroyBullet();
                    temp_bullets[i] = null;
                    return;
                }

                var tempX = temp_bullets[i].x;
                var tempY = temp_bullets[i].y;
                if (EnemyCars.length) {
                    EnemyCars.forEach(function (car) {
                        if (checkBulletCollision(car, temp_bullets[i])) {
                            createSmallExplosion(tempX, tempY);
                            temp_bullets[i].destroyBullet();
                            temp_bullets[i] = null;

                            //check if enemy health is zero
                            if (car.destroyEnemyCar()) {
                                createBigExplosion(tempX, tempY);
                                EnemyCars.splice(EnemyCars.indexOf(car), 1);
                                playExplosionSound();
                            }
                        }

                    });
                }

                if (Meteors.length) {
                    Meteors.forEach(function (meteor) {
                        if (checkBulletCollision(meteor, temp_bullets[i])) {
                            createSmallExplosion(tempX, tempY);
                            temp_bullets[i].destroyBullet();
                            temp_bullets[i] = null;
                        }

                    });
                }
            }
        }
        Bullets = clearArray(temp_bullets);

    };

    var createSmallExplosion = function (bulletX, bulletY) {
        var x = bulletX - SMALL_EXPLOSION_WIDTH/2;
        var y = bulletY;
        var smallExplosion = new Explosion({
            x: x,
            y: y,
            $parent: self.$elem
        });
        smallExplosion.createSmallExplosion();
    };

    var createBigExplosion = function (bulletX, bulletY) {
        var OFFSET = 20;
        var x = bulletX - BIG_EXPLOSION_WIDTH/2;
        var y = bulletY - OFFSET;
        var bigExplosion = new Explosion({
            x: x,
            y: y,
            $parent: self.$elem
        });
        bigExplosion.createBigExplosion();
    };

    var createPlayerExplosion = function (playerX, playerY) {
        var x = playerX;
        var y = playerY;
        var playerExplosion = new Explosion({
            x: x,
            y: y,
            $parent: self.$elem
        });
        playerExplosion.createPlayerExplosion();
    };

    var checkBulletCollision = function (enemyCar, bullet) {

        if (bullet === null) { //TODO
            return;
        }

        if (bullet.y < enemyCar.top && (bullet.x >= enemyCar.x && bullet.x <= enemyCar.x + CAR_WIDTH)) {
            return true;
        }
    };

    var checkCarCollision = function (enemy, playerCar) {
        if (enemy.top > playerCar.y && (enemy.x + CAR_WIDTH > playerCar.x && enemy.x < playerCar.x + CAR_WIDTH)) {
            playCarExplosionSound();
            return true;
        }
    };

    var addScoreWrapper = function () {
        self.$scoreWrapper = document.createElement("div");
        self.$scoreWrapper.className = "score-wrapper";
        self.$elem.appendChild(self.$scoreWrapper);

        self.$score = document.createElement("span");
        self.$score.style.display = "block";
        self.$scoreWrapper.appendChild(self.$score);

        updateScore();
    };

    var updateScore = function () {
        self.score += SCORE_UPDATE_SPEED;
        self.$score.innerHTML = Math.floor(self.score);
    };

    var keyDownHandler = function (event) {
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

    var gameOver = function () {
        playGameOverSound();
        createPlayerExplosion(newPlayerCar.x, newPlayerCar.y);
        clearInterval(self.interval);
        gameStatus = false;
        newPlayerCar.$elem.style.background = "url(\'images/playerDamaged.png\') no-repeat";
        self.$gameOverWrapper.style.display = "block";
        self.$finalScore.innerHTML = Math.floor(self.score);

        self.$gameOverWrapper.onmousedown = function () {
            playKeySound();
            reset();
        };
    };


    //Sound Functions
    var playStartSound = function () {
        self.startSound = document.createElement("audio");
        self.startSound.src = "sounds/start.wav";
        self.startSound.play();
    };

    var playBulletSound = function () {
        self.bulletSound = document.createElement("audio");
        self.bulletSound.src = "sounds/shoot.wav";
        self.bulletSound.play();
    };

    var playGameOverSound = function () {
        self.gameOverSound = document.createElement("audio");
        self.gameOverSound.src = "sounds/dead.mp3";
        self.gameOverSound.play();
    };

    var playExplosionSound = function () {
        self.explosionSound = document.createElement("audio");
        self.explosionSound.src = "sounds/explosion.wav";
        self.explosionSound.play();
    };

    var playCarExplosionSound = function () {
        self.carExplosionSound = document.createElement("audio");
        self.carExplosionSound.src = "sounds/carExplosion.wav";
        self.carExplosionSound.play();
    };

    var playKeySound = function () {
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
        self.top = self.y + ENEMY_CAR_HEIGHT;
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


//***********************Meteor Class Definition*************
function Meteor(props) {
    var self = this;
    self.x = 0;
    self.y = CONTAINER_TOP - METEOR_HEIGHT;
    self.dx = props.dx || 0;
    self.dy = props.dy || 0;
    self.$parent = props.$parent;
    self.score = props.score;


    self.init = function () {
        addNewMeteor();
        plotPosition();
    };

    var meteorSpeed = 1;
    self.updatePosition = function () {
        //increase speed with score
        meteorSpeed = Math.floor(self.score / 100) + 4;
        self.y = self.y + meteorSpeed;
        self.top = self.y + METEOR_HEIGHT;
        plotPosition();
    };

    self.destroyMeteor = function () {
        self.$elem.remove();

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

    var addNewMeteor = function () {
        self.$elem = document.createElement("div");
        self.$elem.className = "car meteor";
        self.$parent.appendChild(self.$elem);
    };


}


//**********************Explosion Class Definition**************

function Explosion(props) {

    var self = this;
    self.x = props.x;
    self.y = props.y;
    self.$parent = props.$parent;


    self.createSmallExplosion = function () {
        self.$smallElem = document.createElement("div");
        self.$smallElem.className = "small-explosion";
        self.$parent.appendChild(self.$smallElem);

        plotSmallExplosionPosition();

        setTimeout(destroySmallExplosion, EXPLOSION_TIMEOUT);
    };

    self.createBigExplosion = function () {
        self.$bigElem = document.createElement("div");
        self.$bigElem.className = "big-explosion";
        self.$parent.appendChild(self.$bigElem);

        plotBigExplosionPosition();

        setTimeout(destroyBigExplosion, EXPLOSION_TIMEOUT);
    };

    self.createPlayerExplosion = function () {
        self.$playerElem = document.createElement("div");
        self.$playerElem.className = "player-explosion";
        self.$parent.appendChild(self.$playerElem);
        plotPlayerExplosionPosition();

        setTimeout(destroyPlayerExplosion, EXPLOSION_TIMEOUT);
    };


    var plotSmallExplosionPosition = function () {
        self.$smallElem.style.left = self.x + "px";
        self.$smallElem.style.top = self.y + "px";
    };


    var plotBigExplosionPosition = function () {
        self.$bigElem.style.left = self.x + "px";
        self.$bigElem.style.top = self.y + "px";
    };

    var plotPlayerExplosionPosition = function () {
        self.$playerElem.style.left = self.x + "px";
        self.$playerElem.style.top = self.y + "px";
    };

    var destroySmallExplosion = function () {
        self.$smallElem.remove();
    };

    var destroyBigExplosion = function () {
        self.$bigElem.remove();
    };

    var destroyPlayerExplosion = function () {
        self.$playerElem.remove();
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

