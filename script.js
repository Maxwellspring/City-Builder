var gridElement = document.getElementById('grid');
var config = {
    type: Phaser.AUTO,
    width: gridElement.clientWidth, // Use clientWidth to get the actual width of the #grid element
    height: gridElement.clientHeight, // Use clientHeight to get the actual height of the #grid element
    parent: 'grid', // Attach Phaser canvas to the #grid element
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

// var canvas = document.querySelector('canvas');
// canvas.style.width = gridElement.clientWidth + 'px';
// canvas.style.height = gridElement.clientHeight + 'px';

var game = new Phaser.Game(config);

// Handle resizing dynamically
window.addEventListener('resize', () => {
    config.width = window.innerWidth;
    config.height = window.innerHeight;
    game.scale.resize(config.width, config.height);
});

// Define global constants for directions
const up = "up";
const down = "down";
const left = "left";
const right = "right";

let power = document.getElementById("power")
let popul = document.getElementById("pop")
let money = document.getElementById("money")
let mondf = document.getElementById("moneydiff")
let pauseButton = document.getElementById("pause")
let playButton = document.getElementById("play")
let updateButton = document.getElementById("update")




let isGamePaused = false;

function setGamePaused(value) {
    return isGamePaused = value;
}

function gamePause() {
    // Pause the game logic
    setGamePaused(true); // Set the paused state to true
    setTimeout(() => {
        game.loop.sleep();
    }, 1)
    game.loop.wake();

    console.log("Game paused");
}

function gamePlay() {
    // Resume the game logic
    setGamePaused(false); // Set the paused state to false
    game.loop.wake();
    console.log("Game resumed");
}

function gameUpdate() {
    if (isGamePaused) {
        setTimeout(() => {
            updateButton.style.color = "black";
            updateButton.style.backgroundColor = "white";
            updateButton.style.borderColor = "black";
            game.loop.sleep();
        }, 1)
        updateButton.style.color = "white";
        updateButton.style.backgroundColor = "orange";
        updateButton.style.borderColor = "white";

        pauseButton.style.color = "black";
        pauseButton.style.backgroundColor = "white";
        pauseButton.style.borderColor = "black";

        playButton.style.color = "black";
        playButton.style.backgroundColor = "white";
        playButton.style.borderColor = "black";

        game.loop.wake();
    }
}





function preload() {
    this.load.image("smile", "media/hello.png");
    this.load.image("frown", "media/bye.png");
    this.load.image("debug", "media/debug.png");
    this.load.image("testTile", "media/5x5 tile map.png");
    this.load.image("Atlas", "media/5x5 tile map V7.png");
}

let cityMoney = 100000
let oldMoney = 100000

const roadValues = {};



function getTileIndex(mapData, layer, x, y) {
    if (x < 0 || y < 0 || x >= mapData[0].length || y >= mapData.length) {
        return -1; // Indicate out of bounds or no tile
    }
    return layer.getTileAt(x, y)?.index;
}

// Helper to check if a tile index is a road tile (adjust range if needed)
const isRoadTile = (tileIndex) => tileIndex >= 20 && tileIndex <= 24;



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
        height: this.mapData.length,
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
    // this.layer.putTileAt(19, x, y)

    for (let y = 0; y < this.mapData.length; y++) {
        for (let x = 0; x < this.mapData[y].length; x++) {
            if (this.mapData[y][x] == 0) {
                let randomNumber1 = Math.random() * 10
                if (randomNumber1 > 4) {
                    // says that a tree will be placed
                    let randomNumber2 = Math.random() * 10
                    if (randomNumber2 > 1) { // place big
                        this.layer.putTileAt(19, x, y)
                        let randomNumber3 = Math.random() * 10
                        if (randomNumber3 > 2) { // place medium
                            this.layer.putTileAt(18, x, y)
                            let randomNumber4 = Math.random() * 10
                            if (randomNumber4 > 6) { // place small
                                this.layer.putTileAt(17, x, y)
                            }
                        }
                    }
                }
            }
        }
    }






    this.input.on('pointerdown', (pointer) => {
        const tileX = this.map.worldToTileX(pointer.worldX);
        const tileY = this.map.worldToTileY(pointer.worldY);

        if (tileX < 0 || tileY < 0 || tileX >= this.mapData[0].length || tileY >= this.mapData.length) {
            console.error("Out of bounds");
            return;
        }




        let tileToPlace = changeTile;     // Default to whatever is selected in the dropdown
        let rotToApply = 0; // Default rotation



        function tell(message) {
            let telll = document.getElementById("tell");
            telll.innerHTML = "" + message;
            setTimeout(function () {
                telll.innerHTML = ""
            }, 1000);
        }




        if (tileToPlace != 0) {
            console.warn("tile to place is NOT blank")
            let tileindexcheck = getTileIndex(this.mapData, this.layer, tileX, tileY); // Get the tile index at the clicked position
            if (tileindexcheck != 0) {
                console.warn("tile at location clicked is NOT blank")
                tell("Obscured")
                console.log(getTileIndex(this.mapData, this.layer, tileX, tileY));
                console.log(`Tile at (${tileX}, ${tileY}) has index: ${getTileIndex(this.mapData, this.layer, tileX, tileY)}`);
                return // Log the tile index at the clicked position
            }
        }
        let largestValue = null; // Initialize largestValue to null for road logic
        // --- Determine Tile to Place and its Rotation for the CLICKED TILE ---
        if (changeTile === 0) {
            // If the user selected 'blank' (0) from the dropdown, always place a blank tile.
            tileToPlace = 0;
            rotToApply = 0;
        } else if (isRoadTile(changeTile)) {
            // If the user selected a road tile type (20-24) from the dropdown
            let surroundingRoadsClick = [];
            // Check for surrounding *existing* road tiles to determine the new road's shape
            if (isRoadTile(getTileIndex(this.mapData, this.layer, tileX - 1, tileY))) surroundingRoadsClick.push(left);
            if (isRoadTile(getTileIndex(this.mapData, this.layer, tileX, tileY - 1))) surroundingRoadsClick.push(up);
            if (isRoadTile(getTileIndex(this.mapData, this.layer, tileX + 1, tileY))) surroundingRoadsClick.push(right);
            if (isRoadTile(getTileIndex(this.mapData, this.layer, tileX, tileY + 1))) surroundingRoadsClick.push(down);

            let values = [];

            // Collect values from the surrounding tiles
            if (isRoadTile(getTileIndex(this.mapData, this.layer, tileX - 1, tileY))) {
                const leftValue = this.layer.getTileAt(tileX - 1, tileY)?.properties?.serial;
                if (leftValue != undefined) values.push(leftValue);
            }
            if (isRoadTile(getTileIndex(this.mapData, this.layer, tileX, tileY - 1))) {
                const upValue = this.layer.getTileAt(tileX, tileY - 1)?.properties?.serial;
                if (upValue != undefined) values.push(upValue);
            }
            if (isRoadTile(getTileIndex(this.mapData, this.layer, tileX + 1, tileY))) {
                const rightValue = this.layer.getTileAt(tileX + 1, tileY)?.properties?.serial;
                if (rightValue != undefined) values.push(rightValue);
            }
            if (isRoadTile(getTileIndex(this.mapData, this.layer, tileX, tileY + 1))) {
                const downValue = this.layer.getTileAt(tileX, tileY + 1)?.properties?.serial;
                if (downValue != undefined) values.push(downValue);
            }

            // Find the largest value
            largestValue = values.length > 0 ? Math.max(...values) : null;
            console.log(`Largest value: ${largestValue}`);

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

        // function GTIC(x, y) {
        //     getTileIndex(this.mapData, this.layer, x, y)
        // }

        if (changeTile < 20) {
            if (changeTile == 0) {
                if (getTileIndex(this.mapData, this.layer, tileX, tileY) == 0) {

                } else if (getTileIndex(this.mapData, this.layer, tileX, tileY) == 1) {
                    tell("house demolished")
                    cityMoney += 1000 / 2;

                } else if (getTileIndex(this.mapData, this.layer, tileX, tileY) == 2) {
                    tell("commercial demolished")
                    cityMoney += 1700 / 2;

                } else if (getTileIndex(this.mapData, this.layer, tileX, tileY) == 3) {
                    tell("power plant demolished")
                    cityMoney += 3000 / 2;
                } else if (getTileIndex(this.mapData, this.layer, tileX, tileY) >= 17 || getTileIndex(this.mapData, this.layer, tileX, tileY) <= 19) {
                    cityMoney -= 100
                    tell("tree cut down")
                } else if (getTileIndex(this.mapData, this.layer, tileX, tileY) >= 20) {
                    tell("road demolished")
                    // Default demolition cost for other tiles
                    return
                }
            } else if (changeTile == 1 && cityMoney > 1000) { // house
                cityMoney -= 1000;
            } else if (changeTile == 2 && cityMoney > 1700) { // commercial
                cityMoney -= 1700;
            } else if (changeTile == 3 && cityMoney > 3000) { // powerplant
                cityMoney -= 3000;
            } else {
                tell("not enough $$$")
                return
            }
        }
        oldMoney = cityMoney

        let chosenNumber // Default value for the tile's serial property

        if (largestValue != null) {
            chosenNumber = largestValue;
        } else {
            chosenNumber = Math.floor(Math.random() * 1000000);
        }

        // update the internal mapData array and then the layer for the CLICKED TILE
        this.mapData[tileY][tileX] = tileToPlace;
        this.layer.putTileAt(tileToPlace, tileX, tileY); // Use putTileAt for single tile

        // let recentlyPlacedTile = this.layer.getTileAt(tileX, tileY);


        const newClickedTile = this.layer.getTileAt(tileX, tileY);

        newClickedTile.properties = { serial: chosenNumber }; // Mark the tile as placed

        if (newClickedTile) {
            newClickedTile.rotation = Phaser.Math.DegToRad(rotToApply);
        }
        console.log(`Placed tile at (${tileX}, ${tileY}) with index ${tileToPlace} and rotation ${rotToApply} along with the serial number ${chosenNumber}`);

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
            if (isRoadTile(getTileIndex(this.mapData, this.layer, x - 1, y))) surroundingRoadsCheck.push(left);
            if (isRoadTile(getTileIndex(this.mapData, this.layer, x, y - 1))) surroundingRoadsCheck.push(up);
            if (isRoadTile(getTileIndex(this.mapData, this.layer, x + 1, y))) surroundingRoadsCheck.push(right);
            if (isRoadTile(getTileIndex(this.mapData, this.layer, x, y + 1))) surroundingRoadsCheck.push(down);

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

// const getTileIndex = (x, y) => {
//     if (x < 0 || y < 0 || x >= this.mapData[0].length || y >= this.mapData.length) {
//         return -1; // Indicate out of bounds or no tile
//     }
//     // Access this.layer here because getTileIndex is a const within create's scope,
//     // and this.layer is defined.
//     return this.layer.getTileAt(x, y)?.index;
// };

// Helper function to safely get tile index, handling out of bounds





function surroundingRoadSerials(mapData, layer, tileX, tileY) {
    // Collect serial numbers from surrounding road tiles
    const surroundingRoads = [];
    if (isRoadTile(getTileIndex(mapData, layer, tileX - 1, tileY))) {
        const leftTile = layer.getTileAt(tileX - 1, tileY);
        if (leftTile) surroundingRoads.push(leftTile.properties.serial);
    }
    if (isRoadTile(getTileIndex(mapData, layer, tileX, tileY - 1))) {
        const upTile = layer.getTileAt(tileX, tileY - 1);
        if (upTile) surroundingRoads.push(upTile.properties.serial);
    }
    if (isRoadTile(getTileIndex(mapData, layer, tileX + 1, tileY))) {
        const rightTile = layer.getTileAt(tileX + 1, tileY);
        if (rightTile) surroundingRoads.push(rightTile.properties.serial);
    }
    if (isRoadTile(getTileIndex(mapData, layer, tileX, tileY + 1))) {
        const downTile = layer.getTileAt(tileX, tileY + 1);
        if (downTile) surroundingRoads.push(downTile.properties.serial);
    }
    return surroundingRoads;
}

function containsAny(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        console.error("Both inputs must be arrays.");
        return false; // Ensure both inputs are arrays

    }
    return arr1.some(item => arr2.includes(item))
}

let erre = [1, 2, 3]
let erre2 = [2, 3, 4]

// console.groupCollapsed("sd");
function update() {
    // Game loop logic, nothing needed here for this functionality
    function checkTile(index) {
        let powerPlants = 0; // Initialize a counter for tiles with index 4
        let powerPlantSurroundingSerials = []
        let houseSurroundingSerials = []
        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                
                if (this.mapData[y][x] == index) {
                    
                    powerPlants++
                    // console.log(surroundingRoadSerials(this.mapData, this.layer, x, y));

                    if (index == 3) { // Assuming index 3 is for power plants
                        powerPlantSurroundingSerials = surroundingRoadSerials(this.mapData, this.layer, x, y);
                        // console.log(`Power Plant at (${x}, ${y}) with serials:`, powerPlantSurroundingSerials);
                    }
                    if (index == 1) {
                        houseSurroundingSerials = surroundingRoadSerials(this.mapData, this.layer, x, y);
                        // console.log(`House at (${x}, ${y}) with serials:`, houseSurroundingSerials);
                        // console.log(houseSurroundingSerials.typeof + " array")
                    }
                    if (containsAny(powerPlantSurroundingSerials, houseSurroundingSerials)) {
                        // console.log(`Road serials found around tile (${x}, ${y})`);
                    }
                }
                if (getTileIndex(this.mapData, this.layer, x, y) >= 17 && getTileIndex(this.mapData, this.layer, x, y) <= 19) {
                    let randomNumber5 = Math.random() * 10
                    // if (randomNumber5 > 5)
                }
            }
        }
        return powerPlants
        // return false; // No tile with index 4 found
    }

    let powerPlants = checkTile.call(this, 3)
    let houses = checkTile.call(this, 1) // Assuming index 1 is for houses

    let cityHouse = 0
    let cityPower = 0



    if (powerPlants > 0) {
        cityMoney -= powerPlants * 1
        cityPower = powerPlants * 2
    }

    if (houses > 0) {
        cityPower -= houses * 1
        cityMoney += houses * 1
    }

    if (cityPower < 0) {
        cityMoney += cityPower * 2
    }

    let moneydifference = cityMoney - oldMoney

    power.innerHTML = `Power: ${cityPower}`; // Update the power count display 
    popul.innerHTML = `Population: ${cityHouse}`; // Update the population display
    money.innerHTML = `Money: ${cityMoney / 100}`; // Update the money display\
    mondf.innerHTML = `gain/loss: ${moneydifference}`

    // console.log(`oldMoney: ${oldMoney} currentMoney: ${cityMoney}`)
    if (cityMoney) {
        if (cityMoney < 0) {
            if (cityMoney < oldMoney) {
                money.style.color = "red"
                // return
            } else {
                money.style.color = "orange"
            }

        } else {
            if (cityMoney < oldMoney) {
                money.style.color = "yellow"
                // return
            } else {
                money.style.color = "lightgreen"
            }
        }

    }

    if (isGamePaused) {
        pauseButton.style.color = "white";
        pauseButton.style.backgroundColor = "red";
        pauseButton.style.borderColor = "white";

        playButton.style.color = "black";
        playButton.style.backgroundColor = "white";
        playButton.style.borderColor = "black";
    } else if (!isGamePaused) {
        pauseButton.style.color = "black";
        pauseButton.style.backgroundColor = "white";
        pauseButton.style.borderColor = "black";

        playButton.style.color = "white";
        playButton.style.backgroundColor = "green";
        playButton.style.borderColor = "white";
    }

    this.backgroundImage.displayWidth = config.width;
    this.backgroundImage.displayHeight = config.height;

    oldMoney = cityMoney
}
// console.groupEnd("ds");