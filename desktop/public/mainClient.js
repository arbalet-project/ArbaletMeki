const socket = io();
let granted = false;
let updateTimer;
let pixelsToUpdate = [];


// Functions

// Runs the blockly program and launch the grid autoupdate
function run(){
    updateTimer = setInterval(updateArbalet,500);
    // TODO: run blockly program
}

// Stops the blockly program and the grid autoupdate
function stop(){
    clearInterval(updateTimer);
    // TODO: stop the blockly program
}

// Update the arbalet pixel grid if granted
function updateArbalet(){
    if(pixelsToUpdate.length != 0 && granted){
        socket.emit('updateGrid',pixelsToUpdate);
        pixelsToUpdate = [];
    }
}

// Update a pixel on simulation and add it to the update queue
function updatePixel(rowX,lineY,color){
    let cell = {rowX: rowX, lineY: lineY};

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

