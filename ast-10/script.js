const $mainWrapper = document.getElementById("main-wrapper");
const $homeScreen = document.getElementById("home-screen");
const $gameOverWrapper = document.getElementById("game-over-wrapper");
const $finalScore = document.getElementById("final-score");

const CONTAINER_LEFT = 0;
const CONTAINER_RIGHT = 864;
const CONTAINER_BOTTOM = 512;
const CONTAINER_TOP = 0;

const BIRD_HEIGHT = 24;
const BIRD_WIDTH = 34;
const BIRD_LEFT_POSITION = 150;
const BIRD_INITIAL_TOP_POSITION = 100;
const BIRD_JUMP_SPEED = 5;
const BIRD_FALL_SPEED = 6;

const PIPE_WIDTH = 52;
const PIPE_SPACE = 400 + BIRD_HEIGHT;
const PIPE_SPAWN_GAP = 60;
const PIPE_SPAWN_DELAY = 80;
const PIPE_HEIGHT = 320;

const GAME_LOOP_INTERVAL = 50;
const BACKGROUND_UPDATE_SPEED = 5;
//************Global Variable Declaration Ends here*******************


//****************Pipe Class Definition****************
class Pipe {

    constructor(x, y, $parent, type = "down") {
        this.x = x;
        this.y = y;
        this.type = type;
        this.$parent = $parent;
    }


    init() {
        this.addPipe();
        this.plotPosition();
    }

    addPipe() {
        this.$elem = document.createElement("div");
        this.$elem.className = "pipe";
        if (this.type === "top") this.$elem.style.transform = "rotate(180deg)";
        this.$parent.appendChild(this.$elem);

        this.plotPosition();
    }

    updatePipe() {
        this.x = this.x - BACKGROUND_UPDATE_SPEED;
        this.plotPosition();
        return this.x;
    }

    destroyPipe() {
        this.$elem.remove();
    }

    plotPosition() {
        this.$elem.style.left = this.x + "px";
        this.$elem.style.top = this.y + "px";
    };

}

//****************PipePair Class Definition****************

class PipePair {


    constructor(x, $parent) {
        this.x = x;
        this.$parent = $parent;
    }


    init() {
        this.topY = getRandom(-200, 0);
        this.bottomY = PIPE_SPACE + this.topY;
        this.createPipePair();
    }


    createPipePair() {
        this.pipeTop = new Pipe(this.x, this.topY, this.$parent, "top");
        this.pipeTop.init();

        this.pipeBottom = new Pipe(this.x, this.bottomY, this.$parent, "down");
        this.pipeBottom.init();
    }


    updatePipePair() {
        this.x = this.pipeTop.updatePipe();
        this.pipeBottom.updatePipe();
    }


    destroyPipePair() {
        this.pipeTop.destroyPipe();
        this.pipeBottom.destroyPipe();
    }

}


//**************Bird Class Definition*****************
class Bird {

    constructor(x, y, dy, $parent) {
        this.x = x;
        this.y = y;
        this.dy = dy;
        this.$parent = $parent;
    }


    init() {
        this.createBird();
        this.plotPosition();

        this.birdRiseMargin = 0;
        this.speed = 0;
        this.angle = 0;
    };

    createBird() {
        this.$elem = document.createElement("div");
        this.$elem.className = "bird";
        this.$parent.appendChild(this.$elem);
    }


    plotPosition() {
        this.$elem.style.left = this.x + "px";
        this.$elem.style.top = this.y + "px";
    }


    updateBirdPosition() {
        if (this.birdRiseMargin > 0) {

            this.dy = -1;
            this.birdRiseMargin--;

            if (this.birdRiseMargin === 0)
                this.speed = 1;
            else
                this.speed = BIRD_JUMP_SPEED;


            if (this.angle >= -90)
                this.angle -= 5;
        }

        else {

            this.dy = 1;

            if (this.speed < BIRD_FALL_SPEED) {
                this.speed += 2;
            }


            if (this.angle <= 90)
                this.angle += 5;

            this.$elem.style.background = "url(\"images/bird-up-flap.png\") no-repeat";
        }

        this.y = this.y + this.dy * this.speed;
        this.rotateBird();
        this.plotPosition();
    }


    renderBirdJump() {
        this.$elem.style.background = "url(\"images/bird-down-flap.png\") no-repeat";
        this.birdRiseMargin = 10;
    }


    rotateBird() {
        if (this.dy === 1) {
            this.$elem.style.transform = "rotate(" + this.angle + "deg)";
        }
        else {
            this.$elem.style.transform = "rotate(" + this.angle + ")";
        }
    }

    destroyBird() {
        this.$elem.remove();
    }

}


//****************Container Class Definition*******************
class Container {


    constructor($homeScreen, $gameOverWrapper, $parent) {

        this.$homeScreen = $homeScreen;
        this.$gameOverWrapper = $gameOverWrapper;
        this.$parent = $parent;
    }

    init() {
        this.createContainer();
        document.onkeydown = this.keyDownHandler.bind(this);

        this.score = 0;
        this.pipePairs = [];
        this.gameStatus = false;
        this.horizontalBackgroundPosition = 0;
    };


