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
    blocklyWorker.onmessage = function(event){
        updatePixel(event.data.rowX,event.data.columnY,event.data.color);
    };
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    blocklyWorker.postMessage({message:"blocklyScript",script:code});
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
    console.log(rowX + ' ' + columnY + ' ' + color);
    let cell = {rowX: rowX, columnY: columnY};
    let cssCell = 'div[data-r=' + rowX + '][data-c=' + columnY + ']';
    console.log(cssCell);

    if(typeof(color) === 'string'){ // HexaColor
        if(granted){
            cell.rgbColor = HEXtoRGB(color);
            pixelsToUpdate.push(cell);
        }
        $(cssCell).css('background',color);
    }
    else { // RGBColor
        if(granted){
            cell.rgbColor = color;
            pixelsToUpdate.push(cell);
        }
        let hexaColor = '#' + RGBtoHEX(color.r,color.g,color.b);
        console.log(hexaColor);
        $(cssCell).css('background',hexaColor);
    }    
}

function logout(){
    socket.emit('logout');
}

