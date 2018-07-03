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
const BIRD_JUMP_SPEED = 40;
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
        this.topY = getRandom(-200, 0);
        this.bottomY = PIPE_SPACE + this.topY;
    }


    init() {
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


    updateBird(dy = 1, speed) {
        this.y = this.y + dy * speed;
        this.plotPosition();
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
        this.score = 0;
        this.pipePairs = [];
        this.gameStatus = false;
        this.horizontalBackgroundPosition = 0;
    }

    init() {
        this.createContainer();
        document.onkeydown = this.keyDownHandler.bind(this);
    };


    startGame() {
        this.gameStatus = true;

        let pipeInitialLeftPosition = CONTAINER_RIGHT;
        let pipePairSpawnCounter = 0;

        this.createBird();
        this.addScoreWrapper();

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
        this.newBird.updateBird(1, BIRD_FALL_SPEED);

        // this.newBird.$elem.style.transform = "rotate(25deg)";

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
                let OFFSET = 2;
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

        this.$score = document.createElement("span");
        this.$scoreWrapper.appendChild(this.$score);

        this.$scoreWrapper.style.display = "block";
        this.$score.innerHTML = this.score;
    }


    updateScore() {
        this.score++;
        this.$score.innerHTML = this.score;
    }


    gameOver() {
        this.gameStatus = false;
        window.cancelAnimationFrame(this.animate);
        this.newBird.$elem.style.background = "url(\"images/bird-dead.png\")";
        this.$gameOverWrapper.style.display = "block";
        $finalScore.innerHTML = this.score;
    }


    updateBackgroundPosition() {
        this.horizontalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        this.$elem.style.backgroundPosition = "-" + this.horizontalBackgroundPosition + "px" + " 0";
    }

    keyDownHandler(event) {
        if (this.gameStatus === true) {
            if (event.keyCode === 32) {
                //SPACE_BAR
                console.log(event.keyCode);
                // this.newBird.$elem.style.transform = "rotate(-25deg)";
                this.newBird.updateBird(-1, BIRD_JUMP_SPEED);
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
