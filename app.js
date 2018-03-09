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
const contain = require('./src/util/contain')

let bump = new Bump(PIXI)
let charm = new Charm(PIXI)

const renderer = PIXI.autoDetectRenderer(512, 512);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

PIXI.loader
    .add('cat', './src/asset/cat.png')
    .add('bullet', './src/asset/circle1.png')
    .add('block', "./src/asset/09.png")
    .load(setup);
let stage = new PIXI.Container();

let speed = 1
let cat
let bullets = []

function setup(loader, resources) {
    cat = new PIXI.Sprite(resources.cat.texture)
    bullet = new PIXI.Sprite(resources.bullet.texture)

    cat.anchor.set(0.5, 0.5)
    cat.position.set(96)
    cat.scale.set(0.5);
    cat.vx = 0;
    cat.vy = 0;
    cat.facing = 'up'

    stage.addChild(cat);
    bindKey()

    gameLoop()

    function bindKey() {
        let left = keyboard(window, 37),
            up = keyboard(window, 38),
            right = keyboard(window, 39),
            down = keyboard(window, 40);
        let shoot = keyboard(window, 90)
        move()
        shoot.press = function () {
            let bullet = new PIXI.Sprite(resources.bullet.texture)
            bulletShoot(bullet, cat.facing)
        }

        function move() {
            left.press = function () {
                cat.vx = -speed;
                cat.facing = 'left'
                cat.rotation = arc(-90);
            };
            left.release = function () {
                if (!right.isDown) {
                    cat.vx = 0;
                }
            };
            up.press = function () {
                cat.vy = -speed;
                cat.rotation = 0
                cat.facing = 'up'

            };
            up.release = function () {
                if (!down.isDown) {
                    cat.vy = 0;
                }
            };
            right.press = function () {
                cat.vx = speed;
                cat.rotation = arc(90);
                cat.facing = 'right'

            };
            right.release = function () {
                if (!left.isDown) {
                    cat.vx = 0;
                }
            };
            down.press = function () {
                cat.vy = speed;
                cat.rotation = arc(180);
                cat.facing = 'down'

            };
            down.release = function () {
                if (!up.isDown) {
                    cat.vy = 0;
                }
            };
        }

        function arc(angle) {
            return angle / 360 * 2 * Math.PI
        }
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    play();
    bullets.forEach(bullet => {
        bullet.y += bullet.vy
        bullet.x += bullet.vx;
    })
    renderer.render(stage);
}

function play() {
    let hem = contain(cat, {x: 28, y: 10, width: 488, height: 480})
    if (!hem) {
        cat.y += cat.vy
        cat.x += cat.vx;
    }
}

function bulletShoot(bullet, direction) {
    bullet.position.set(cat.x, cat.y)
    if (direction === 'left') {
        bullet.vx = -5
        bullet.vy = 0;
    }
    if (direction === 'right') {
        bullet.vx = 5
        bullet.vy = 0;
    }
    if (direction === 'up') {
        bullet.vy = -5
        bullet.vx = 0
    }
    if (direction === 'down') {
        bullet.vy = 5
        bullet.vx = 0
    }

    bullets.push(bullet)
    stage.addChild(bullet);
}

// function addBomb() {
//     let bomb = new PIXI.Sprite(
//         PIXI.loader.resources['./src/asset/circle1.png'].texture
//     )
//     bomb.position.set(Math.random() * 512, Math.random() * 512)
//     charm.slide(bomb, 256, 256, 120);
//     bombs.push(bomb)
//     stage.addChild(bomb);
// }
