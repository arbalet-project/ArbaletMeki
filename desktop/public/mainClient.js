const socket = io();
let granted = false;
let updateTimer;
let pixelsToUpdate = [];
let blocklyWorker;
let nbRows = 15;
let nbColumns = 10;


// Functions

// Runs the blockly program and launch the grid autoupdate
function run(){
    updateTimer = setInterval(updateArbalet,500);
    blocklyWorker = new Worker('/blocklyWorker.js');
    blocklyWorker.postMessage({message:'gridLength',nbRows: nbRows, nbColumns: nbColumns});
    // TODO: Generate code from blockly and post to the worker

}

// Stops the blockly program and the grid autoupdate
function stop(){
    clearInterval(updateTimer);
    blocklyWorker.terminate();

}

// Update the arbalet pixel grid if granted
function updateArbalet(){
    if(pixelsToUpdate.length != 0 && granted){
        socket.emit('updateGrid',pixelsToUpdate);
        pixelsToUpdate = [];
    }
}

// Update a pixel on simulation and add it to the update queue
function updatePixel(rowX,columnY,color){
    let cell = {rowX: rowX, columnY: columnY};

    if(typeof(color) === 'string'){ // HexaColor
        if(granted){
            cell.rgbColor = HEXtoRGB(color);
            pixelsToUpdate.push(cell);
        }
        // TODO: update simulation cell
    }
    else { // RGBColor
        if(granted){
            cell.rgbColor = color;
            pixelsToUpdate.push(cell);
        }
        let HexaColor = RGBtoHEX(color.r,color.g,color.b);
        // TODO: update simulation cell
    }    
}

function logout(){
    socket.emit('logout');
}

