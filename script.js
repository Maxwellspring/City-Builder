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
        console.log(event.target.value);
        changeTile = parseInt(event.target.value);
        return changeTile;
    });

    this.input.on('pointerdown', (pointer) => {
        // Get the tile coordinates from the pointer's world position
        const tileX = map.worldToTileX(pointer.worldX);
        const tileXp1 = map.worldToTileX(pointer.worldX + 1);
        const tileXm1 = map.worldToTileX(pointer.worldX - 1);
        const tileY = map.worldToTileY(pointer.worldY);
        const tileYp1 = map.worldToTileY(pointer.worldY + 1);
        const tileYm1 = map.worldToTileY(pointer.worldY - 1);

        // get the clicked tile location
        const clickedTile = layer.getTileAt(tileX, tileY);


        if (tileX > 14 || tileY > 14) {
            console.log("Out of bounds");
            return;
        }
        console.log(`Clicked tile coordinates: (${tileX}, ${tileY})`);
        if (clickedTile) {
            // clickedTile.rotation += Phaser.Math.DegToRad(90); // this is how you rotate
            console.log(`Tile index: ${clickedTile.index}`);
            console.log(changeTile)
            if (changeTile == 20) {
                console.log("Road placed " + clickedTile + " " + tileX + " " + tileY);
                if (layer.getTileAt(tileX, tileY + 1).index == 20) {
                    console.log("road below");
                } else {
                    console.log("no road below");
                }
            
            }
            layer.putTilesAt([[changeTile]], tileX, tileY); // change tile to selected tile
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