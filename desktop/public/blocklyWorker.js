/**
 * @fileoverview This file is the script loaded by the worker that runs the blockly generated code
 */

importScripts('charMap.js');

let nbRows;
let nbColumns;
let gridState = [];

let sharedBuffer;
let sharedArray;
let scripts;

/**
 * Event listener for message reception, it handles 4 types of message:
 * - gridLength setting the number of rows and columns
 * - sharedBuffer receiving the sharedBuffer used to communicate events from the main thread
 * - scripts reveiving the different code to execute (5 max: 1 main script and 4 event scripts)
 * - run executing the main script, the worker can't handle more messages after receiving this one
 */
onmessage = function (e) {
    switch (e.data.message) {
        case 'gridLength':
            nbRows = e.data.nbRows;
            nbColumns = e.data.nbColumns;
            for (let i = 0; i < nbRows; i++) {
                gridState[i] = [];
            }
            break;

        case 'sharedBuffer':
            sharedBuffer = e.data.buffer;
            sharedArray = new Int32Array(sharedBuffer);
            break;

        case 'scripts':
            scripts = e.data.scripts;
            break;

        case 'run':
            try {
                eval(scripts['main']);
            } catch (error) {
                console.error(error);
            } finally {
                self.postMessage({
                    message: "close"
                });
                close();
            }
            break;
    }
}

/**
 * Set a specified pixel to the chosen color by sending a message to the main thread
 * @param {Number} rowX The pixel's row in the grid
 * @param {Number} columnY The pixel's column in the grid
 * @param {String} color The color to set to the pixel
 */
function setPixel(rowX, columnY, color) {
    if ((rowX >= 0 && rowX < nbRows) && (columnY >= 0 && columnY < nbColumns)) {
        self.postMessage({
            rowX: rowX,
            columnY: columnY,
            color: color
        });
        gridState[rowX][columnY] = color;
    }
}

/**
 * Set the specified pixel off (set the pixel color to black)
 * @param {Number} rowX The pixel's row in the grid
 * @param {Number} columnY The pixel's column in the grid
 */
function switchOffPixel(rowX, columnY) {
    setPixel(rowX, columnY, '#000000');
}

/**
 * Set all pixels off
 */
function switchOffAllPixels() {
    for (let i = 0; i < nbRows; i++) {
        for (let j = 0; j < nbColumns; j++) {
            switchOffPixel(i, j);
        }
    }
}

/**
 * Set all pixels to the given color
 * @param {String} color The color to set to the pixel
 */
function setAllPixels(color) {
    for (let i = 0; i < nbRows; i++) {
        for (let j = 0; j < nbColumns; j++) {
            setPixel(i, j, color);
        }
    }
}

/**
 * Return the current color of the specified pixel
 * @param {Number} row 
 * @param {Number} column
 * @returns {String} 
 */
function getPixelColor(row, column) {
    return gridState[row][column];
}

/**
 * Draw the specified letter to the given position and with the given direction
 * @param {String} inputLetter The letter to draw (only the first character of the string)
 * @param {Number} rowX The row number of the left-top pixel of the letter
 * @param {Number} columnY The column number of the left-top pixel of the letter
 * @param {String} color The color of the letter
 * @param {Number} direction The direction the letter has to be drawn (0 = vertical, 1 = horizontal)
 */
function drawLetter(inputLetter, rowX, columnY, color, direction) {
    let letter = inputLetter.charAt(0);
    if (charMap.has(letter)) {
        let letterPixels = charMap.get(letter);
        for (let i = 0; i < letterPixels.length; i = i + 2) {
            if (direction == 0) {
                setPixel(rowX + letterPixels[i], columnY + letterPixels[i + 1], color);
            } else {
                setPixel(rowX + letterPixels[i + 1], columnY - letterPixels[i], color);
            }

        }

    }
}

/**
 * Check if a "key-pressed" event has been sent and run the corresponding code
 */
function catchEvent() {
    let eventCatched = Atomics.load(sharedArray, 0);
    if (eventCatched != 0) {
        Atomics.store(sharedArray, 0, 0);
        switch (eventCatched) {
            case 1: //up
                eval(scripts["up"]);
                break;
            case 2: //right
                eval(scripts["right"]);
                break;
            case 3: //down
                eval(scripts["down"]);
                break;
            case 4:
                eval(scripts["left"]);
        }
    }
}
/**
 * Sleep the program for the given time
 * @param {Number} time The quantity of time to sleep (in seconds or milliseconds)
 * @param {String} unit The unit of time to sleep (s or ms)
 */
function sleep(time, unit) {
    if (unit === 's') {
        time = time * 1000;
    }
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > time) {
            break;
        }
    }
}

/**
 * Generate a random hexadecimal color
 * This function is natively in Blockly but needs to be redefined in that use
 * @returns {String}
 */
function colourRandom() {
    var num = Math.floor(Math.random() * Math.pow(2, 24));
    return '#' + ('00000' + num.toString(16)).substr(-6);
}

/**
 * Generate a color with the specified amount of red,green and blue
 * This function is natively in Blockly but needs to be redefined in that use
 * @param {Number} red The amount of red in the color
 * @param {Number} green The amount of green in the color
 * @param {Number} blue The amount of blue in the color
 * @returns {String}
 */
function colourRgb(red, green, blue) {
    red = Math.max(Math.min(Number(red), 100), 0) * 2.55;
    green = Math.max(Math.min(Number(green), 100), 0) * 2.55;
    blue = Math.max(Math.min(Number(blue), 100), 0) * 2.55;
    red = ('0' + (Math.round(red) || 0).toString(16)).slice(-2);
    green = ('0' + (Math.round(green) || 0).toString(16)).slice(-2);
    blue = ('0' + (Math.round(blue) || 0).toString(16)).slice(-2);
    return '#' + red + green + blue;
}

/**
 * Generate a color by blending two colors
 * This function is natively in Blockly but needs to be redefined in that use
 * @param {Number} c1 The first color to blend
 * @param {Number} c2 The second color to blend
 * @param {Number} ratio The ratio of "blending" of the two colors
 * @returns {String}
 */
function colourBlend(c1, c2, ratio) {
    ratio = Math.max(Math.min(Number(ratio), 1), 0);
    var r1 = parseInt(c1.substring(1, 3), 16);
    var g1 = parseInt(c1.substring(3, 5), 16);
    var b1 = parseInt(c1.substring(5, 7), 16);
    var r2 = parseInt(c2.substring(1, 3), 16);
    var g2 = parseInt(c2.substring(3, 5), 16);
    var b2 = parseInt(c2.substring(5, 7), 16);
    var r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    var g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    var b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    r = ('0' + (r || 0).toString(16)).slice(-2);
    g = ('0' + (g || 0).toString(16)).slice(-2);
    b = ('0' + (b || 0).toString(16)).slice(-2);
    return '#' + r + g + b;
}