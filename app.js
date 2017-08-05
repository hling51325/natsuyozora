const PIXI = require('pixi.js')
//Aliases
const {
    Container,
    autoDetectRenderer,
    loader,
    resources,
    Sprite,
    Rectangle,
    Graphics,
    Text,
    utils
} = PIXI
const TextureCache = utils.TextureCache

const keyboard = require('./src/util/keyboard')
const Bump = require('./src/util/bump')
const Charm = require('./src/util/charm')

let bump = new Bump(PIXI)
let charm = new Charm(PIXI)

const renderer = PIXI.autoDetectRenderer(512, 512);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

PIXI.loader
    .add('./src/asset/cat.png')
    .add('./src/asset/circle1.png')
    .add("./src/asset/09.png")
    .load(setup);
var stage = new PIXI.Container();

let cat
let state
let message
let box
let bomb = new PIXI.Sprite(
    PIXI.loader.resources['./src/asset/circle1.png'].texture
)
let bombs = []

function setup() {
    //Create the `cat` sprite from the texture
    cat = new PIXI.Sprite(
        PIXI.loader.resources['./src/asset/cat.png'].texture
    );

    setInterval(() => addBomb(), 500)
    //Create the `tileset` sprite from the texture
    // var texture = TextureCache["./src/asset/09.png"];
    // var rectangle = new Rectangle(0, 0, 32, 32);
    //
    // texture.frame = rectangle;
    //
    // //Create the sprite from the texture
    // var rocket = new Sprite(texture);
    //
    // //Position the rocket sprite on the canvas
    // rocket.x = 32;
    // rocket.y = 32;
    //
    // //Add the rocket to the stage
    // stage.addChild(rocket);

    cat.position.set(96)

    cat.scale.set(0.5);
    // cat.rotation = 0.5;
    // cat.anchor.set(0.5, 0.5)
    //Add the cat to the stage
    cat.vx = 0;
    cat.vy = 0;


    // box = new Graphics();
    // box.lineStyle(4, 0xFF3300, 1);
    // box.beginFill(0x66CCFF);
    // box.drawRect(0, 0, 64, 64);
    // box.endFill();
    // box.x = 170;
    // box.y = 170;
    // stage.addChild(box);

    message = new Text(
        "Hello Pixi!",
        {fontFamily: "Arial", fontSize: 32, fill: "white"}
    );

    message.position.set(54, 96);
    stage.addChild(message);

    stage.addChild(cat);
    bindKey()

    state = play;

    // contain(cat, {x: 28, y: 10, width: 192, height: 192});

    //Render the stage
    gameLoop()
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    state();
    charm.update();

    renderer.render(stage);
}

function play() {

    cat.x += cat.vx;
    cat.y += cat.vy

    message.text = "No collision...";

    bombs.forEach(bomb => {
        if (bump.hitTestRectangle(cat, bomb)) {
            message.text = "hit!";
        }
    })

}

function bindKey() {
    var left = keyboard(window, 37),
        up = keyboard(window, 38),
        right = keyboard(window, 39),
        down = keyboard(window, 40);

    //Left arrow key `press` method
    left.press = function () {
        //Change the cat's velocity when the key is pressed
        cat.vx = -5;
        // cat.vy = 0;
    };

    //Left arrow key `release` method
    left.release = function () {

        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown) {
            cat.vx = 0;
        }
    };

    //Up
    up.press = function () {
        cat.vy = -5;
        // cat.vx = 0;
    };
    up.release = function () {
        if (!down.isDown) {
            cat.vy = 0;
        }
    };

    //Right
    right.press = function () {
        cat.vx = 5;
        // cat.vy = 0;
    };
    right.release = function () {
        if (!left.isDown) {
            cat.vx = 0;
        }
    };

    //Down
    down.press = function () {
        cat.vy = 5;
        // cat.vx = 0;
    };
    down.release = function () {
        if (!up.isDown) {
            cat.vy = 0;
        }
    };
}

function addBomb() {

    console.log('add bomb')
    let bomb = new PIXI.Sprite(
        PIXI.loader.resources['./src/asset/circle1.png'].texture
    )

    bomb.position.set(Math.random() * 512, Math.random() * 512)

    charm.slide(bomb, 256, 256, 120);
    bombs.push(bomb)
    stage.addChild(bomb);
}
