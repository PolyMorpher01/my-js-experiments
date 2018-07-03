const $mainWrapper = document.getElementById("main-wrapper");
const $homeScreen = document.getElementById("home-screen");
const $gameOverWrapper = document.getElementById("game-over-wrapper");
var $finalScore = document.getElementById("final-score");

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



var container;
function createContainer() {
    container = new Container({
        $parent: $mainWrapper
    });
    container.init();
}

createContainer();

$homeScreen.onclick = () => {
    $homeScreen.style.display = "none";
    container.startGame();
};

$gameOverWrapper.onclick = ()=>{
  container.reset();
};


//****************Container Class Definition*******************
function Container(props) {
    var self = this;

    self.$parent = props.$parent;
    self.score = 0;

    var pipePairs = [];
    var gameStatus = false;

    self.init = () => {
        createContainer();
        document.onkeydown = keyDownHandler;
    };


    self.startGame = () => {
        gameStatus = true;

        let pipeInitialLeftPosition = CONTAINER_RIGHT;
        let pipePairSpawnCounter = 0;

        createBird();
        addScoreWrapper();
        self.interval = setInterval(() => {
            updateBackgroundPosition();

            pipePairSpawnCounter++;
            if (pipePairSpawnCounter > PIPE_SPAWN_DELAY) {
                pipeInitialLeftPosition += PIPE_SPAWN_GAP;
                pipePairs.push(createPipes(pipeInitialLeftPosition));
                pipePairSpawnCounter = 0;
            }

            if (pipePairs.length) {
                updatePipePairs();
            }

            if (pipePairs.length) {
                if (checkCollision()) {
                    gameOver();
                }
            }
            updateBird();


        }, GAME_LOOP_INTERVAL)

    };

    self.reset = () => {
        console.log(pipePairs.length);
        var pipePairs_temp = pipePairs;
        for (let pipePair of pipePairs_temp) {
            pipePair.destroyPipePair();
            pipePairs_temp[pipePairs_temp.indexOf(pipePair)] = null;
        }

        pipePairs = clearArray(pipePairs_temp);

        horizontalBackgroundPosition = 0;
        self.score = 0;

        console.log(pipePairs.length);
        self.$elem.remove();
        $gameOverWrapper.style.display = "none";
        self.$scoreWrapper.style.display = "none";
        $homeScreen.style.display = "block";

        createContainer();
    };

    const createContainer = () => {
        self.$elem = document.createElement("div");
        self.$elem.className = "container-wrapper";
        self.$parent.appendChild(self.$elem);
    };

    const createPipes = (x) => {
        let pipePair = new PipePair({
            x: x,
            $parent: self.$elem
        });
        pipePair.init();
        return pipePair;
    };

    const updatePipePairs = () => {
        for (let pipe of pipePairs) {
            pipe.updatePipePair();

            if (pipe.x < CONTAINER_LEFT - PIPE_WIDTH) {
                pipe.destroyPipePair();
                pipePairs.splice(pipePairs.indexOf(pipe), 1);
            }

        }
    };

    var newBird;
    const createBird = () => {
        newBird = new Bird({
            x: BIRD_LEFT_POSITION,
            y: BIRD_INITIAL_TOP_POSITION,
            dy: 1,
            $parent: self.$elem
        });
        newBird.init();
    };

    const updateBird = () => {
        newBird.updateBird(1, BIRD_FALL_SPEED);

        // newBird.$elem.style.transform = "rotate(25deg)";

        if (newBird.y > CONTAINER_BOTTOM - BIRD_HEIGHT || newBird.y < CONTAINER_TOP + BIRD_HEIGHT) {
            gameOver();
        }


    };


    const checkCollision = () => {
        if (newBird.x + BIRD_WIDTH > pipePairs[0].x && newBird.x < pipePairs[0].x + PIPE_WIDTH) {

            if (newBird.y < pipePairs[0].topY + PIPE_HEIGHT ||
                newBird.y + BIRD_HEIGHT > pipePairs[0].bottomY) {
                console.log("collide");
                return true;
            }

            else {
                let OFFSET = 2;
                if (newBird.x > pipePairs[0].x + PIPE_WIDTH - OFFSET) {
                    updateScore();
                }
            }
        }

    };


    const gameOver = () => {
        gameStatus = false;
        clearInterval(self.interval);
        newBird.$elem.style.background = "url(\"images/bird-dead.png\") repeat-x";
        $gameOverWrapper.style.display = "block";
        $finalScore.innerHTML = self.score;
        console.log("gameOver");
    };

    var horizontalBackgroundPosition = 0;
    const updateBackgroundPosition = () => {
        horizontalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        self.$elem.style.backgroundPosition = "-" + horizontalBackgroundPosition + "px" + " 0";
    };

    var keyDownHandler = function (event) {
        if (gameStatus === true) {
            if (event.keyCode === 32) {
                //SPACE_BAR
                // newBird.$elem.style.transform = "rotate(-25deg)";
                newBird.updateBird(-1, BIRD_JUMP_SPEED);
            }
        }
        // else {
        //     if (event.keyCode === 27) {
        //         //ESCAPE
        //         reset();
        //     }
        // }

    };


    var addScoreWrapper = function () {
        self.$scoreWrapper = document.createElement("div");
        self.$scoreWrapper.className = "score-wrapper";
        self.$elem.appendChild(self.$scoreWrapper);

        self.$score = document.createElement("span");
        self.$scoreWrapper.appendChild(self.$score);

        self.$scoreWrapper.style.display = "block";
        self.$score.innerHTML = self.score;
    };

    const updateScore = () => {
        self.score++;
        self.$score.innerHTML = self.score;
    };
}


