/**
 * @fileoverview This file contains the application's core functions (client-side on browser)
 */


const socket = io();
let granted = false;
let isRunning = false;
let updateTimer;
let pixelsToUpdate = [];
let blocklyWorker;
let nbRows = 15;
let nbColumns = 10;
let sharedBuffer;
let sharedArray;


// Functions

/**
 * Runs the blockly program and launch the grid autoupdate
 */
function run() {
    if (!isRunning) {
        updateTimer = setInterval(updateArbalet, 100);
        blocklyWorker = new Worker('/blocklyWorker.js');

        blocklyWorker.postMessage({
            message: 'gridLength',
            nbRows: nbRows,
            nbColumns: nbColumns
        });

        // Send the different scripts to the worker
        blocklyWorker.postMessage({
            message: 'scripts',
            scripts: generateScripts()
        });

        blocklyWorker.onmessage = function (event) {
            if (event.data.message == 'close') {
                stop();
            } else {
                updatePixel(event.data.rowX, event.data.columnY, event.data.color);
            }

        };
        // All data sent to the worker, it can run the program
        blocklyWorker.postMessage({
            message: "run"
        });
        isRunning = true;
        switchPlayStopColors();
    }
}

/**
 * Stops the blockly program and the grid autoupdate
 */
function stop() {
    if (isRunning) {
        updateArbalet();
        clearInterval(updateTimer);
        blocklyWorker.terminate();
        isRunning = false;
        switchPlayStopColors();
    }
}

/**
 * Save the current workspace on a downloadable file (.xml)
 * @param {String} name File name of the exported workspace
 */
function save(name) {
    let domWorkspace = Blockly.Xml.workspaceToDom(workspace);
    let textWorkSpace = Blockly.Xml.domToText(domWorkspace);
    if (name != null) {
        download(textWorkSpace, name + '.xml', "application/xml");
    }
}

/**
 * Import and set the current workspace with a downloaded .xml file
 */
function importWorkspace() {
    let selectedFile = document.getElementById('fileImport').files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
        try {
            let parsedFile = Blockly.Xml.textToDom(reader.result);
            Blockly.Xml.clearWorkspaceAndLoadFromXml(parsedFile, workspace);
            stop();
        } catch (error) {
            alert(selectedFile.name + " n'est pas un fichier Arbalet valide");
        }
    };
    reader.readAsText(selectedFile);
}

function loadExemple(fileName){
    $.ajax({
        method: 'GET',
        url: `exemples/${fileName}`,
        processData: false
    }).done(data => {
        Blockly.Xml.clearWorkspaceAndLoadFromXml(data.firstChild,workspace);
        stop();
    });
}

/**
 * Update the material Arbalet pixel grid if granted
 */
function updateArbalet() {
    if (pixelsToUpdate.length != 0 && granted) {
        socket.emit('updateGrid', pixelsToUpdate);
        pixelsToUpdate = [];
    }
}

/**
 * Update a pixel on simulation and add it to the update queue
 * @param {Number} rowX The row of the pixel to update
 * @param {Number} columnY The column of the pixel to update
 * @param {String} color The color to set to the pixel
 */
function updatePixel(rowX, columnY, color) {
    let cell = {
        rowX: rowX,
        columnY: columnY,
        color:color
    };
    let cssCell = 'div[data-r=' + rowX + '][data-c=' + columnY + ']';
    if (granted) {
        pixelsToUpdate.push(cell);
    }
    $(cssCell).css('background', color);
}

/**
 * Translate workspace's blocks in Javascript (main program and events code)
 * @return {Object} An associative array of the scripts (5 elements max)
 */
function generateScripts() {
    Blockly.JavaScript.init(workspace);
    let scripts = {};
    let functionsDefinition = generateFunctions();
    let noEventProgram = true;

    Blockly.mainWorkspace.getBlocksByType("event_key").forEach(function (bloc) {
        let key = bloc.inputList[0].fieldRow[1].value_;
        let code = Blockly.JavaScript.blockToCode(bloc);
        scripts[key] = functionsDefinition + code;
        noEventProgram = false;
    });

    scripts["main"] = functionsDefinition + Blockly.JavaScript.blockToCode(
        Blockly.mainWorkspace.getBlocksByType("main_script")[0]);
    if(noEventProgram){
        scripts["main"] += 'self.postMessage({message: "close"});close();' ;
    }
    return scripts;
    
}

/**
 * Translate functions' blocks in JavaScript code
 * @return {String} JavaScript code corresponding to the blockly functions defined in the workspace
 */
function generateFunctions() {
    Blockly.JavaScript.init(workspace);
    let functionsCode = '';

    let functionsBlocs = Blockly.mainWorkspace.getBlocksByType("procedures_defreturn");
    functionsBlocs.push(...Blockly.mainWorkspace.getBlocksByType("procedures_defnoreturn"));

    functionsBlocs.forEach((bloc) => {
        bloc.comment = '';
        Blockly.JavaScript.blockToCode(bloc);
    });

    // Variables declarations are deleted, so they will be global and shared between the main script and event scripts
    delete Blockly.JavaScript.definitions_.variables;

    let arrayFunctions = Object.values(Blockly.JavaScript.definitions_);
    arrayFunctions = arrayFunctions.map((x) => {
        if(x != ''){
            return 'async ' + x;
        }
    });

    functionsCode = arrayFunctions.join('');
    return functionsCode;
}
