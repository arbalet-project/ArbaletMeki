const socket = io();
let granted = false;
let isRunning = false;
let updateTimer;
let pixelsToUpdate = [];
let blocklyWorker;
let nbRows = 15;
let nbColumns = 10;


// Functions

// Runs the blockly program and launch the grid autoupdate
function run(){
    if(!isRunning){
        updateTimer = setInterval(updateArbalet,500);
        blocklyWorker = new Worker('/blocklyWorker.js');
        blocklyWorker.postMessage({message:'gridLength',nbRows: nbRows, nbColumns: nbColumns});
        blocklyWorker.onmessage = function(event){
            if(event.data.message == 'close'){
                stop();
            }
            else{
                updatePixel(event.data.rowX,event.data.columnY,event.data.color);
            }

        };
        let code = 'switchOffAllPixels();' + Blockly.JavaScript.workspaceToCode(workspace);
        blocklyWorker.postMessage({message:"blocklyScript",script:code});
        isRunning = true;
        switchPlayStopColors();
    }
}

// Stops the blockly program and the grid autoupdate
function stop(){
    if(isRunning){
        clearInterval(updateTimer);
        blocklyWorker.terminate();
        isRunning = false;
        switchPlayStopColors();
    }
}

// Stop the current running program and restart it
function restart(){
    stop();
    run();
}

// Save the current workspace on a downloadable file (.xml)
function save(name){
    let domWorkspace = Blockly.Xml.workspaceToDom(workspace);
    let textWorkSpace = Blockly.Xml.domToText(domWorkspace);
    if(name != null){
        download(textWorkSpace,name,"application/xml");
    }
}

// Import and set the current workspace with a downloaded .xml file
function importWorkspace(){
    let selectedFile = document.getElementById('fileImport').files[0];
    let reader = new FileReader();
    reader.onload = function(event){
        try{
            let parsedFile = Blockly.Xml.textToDom(reader.result);
            Blockly.Xml.clearWorkspaceAndLoadFromXml(parsedFile,workspace);
            stop();
        }
        catch(error){
            alert(selectedFile.name + " n'est pas un fichier Arbalet valide");
        }


    };
        reader.readAsText(selectedFile);

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
    let cssCell = 'div[data-r=' + rowX + '][data-c=' + columnY + ']';
        if(granted){
            cell.rgbColor = HEXtoRGB(color);
            pixelsToUpdate.push(cell);
        }
        $(cssCell).css('background',color);
}

function logout(){
    socket.emit('logout');
}

