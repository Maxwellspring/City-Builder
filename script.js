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

// Define global constants for directions
const up = "up";
const down = "down";
const left = "left";
const right = "right";


function preload() {
    this.load.image("smile", "media/hello.png");
    this.load.image("frown", "media/bye.png");
    this.load.image("debug", "media/debug.png");
    this.load.image("testTile", "media/5x5 tile map.png");
    this.load.image("Atlas", "media/5x5 tile map V4.png");
}

function create() {
    document.addEventListener('contextmenu', event => event.preventDefault());

    this.backgroundImage = this.add.image(0, 0, "smile").setOrigin(0, 0);
    this.backgroundImage.displayWidth = config.width;
    this.backgroundImage.displayHeight = config.height;

    this.mapData = [
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

    this.TILE_SIZE = 20;

    this.map = this.make.tilemap({
        tileWidth: this.TILE_SIZE,
        tileHeight: this.TILE_SIZE,
        width: this.mapData[0].length,
        height: this.mapData.length
    });

    const tileset = this.map.addTilesetImage('frown', "Atlas", this.TILE_SIZE, this.TILE_SIZE);

    this.layer = this.map.createBlankLayer('layer1', tileset);
    this.layer.putTilesAt(this.mapData, 0, 0);
    this.layer.setPosition(0, 0);
    this.layer.setCollision([1, 2]);
    this.layer.setScale(3);

    let changeTile = 0; // This variable holds the currently selected tile from the dropdown

    document.getElementById("Dropdown").addEventListener('change', (event) => {
        console.log(`Selected Value: ${event.target.value}`);
        changeTile = parseInt(event.target.value);
    });

    // Helper function to safely get tile index, handling out of bounds
    const getTileIndex = (x, y) => {
        if (x < 0 || y < 0 || x >= this.mapData[0].length || y >= this.mapData.length) {
            return -1; // Indicate out of bounds or no tile
        }
        // Access this.layer here because getTileIndex is a const within create's scope,
        // and this.layer is defined.
        return this.layer.getTileAt(x, y)?.index;
    };

    // Helper to check if a tile index is a road tile (adjust range if needed)
    const isRoadTile = (tileIndex) => tileIndex >= 20 && tileIndex <= 24;

    this.input.on('pointerdown', (pointer) => {
        const tileX = this.map.worldToTileX(pointer.worldX);
        const tileY = this.map.worldToTileY(pointer.worldY);

        if (tileX < 0 || tileY < 0 || tileX >= this.mapData[0].length || tileY >= this.mapData.length) {
            console.error("Out of bounds");
            return;
        }

        let tileToPlace = changeTile;     // Default to whatever is selected in the dropdown
        let rotToApply = 0; // Default rotation

        // --- Determine Tile to Place and its Rotation for the CLICKED TILE ---
        if (changeTile === 0) {
            // If the user selected 'blank' (0) from the dropdown, always place a blank tile.
            tileToPlace = 0;
            rotToApply = 0;
        } else if (isRoadTile(changeTile)) {
            // If the user selected a road tile type (20-24) from the dropdown
            let surroundingRoadsClick = [];
            // Check for surrounding *existing* road tiles to determine the new road's shape
            if (isRoadTile(getTileIndex(tileX - 1, tileY))) surroundingRoadsClick.push(left);
            if (isRoadTile(getTileIndex(tileX, tileY - 1))) surroundingRoadsClick.push(up);
            if (isRoadTile(getTileIndex(tileX + 1, tileY))) surroundingRoadsClick.push(right);
            if (isRoadTile(getTileIndex(tileX, tileY + 1))) surroundingRoadsClick.push(down);

            function p(value) { return surroundingRoadsClick.includes(value); }

            // Logic to determine the road type (index) and its rotation
            if (surroundingRoadsClick.length === 4) {
                tileToPlace = 23; // Crossroads
                rotToApply = 0; // No specific rotation for 4-way
            } else if (surroundingRoadsClick.length === 3) {
                tileToPlace = 22; // T-junction
                if (!p(right)) rotToApply = 270; // Missing right, opening is right
                else if (!p(down)) rotToApply = 0;   // Missing down, opening is down
                else if (!p(left)) rotToApply = 90;  // Missing left, opening is left
                else if (!p(up)) rotToApply = 180;  // Missing up, opening is up
            } else if (surroundingRoadsClick.length === 2) {
                if ((p(left) && p(right)) ||
                    (p(up) && p(down))) {
                    tileToPlace = 21; // Straight road
                    if (p(up) && p(down)) rotToApply = 90; // Vertical straight
                    else rotToApply = 0; // Horizontal straight
                } else {
                    tileToPlace = 24; // Corner road
                    if (p(up) && p(right)) rotToApply = 0;
                    else if (p(right) && p(down)) rotToApply = 90;
                    else if (p(down) && p(left)) rotToApply = 180;
                    else if (p(left) && p(up)) rotToApply = 270;
                }
            } else if (surroundingRoadsClick.length === 1) {
                tileToPlace = 20; // Dead end / single road
                if (p(left)) rotToApply = 180;
                else if (p(up)) rotToApply = 270;
                else if (p(right)) rotToApply = 0;
                else if (p(down)) rotToApply = 90;
            } else {
                // No surrounding roads, but we're trying to place a road tile
                tileToPlace = 20; // Default to a single road tile (dead end)
                rotToApply = 0; // Default rotation for a single road tile
            }
        }
        // If changeTile is not 0 AND not a road tile (e.g., a "house" tile),
        // then tileToPlace remains its initial value of 'changeTile', and rotation is 0.
        // No special road logic applies.

        // update the internal mapData array and then the layer for the CLICKED TILE
        this.mapData[tileY][tileX] = tileToPlace;
        this.layer.putTileAt(tileToPlace, tileX, tileY); // Use putTileAt for single tile
        const newClickedTile = this.layer.getTileAt(tileX, tileY);
        if (newClickedTile) {
            newClickedTile.rotation = Phaser.Math.DegToRad(rotToApply);
        }
        console.log(`Placed tile at (${tileX}, ${tileY}) with index ${tileToPlace} and rotation ${rotToApply}`);

        // --- Re-evaluate and update surrounding tiles ---
        console.log("================================ Finished Placing Tile, Now Checking For Neighbor updates ================================");
        console.groupCollapsed("Neighbor update Info");

        const tilesToCheck = new Set();
        // Add the clicked tile itself, and its immediate neighbors
        tilesToCheck.add(`${tileX},${tileY}`);
        tilesToCheck.add(`${tileX - 1},${tileY}`);
        tilesToCheck.add(`${tileX + 1},${tileY}`);
        tilesToCheck.add(`${tileX},${tileY - 1}`);
        tilesToCheck.add(`${tileX},${tileY + 1}`);

        tilesToCheck.forEach(coord => {
            const [x, y] = coord.split(',').map(Number);

            if (x < 0 || y < 0 || x >= this.mapData[0].length || y >= this.mapData.length) {
                return; // Skip out of bounds
            }

            const currentTile = this.layer.getTileAt(x, y);
            // If the tile is not currently a road, or doesn't exist, we don't need to re-evaluate its connections.
            if (!currentTile || !isRoadTile(currentTile.index)) {
                // UNLESS it was just turned into a blank and its neighbors need to react
                // This part needs careful handling: if the clicked tile was made blank,
                // its *previous* neighbors might need to change their road type.
                // For now, this condition is fine as is, and the `isRoadTile` check below handles it.
                return;
            }

            let surroundingRoadsCheck = [];
            // Check for surrounding *existing* road tiles for THIS neighbor
            if (isRoadTile(getTileIndex(x - 1, y))) surroundingRoadsCheck.push(left);
            if (isRoadTile(getTileIndex(x, y - 1))) surroundingRoadsCheck.push(up);
            if (isRoadTile(getTileIndex(x + 1, y))) surroundingRoadsCheck.push(right);
            if (isRoadTile(getTileIndex(x, y + 1))) surroundingRoadsCheck.push(down);

            function o(value) { return surroundingRoadsCheck.includes(value); }

            let newChosenRoad = 0; // Default for non-road
            let newRotVal = 0;

            // Re-evaluate current tile's road type based on its updated neighbors
            if (surroundingRoadsCheck.length === 4) {
                newChosenRoad = 23;
                newRotVal = 0;
            } else if (surroundingRoadsCheck.length === 3) {
                newChosenRoad = 22;
                if (!o(right)) newRotVal = 90;
                else if (!o(down)) newRotVal = 180;
                else if (!o(left)) newRotVal = 270;
                else if (!o(up)) newRotVal = 0;
            } else if (surroundingRoadsCheck.length === 2) {
                if ((o(left) && o(right)) ||
                    (o(up) && o(down))) {
                    newChosenRoad = 21;
                    if (o(up) && o(down)) newRotVal = 90;
                    else newRotVal = 0;
                } else { // It's a corner
                    newChosenRoad = 24;
                    if (o(up) && o(right)) newRotVal = 90;
                    else if (o(right) && o(down)) newRotVal = 180;
                    else if (o(down) && o(left)) newRotVal = 270;
                    else if (o(left) && o(up)) newRotVal = 0;
                }
            } else if (surroundingRoadsCheck.length === 1) {
                newChosenRoad = 20;
                if (o(left)) newRotVal = 180;
                else if (o(up)) newRotVal = 270;
                else if (o(right)) newRotVal = 0;
                else if (o(down)) newRotVal = 90;
            } else {
                // If a road tile now has no road neighbors, it should either become blank (if you removed it)
                // or a single road tile (20) if it just lost connections but is still logically a road.
                // This is the tricky part for "deleting" roads: when a road is removed, its neighbors become "dead ends"
                // or change shape. If a road simply loses all connections, it becomes a single road (20).
                // If it was explicitly set to 0 by the user click, that already happened for the clicked tile.
                // For neighbors, if they were roads and now have no road connections, they should become single roads (20).
                newChosenRoad = 20; // Default to single road if no connections
                newRotVal = 0;
            }

            // Only update the tile if its visual representation or rotation needs to change
            if (currentTile.index !== newChosenRoad || currentTile.rotation !== Phaser.Math.DegToRad(newRotVal)) {
                this.mapData[y][x] = newChosenRoad; // update internal data
                this.layer.putTileAt(newChosenRoad, x, y); // Use putTileAt for single tile
                const updatedTile = this.layer.getTileAt(x, y);
                if (updatedTile) {
                    updatedTile.rotation = Phaser.Math.DegToRad(newRotVal);
                }
            }
        });

        console.groupEnd("Neighbor update Info");
    });
}


function update() {
    // Game loop logic, nothing needed here for this functionality
}