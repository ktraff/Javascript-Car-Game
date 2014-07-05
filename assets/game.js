//     game.js 0.0.1
//     http://opuskyrios.com
//     (c) 2014 Kyle Traff
//     Code may be freely distributed under the MIT license.


// Create the canvas.
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
// Used for coin animation.
var frameIndex = 0;
var tickCount = 0;

canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image.
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = 'assets/images/background.png';

// Car image.
var carReady = false;
var carImage = new Image();
carImage.onload = function () {
    carReady = true;
};
carImage.src = 'assets/images/player-car.svg';

// Enemy Cars.
var npcCarsReady = 0;
var numNpcCars = 15;
var npcCarImageSources = ['npc-blue.svg', 'npc-green.svg', 'npc-yellow.svg'];
var npcCars = [];
// Determines when all npc car images are loaded.
var npcCarLoaded = function () {
    if (!isNaN(npcCarsReady) && npcCarsReady >= coinImageSources.length - 1) {
        // All coins have been loaded.
        npcCarsReady = true;
    }
    else { // Increment number of total npc cars loaded.
        npcCarsReady++;
    }
};
var npcCar = function (options) {
    var that = {};

    that.context = options.context || null;
    that.x = options.x || 0;
    that.y = options.y || 0;
    that.speed = options.speed || 1;
    that.width = options.width || 32;
    that.height = options.height || 32;
    that.image = options.image;

    that.update = function () {
        that.y += that.speed;
        if (that.y > canvas.height) {
            // Move the car to the top, give it a new color
            var srcIdx = parseInt((Math.random() * 3), 10);
            that.image.src = 'assets/images/' + npcCarImageSources[srcIdx];
            that.x = 32 + 50 + ((Math.random() * 300) + 1);
            that.y = 0;
        }
    };

    that.render = function () {
        that.context.drawImage(that.image, that.x, that.y, that.width, that.height);
    };

    return that;
};
for (var i = 0; i < numNpcCars; i++) {
    var npcImage = new Image();
    npcImage.onload = npcCarLoaded;
    var srcIdx = parseInt((Math.random() * 3), 10);
    npcImage.src = 'assets/images/' + npcCarImageSources[srcIdx];
    var car = npcCar({
        context: ctx,
        x: 32 + 50 + ((Math.random() * 300) + 1),
        y: 0 - (Math.random() * 10000 +1),
        width: 32,
        height: 32,
        speed: Math.random * 500 +1,
        image: npcImage
    });
    npcCars.push(car);
}

// Coins
var coinsReady = 0;
var numCoins = 5;
var coinImageSources = ['coin_copper.png', 'coin_silver.png', 'coin_gold.png'];
var coins = [];
// Determines when all coin sprites are loaded.
var coinLoaded = function () {
    if (!isNaN(coinsReady) && coinsReady >= coinImageSources.length - 1) {
        // All coins have been loaded.
        coinsReady = true;
    }
    else { // Increment number of total coins loaded.
        coinsReady++;
    }
};
// Returns a random x coodinate on the road.
var getRoadX = function () {
    return 32 + Math.max(Math.random(), 120);
};
var getRoadY = function () {
    return 32 + (Math.random() * (canvas.height - 64));
};
// Renders a rotating coin.
function rotatingCoin (options) {
    
    var that = {},
        frameIndex = 0,
        tickCount = 0,
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.numberOfFrames || 1;
    
    that.context = options.context;
    that.x = options.x || 0;
    that.y = options.y || 0;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    
    that.update = function () {
        tickCount += 1;

        if (tickCount > ticksPerFrame) {
            tickCount = 0;
            
            // If the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {
                // Go to the next frame
                frameIndex += 1;
            } else {
                frameIndex = 0;
            }
        }
    };
    
    that.render = function () {
      // Draw the animation
      that.context.drawImage(
        that.image,
        frameIndex * that.width / numberOfFrames,
        0,
        that.width / numberOfFrames,
        that.height,
        that.x,
        that.y,
        that.width / numberOfFrames,
        that.height);
    };
    
    return that;
}
for (var i = 0; i < numCoins; i++) {
    var coinImage = new Image();
    coinImage.onload = coinLoaded;
    var srcIdx = parseInt((Math.random() * 3), 10);
    coinImage.src = 'assets/images/' + coinImageSources[srcIdx];
    var coin = rotatingCoin({
        context: ctx,
        x: 32 + 50 + ((Math.random() * 150) + 1),
        y: 32 + (Math.random() * (canvas.height - 64)),
        width: 256,
        height: 32,
        image: coinImage,
        numberOfFrames: 8,
        ticksPerFrame: 6
    });
    coins.push(coin);
}

// Game objects
var car = {
    speed: 256, // movement in pixels per second
    x: canvas.width / 2,
    y: canvas.height / 2
};
var coinsCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a coin
var reset = function () {
    car.x = canvas.width / 2;
    car.y = canvas.height / 2;

    coinsCaught = 0;
};

// Update game objects
var update = function (modifier) {
    var key;

    if (38 in keysDown) { // Player holding up
        car.y -= car.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        car.y += car.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        car.x -= car.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        car.x += car.speed * modifier;
    }

    for (key in coins) {
        coins[key].update();
    }

    for (key in npcCars) {
        npcCars[key].update();
    }

    for (key in coins) {
        var coin = coins[key];
        // Are they touching?
        if (
            car.x <= (coin.x + 24) &&
            coin.x <= (car.x + 24) &&
            car.y <= (coin.y + 24) &&
            coin.y <= (car.y + 24)
        ) {
            var value = coin.image.src.indexOf('gold')   !== -1 ? 3 :
                        coin.image.src.indexOf('silver') !== -1 ? 2 : 1;
            coinsCaught += value;

            // Change the coin's position and value.
            var srcIdx = parseInt((Math.random() * 3), 10);
            coin.image.src = 'assets/images/' + coinImageSources[srcIdx];
            coin.x = 32 + 50 + ((Math.random() * 300) + 1);
            coin.y = 32 + (Math.random() * (canvas.height - 64));
        }
    }

    // Car collisions.
    for (key in npcCars) {
        var npcCar = npcCars[key];
        // Are they touching?
        if (
            car.x <= (npcCar.x + 24) &&
            npcCar.x <= (car.x + 24) &&
            car.y <= (npcCar.y + 24) &&
            npcCar.y <= (car.y + 24)
        ) {
            reset();
        }
    }
};

// Draw everything
var render = function () {
    var key;

    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (carReady) {
        ctx.drawImage(carImage, car.x, car.y, 32, 32);
    }

    if (coinsReady) {
        for (key in coins) {
            coins[key].render();
        }
    }

    if (npcCarsReady) {
        for (key in npcCars) {
            npcCars[key].render();
        }
    }

    // Score
    ctx.fillStyle = 'rgb(250, 250, 250)';
    ctx.font = '24px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Coins: ' + coinsCaught, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