//**************Bird Class Definition*****************
function Bird(props) {
    var self = this;

    self.x = props.x;
    self.y = props.y;
    self.dy = props.dy;

    self.$parent = props.$parent;


    self.init = () => {
        createBird();
        plotPosition();
    };

    const createBird = () => {
        self.$elem = document.createElement("div");
        self.$elem.className = "bird";
        self.$parent.appendChild(self.$elem);
    };

    const plotPosition = () => {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };

    self.updateBird = (dy, speed) => {
        self.y = self.y + dy * speed;
        plotPosition();
    };

    self.destroyBird = () => {
        self.$elem.remove();
    };

}


//****************PipePair Class Definition****************

function PipePair(props) {

    var self = this;


    self.x = props.x;
    self.$parent = props.$parent;

    self.topY = getRandom(-200, 0);
    self.bottomY = PIPE_SPACE + self.topY;

    self.init = () => {
        createPipePair();
    };


    var pipeTop;
    var pipeBottom;
    const createPipePair = () => {
        pipeTop = new Pipe({
            x: self.x,
            y: self.topY,
            $parent: self.$parent,
            type: "top"
        });
        pipeTop.init();

        pipeBottom = new Pipe({
            x: self.x,
            y: self.bottomY,
            $parent: self.$parent,
            type: "down"
        });
        pipeBottom.init();
    };


    self.updatePipePair = () => {
        self.x = pipeTop.updatePipe();
        self.leftOfGap = self.x;
        pipeBottom.updatePipe();
    };


    self.destroyPipePair = () => {
        pipeTop.destroyPipe();
        pipeBottom.destroyPipe();
    }

}


//****************Pipe Class Definition****************
function Pipe(props) {
    var self = this;

    self.x = props.x;
    self.y = props.y;
    self.type = props.type || "down";
    self.$parent = props.$parent;

    self.init = () => {
        addPipe();
        plotPosition();
    };

    const addPipe = () => {
        self.$elem = document.createElement("div");
        self.$elem.className = "pipe";
        if (self.type === "top") self.$elem.style.transform = "rotate(180deg)";
        self.$parent.appendChild(self.$elem);

        plotPosition();
    };

    self.updatePipe = () => {
        self.x = self.x - BACKGROUND_UPDATE_SPEED;
        plotPosition();
        return self.x;
    };

    self.destroyPipe = () => {
        self.$elem.remove();
    };

    const plotPosition = () => {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };

}


//**************Function Definitions******************
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function clearArray(input) {
    var temp = [];
    for (let value of input) {
        if (value !== null) {
            (temp).push(value);
        }
    }
    return temp;
}
