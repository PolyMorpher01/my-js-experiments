const $mainWrapper = document.getElementById("main-wrapper");


const CONTAINER_LEFT = 0;
const CONTAINER_RIGHT = 864;
const BIRD_HEIGHT = 24;
const BIRD_WIDTH = 34;
const PIPE_WIDTH = 52;
const PIPE_GAP = 400 + BIRD_HEIGHT * 2;
const PIPE_SPAWN_GAP = 50;

var GAME_LOOP_INTERVAL = 100;
var BACKGROUND_UPDATE_SPEED = 4;
var PIPE_SPAWN_DELAY = 50;


var container = new Container({
    $parent: $mainWrapper
});
container.init();
container.startGame();

function Container(props) {
    var self = this;

    self.$parent = props.$parent;

    var pipePairs = [];

    self.init = () => {
        createContainer();
    };


    self.startGame = () => {
        let pipeLeftPosition = CONTAINER_RIGHT;
        let pipePairSpawnCounter = 0;

        self.interval = setInterval(() => {
            updateBackgroundPosition();

            console.log(pipePairs.length);


            pipePairSpawnCounter++;
            if (pipePairSpawnCounter > PIPE_SPAWN_DELAY) {
                pipeLeftPosition += PIPE_SPAWN_GAP;
                pipePairs.push(createPipes(pipeLeftPosition));
                pipePairSpawnCounter = 0;
            }

            if (pipePairs.length) {
                updatePipePairs();
            }

        }, GAME_LOOP_INTERVAL)

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

            if(pipe.x < CONTAINER_LEFT){
                pipe.destroyPipePair();
                pipePairs.splice(pipePairs.indexOf(pipe),1);
            }

        }
    };

    var verticalBackgroundPosition = 0;
    const updateBackgroundPosition = () => {
        verticalBackgroundPosition += BACKGROUND_UPDATE_SPEED;
        self.$elem.style.backgroundPosition = "-" + verticalBackgroundPosition + "px" + " 0";
    }
}


//****************PipePair Class Definition****************

function PipePair(props) {

    var self = this;


    self.x = props.x;
    self.$parent = props.$parent;

    self.topY = getRandom(-200, 0);
    self.bottomY = PIPE_GAP + self.topY;


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

    self.updatePipe = (x) => {
        self.x = self.x - BACKGROUND_UPDATE_SPEED;
        plotPosition();
        return self.x;
    };

    self.destroyPipe = () => {
        self.$elem.remove();
    };

    const plotPosition = (x) => {
        self.$elem.style.left = self.x + "px";
        self.$elem.style.top = self.y + "px";
    };

}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
