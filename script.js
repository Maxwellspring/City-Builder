var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
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

}

function create() {
    // Add the image and set its origin to the top-left corner
    this.backgroundImage = this.add.image(0, 0, "smile").setOrigin(0, 0);

    // Scale the image to fit the game dimensions
    this.backgroundImage.displayWidth = config.width;
    this.backgroundImage.displayHeight = config.height;

    const mapData = [
        [0, 1, 0, 0, 2],
        [0, 1, 1, 0, 2],
        [0, 0, 0, 1, 2],
        [3, 3, 0, 0, 0],
        [3, 3, 0, 2, 2]
    ];

    let TILE_SIZE = 3

    const map = this.make.tilemap({
        width: 5,
        height: 5,
        tileWidth: TILE_SIZE,
        tileHeight: TILE_SIZE
    });

    const tileset = map.addTilesetImage('tilesheet', 'frown');
    const layer = map.createLayer(0, tileset, 0, 0);

    layer.setCollision([1, 2]);  // Assuming 1 and 2 are walkable tiles

}




function update() {

}