    startGame() {
        this.gameStatus = true;

        let pipeInitialLeftPosition = CONTAINER_RIGHT;
        let pipePairSpawnCounter = 0;

        this.createBird();
        this.addScoreWrapper();

        this.$elem.onclick = ()=>{
            this.newBird.renderBirdJump();
        };


        const FPS = 30;

        this.gameLoop = () => {
            setTimeout(() => { //throttle speed of animation

                this.animate = window.requestAnimationFrame(this.gameLoop);

                this.updateBackgroundPosition();

                pipePairSpawnCounter++;
                if (pipePairSpawnCounter > PIPE_SPAWN_DELAY) {
                    pipeInitialLeftPosition += PIPE_SPAWN_GAP;
                    this.pipePairs.push(this.createPipes(pipeInitialLeftPosition));
                    pipePairSpawnCounter = 0;
                }

                if (this.pipePairs.length) {
                    this.updatePipePairs();
                }

                if (this.pipePairs.length) {
                    if (this.checkCollision()) {
                        this.gameOver();
                    }
                }


                this.updateBird();


            }, 1000 / FPS);

        };


        window.requestAnimationFrame(this.gameLoop);

    };


    reset() {
        let pipePairs_temp = this.pipePairs;
        for (let pipePair of pipePairs_temp) {
            pipePair.destroyPipePair();
            pipePairs_temp[pipePairs_temp.indexOf(pipePair)] = null;
        }

        this.pipePairs = clearArray(pipePairs_temp);

        this.horizontalBackgroundPosition = 0;
        this.score = 0;
        this.$elem.remove();
        this.newBird.destroyBird();
        this.$gameOverWrapper.style.display = "none";
        this.$scoreWrapper.style.display = "none";
        this.$homeScreen.style.display = "block";

        this.createContainer();
    }


    createContainer() {
        this.$elem = document.createElement("div");
        this.$elem.className = "container-wrapper";
        this.$parent.appendChild(this.$elem);
    }

    createPipes(x) {
        let pipePair = new PipePair(x, this.$elem);
        pipePair.init();
        return pipePair;
    }


    updatePipePairs() {
        for (let pipe of this.pipePairs) {
            pipe.updatePipePair();

            if (pipe.x < CONTAINER_LEFT - PIPE_WIDTH) {
                pipe.destroyPipePair();
                this.pipePairs.shift();
            }

        }
    }


    createBird() {
        this.newBird = new Bird(BIRD_LEFT_POSITION, BIRD_INITIAL_TOP_POSITION, 1, this.$elem);
        this.newBird.init();
    }


    updateBird() {

        this.newBird.updateBirdPosition();

        if (this.newBird.y > CONTAINER_BOTTOM - BIRD_HEIGHT || this.newBird.y < CONTAINER_TOP + BIRD_HEIGHT) {
            this.gameOver();
        }


    }


    checkCollision() {
        if (this.newBird.x + BIRD_WIDTH > this.pipePairs[0].x && this.newBird.x < this.pipePairs[0].x + PIPE_WIDTH) {

            if (this.newBird.y < this.pipePairs[0].topY + PIPE_HEIGHT ||
                this.newBird.y + BIRD_HEIGHT > this.pipePairs[0].bottomY) {
                return true;
            }

            else {
                const OFFSET = 2;
                if (this.newBird.x > this.pipePairs[0].x + PIPE_WIDTH - OFFSET) {
                    this.updateScore();
                }
            }
        }

    }


    addScoreWrapper() {
        this.$scoreWrapper = document.createElement("div");
        this.$scoreWrapper.className = "score-wrapper";
        this.$elem.appendChild(this.$scoreWrapper);

        this.$scoreWrapper.style.display = "block";
        this.scoreBackground = "url(\"images/0.png\") no-repeat";
        this.$scoreWrapper.style.background = this.scoreBackground;
    }


    updateScore() {
        this.score++;

        //split numbers
        let digits = [];
        let tempScore = this.score;
        while (tempScore > 0) {
            digits.push(tempScore % 10);
            tempScore = Math.floor(tempScore / 10);
        }

        this.scoreBackground = '';
        const SCORE_SPACE = 25;
        let scoreLeft = 0;
        for (let i = digits.length - 1; i >= 0; i--) {
            this.scoreBackground += "url(\"images/" + digits[i] + ".png\") no-repeat " + scoreLeft + "px" + " 0";
            if (i !== 0) {
                scoreLeft += SCORE_SPACE;
                this.scoreBackground += ",";
            }
        }

        this.$scoreWrapper.style.background = this.scoreBackground;

    }


    gameOver() {
        this.gameStatus = false;
        window.cancelAnimationFrame(this.animate);
        this.newBird.$elem.style.background = "url(\"images/bird-dead.png\")";
        this.$gameOverWrapper.style.display = "block";
        $finalScore.style.background = this.scoreBackground;
    }


    updateBackgroundPosition() {
        this.horizontalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        this.$elem.style.backgroundPosition = "-" + this.horizontalBackgroundPosition + "px" + " 0";
    }

    keyDownHandler(event) {
        if (this.gameStatus === true) {
            if (event.keyCode === 32) {
                //SPACE_BAR
                this.newBird.renderBirdJump();
            }

        }
    }
}

//*************Game Class Definition*******************
class Game {

    constructor($homeScreen, $gameOverWrapper, $parent) {
        this.$homeScreen = $homeScreen;
        this.$gameOverWrapper = $gameOverWrapper;
        this.$parent = $parent;
    }


    init() {
        this.createContainer();
        this.addClickEvents();
    }

    createContainer() {
        this.container = new Container(this.$homeScreen, this.$gameOverWrapper, this.$parent);
        this.container.init();
    }


    addClickEvents() {
        this.$homeScreen.onclick = () => {
            this.$homeScreen.style.display = "none";
            this.container.startGame();
        };

        this.$gameOverWrapper.onclick = () => {
            this.container.reset();
        };
    };

}


//**************Function Definitions******************
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function clearArray(input) {
    let temp = [];
    for (let value of input) {
        if (value !== null) {
            (temp).push(value);
        }
    }
    return temp;
}


//create New Game
const newGame = new Game($homeScreen, $gameOverWrapper, $mainWrapper);

newGame.init();
