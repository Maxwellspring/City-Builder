var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }, physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

window.addEventListener('resize', resize, false);

function resize() {
    config.width = window.innerWidth;
    config.height = window.innerHeight;
    game.scale.resize(config.width, config.height);
}

var game = new Phaser.Game(config);

function preload() {
    this.load.image("smile", "media/hello.png");
    this.load.image("frown", "media/bye.png");
    this.load.image("debug", "media/debug.png");
    this.load.image("testTile", "media/5x5 tile map.png");
    this.load.image("Atlas", "media/5x5 tile map V3.png");

}

function create() {
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Add the image and set its origin to the top-left corner
    this.backgroundImage = this.add.image(0, 0, "smile").setOrigin(0, 0);

    // Scale the image to fit the game dimensions
    this.backgroundImage.displayWidth = config.width;
    this.backgroundImage.displayHeight = config.height;

    const mapData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const TILE_SIZE = 20;


    const map = this.make.tilemap({
        tileWidth: TILE_SIZE,
        tileHeight: TILE_SIZE,
        width: mapData[0].length,
        height: mapData.length
    });

    const tileset = map.addTilesetImage('frown', "Atlas", TILE_SIZE, TILE_SIZE);


    const layer = map.createBlankLayer('layer1', tileset);
    layer.putTilesAt(mapData, 0, 0); // Place tiles starting at the top-left corner
    layer.setPosition(0, 0);

    layer.setCollision([1, 2]);
    layer.setScale(3)

    let changeTile = 0;

    document.getElementById("Dropdown").addEventListener('change', function (event) {
        console.log(`Selected Value: ${event.target.value}`);
        changeTile = parseInt(event.target.value);
        return changeTile;
    });



    this.input.on('pointerdown', (pointer) => {
        // Get the tile coordinates from the pointer's world position
        const tileX = map.worldToTileX(pointer.worldX);
        const tileY = map.worldToTileY(pointer.worldY);

        // get the clicked tile location
        const clickedTile = layer.getTileAt(tileX, tileY);


        if (tileX > 14 || tileY > 14) {
            console.error("Out of bounds");
            return;
        }


        // THIS IS THE ROAD ASSEMBLY SYSTEM


        if (clickedTile) {
            // clickedTile.rotation += Phaser.Math.DegToRad(90); // this is how you rotate
            console.info(`%cLogging what is known so far: %cClicked tile index: ${clickedTile.index} | Changed into: ${changeTile} | Tile Coords (${tileX}, ${tileY}) | And now checking surroundings`, "color: darkorange;", "color: lightgreen;");
            let SurroundingTilesClick = [];
            function point(value) {
                return SurroundingTilesClick.includes(value);
            }
            let chosenRoad = 20;
            if (layer.getTileAt(tileX - 1, tileY).index >= 20) {
                console.log("%croad left", "color: lightblue;");
                SurroundingTilesClick.push("left")
            }
            if (layer.getTileAt(tileX, tileY - 1).index >= 20) {
                console.log("%croad up", "color: lightblue;");
                SurroundingTilesClick.push("up")
            }
            if (layer.getTileAt(tileX + 1, tileY).index >= 20) {
                console.log("%croad right", "color: lightblue;");
                SurroundingTilesClick.push("right")
            }
            if (layer.getTileAt(tileX, tileY + 1).index >= 20) {
                console.log("%croad down", "color: lightblue;");
                SurroundingTilesClick.push("down")
            }
            // this is the check if it will be a cross roads
            if (SurroundingTilesClick.length == 4) {
                console.log("4 objects surround");
                chosenRoad = 23;
            } else if (SurroundingTilesClick.length == 3) {
                console.log("3 objects surround");
                chosenRoad = 22;
            } else if (SurroundingTilesClick.length == 2) {
                if (point("left") && point("right") || point("up") && point("down")) {
                chosenRoad = 21;
                } else {
                    chosenRoad = 24;
                }
            } else {
                console.log("1 objects surround");
            }
            layer.putTilesAt([[chosenRoad]], tileX, tileY); // change tile to selected tile
            //this will do the changing of the surrounding tiles to be correct
            console.log("========================================================= Finshed Placing Tile, Now Checking For Updates =========================================================");
            // checking if clicking with blank or clicking with road tile
            if (changeTile == 0) {
                console.log("Checking for blank");
            }
            console.groupCollapsed("grid Info")
            for (let y = 0; y < mapData[0].length; y++) {
                for (let x = 0; x < mapData.length; x++) {
                    const tile = layer.getTileAt(x, y);
                    console.log("Check Start");
                    const SurroundingTilesCheck = [];
                    if (layer.getTileAt(x - 1, y)?.index >= 20) SurroundingTilesCheck.push("left");
                    if (layer.getTileAt(x, y - 1)?.index >= 20) SurroundingTilesCheck.push("up");
                    if (layer.getTileAt(x + 1, y)?.index >= 20) SurroundingTilesCheck.push("right");
                    if (layer.getTileAt(x, y + 1)?.index >= 20) SurroundingTilesCheck.push("down");

                    // Check if the tile's index matches the specific index
                    if (tile.index >= 20) { //  && tile.index <= 24
                        if (SurroundingTilesCheck.length == 4) {
                            // console.log("left, up, right, down");
                            chosenRoad = 23;
                            console.log(SurroundingTilesCheck);
                            layer.putTilesAt([[chosenRoad]], x, y);
                        } else if (SurroundingTilesCheck.length == 3) {
                            // console.log("left, up, right, down");
                            chosenRoad = 22;
                            console.log(SurroundingTilesCheck);
                            layer.putTilesAt([[chosenRoad]], x, y);
                        } else if (SurroundingTilesCheck.length == 2) {
                            // console.log("left, up, right, down");
                            chosenRoad = 21;
                            console.log(SurroundingTilesCheck);
                            layer.putTilesAt([[chosenRoad]], x, y);
                        }
                        console.log(`Surrounding tiles: ${SurroundingTilesCheck.join(", ")}`);
                        console.log("Check Finish");
                    }

                    // if (tile.index === 23) {
                    //     if (SurroundingTilesCheck.includes("left") &&
                    //     SurroundingTilesCheck.includes("up") &&
                    //     SurroundingTilesCheck.includes("right") &&
                    //     SurroundingTilesCheck.includes("down")) {
                    //     console.log("left, up, right, down");
                    //     chosenRoad = 23;
                    //     console.log(SurroundingTilesCheck);
                    //     layer.putTilesAt([[chosenRoad]], x, y);

                    // }
                    // layer.putTilesAt([[chosenRoad]], x, y);
                    // }
                }

            }
            console.log("Check Finish");
            console.groupEnd("Check Finish");


            // return;
            // console.log(mapData)
        }
    });

}


function update() {

}

// for the road system
// upon placing a road, it is given an ID
// when a new road is placed, it checks all the surrounding tiles for the same ID
// if it finds a road, then it inherits the road ID
// if you remove a road, it checks the surrounding tiles for roads
// if there is 0 roads, do nothing
// if there is 1 road, do nothing

// if there are 2 roads, then both roads check their surrounding tiles
// if there are 3 roads, then all 3 roads will check their surrounding tiles
// if there are 4 roads, then all 4 roads will check their surrounding tiles

// if any of the above 3 are true, do the below

// if the surrounding tiles also all have the same ID, then the seperate tiles will get a different id
// then the tiles will check their surrounding tiles, and if there are still roads, then those will also change their ID
// either the two roads will seperate, and get seperate IDs
// or they will merge into one road, and get the same ID, but have a new ID
