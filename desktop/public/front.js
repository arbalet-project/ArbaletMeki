/**
 * @fileoverview This file contains all the graphical functions and event manager that work with the interface (client-side on browser)
 * @see mainClient.js
 */

let workspace;

createLedTable(nbRows, nbColumns);
initWorkspace();

// Management of the received messages on websockets

socket.on('logged',(user) => {
    $('#user-name').append(user.name);
    $('#user-ip').append(user.ip);
    //hideLoginScreen();
    $('.overlay-popup').hide();
});

socket.on('granted', function () {
    granted = true;
    $('.connect-style').replaceWith('<p class="connect-style live">live</p>');
});

socket.on('ungranted', function () {
    granted = false;
    $('.live').replaceWith('<p class="connect-style">Connecté au poste</p>');
});

socket.on('disconnectUser', function () {
    alert('Disconnect')
    console.log('disconnect')
});


// Event keys for Blockly, stores the corresponding event in a sharedArray to be read by the worker (disabled for non-chrome browsers)
if(isChrome()){
    $(document).on('keydown', function (e) {
        if (isRunning) {
            switch (e.which) {
                case 38: // UP
                    Atomics.store(sharedArray, 0, 1);
                    break;
                case 39: // RIGHT
                    Atomics.store(sharedArray, 0, 2);
                    break;
                case 40: // DOWN
                    Atomics.store(sharedArray, 0, 3);
                    break;
                case 37: // LEFT
                    Atomics.store(sharedArray, 0, 4);
                    break;
            }
        }
    });
}


// Animations and clicking behaviour definitions
$('#play').on('click', function (e) {
    e.preventDefault();
    run();
});

$('#stop').on('click', function (e) {
    e.preventDefault();
    stop();
});

$('#reload').on('click', function (e) {
    e.preventDefault();
    restart();
})

$('#import').on('click', function (e) {
    e.preventDefault();
    $('#fileImport').click();
})

$('#export').on('click', function () {
    $('.overlay-popup3').fadeIn(200)
    $("#export-module").fadeIn(200, function () {
        $('#export-file').on('click', function () {
            let name = $('#export-input').val()
            save(name);
            $('#export-module').fadeOut(200)
            $('.overlay-popup3').fadeOut(200)
        })
    })
})

$('#export-input').keypress(function (event) {
    if (event.which == 13) {
        $('#export-file').click();
    }
})

$('#fileImport').on('change', function (e) {
    importWorkspace();
})

$('#example').on('click', function () {
    $('.overlay-popup3').fadeIn(200)
    $('#example-module').fadeIn(200)
})

$('.overlay-popup3').on('click', function () {
    $(this).fadeOut(200, function () {
        $('#example-module').fadeOut(200)
        $('#export-module').fadeOut(200)
    })
})

$('#full-screen').on('click', function (e) {
    e.preventDefault();
    toogleFullScreen();
});

$('.setting-menu').hover(function () {
    $('.info-user').fadeOut(200)
}, function () {
    $('.info-user').fadeIn(200)
})

$('#send-name').on('click', function () {
    var name = $('#user-name-input').val()
    hideLoginScreen();
    socket.emit('login', name);
})

$('#user-name-input').keypress(function (event) {
    if (event.which == 13) {
        $('#send-name').click();
    }
})

function hideLoginScreen(){
    $('.overlay-popup').css({
        "transition": "0.4s ease",
        "transform": " scale(1.05)"
    }).delay(500).fadeOut(400);
}

/**
 * Init the blockly workspace and the toolbox
 */
function initWorkspace() {
    let toolbox = document.getElementById('toolbox');

    // The event functionnality is not compatible with others browsers than Chrome, so we delete the event blocks on these browsers
    if (!isChrome()) {
        for (let blockNode of toolbox.getElementsByTagName("block")) {
            if (blockNode.getAttribute("type") == "event_key") {
                blockNode.remove();
                break;
            }
        }
    }

    // Creating the workspace
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        collapse: true,
        comments: true,
        disable: true,
        maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: 'start',
        css: true,
        rtl: false,
        scrollbars: false,
        sounds: true,
        oneBasedIndex: true
    });

    // Adding a program block to this workspace
    let mainBlock = workspace.newBlock('main_script');
    mainBlock.initSvg();
    mainBlock.render();
    mainBlock.moveBy(300,30);


}

/**
 * Generate the HTML table of the pixels for the simulation
 * @param {Number} nbRows 
 * @param {Number} nbColumns 
 */
function createLedTable(nbRows, nbColumns) {
    let ledContainer = document.getElementById('led-table');
    for (let i = 0; i < nbRows; i++) {
        let newRow = ledContainer.insertRow();
        for (let j = 0; j < nbColumns; j++) {
            newRow.insertCell(j).innerHTML = `<div class="led" data-r="${i}" data-c="${j}" title="[${i},${j}]"></div>`;
        }
    }
}
/**
 * Toogle the full-screen mode of the simulation
 */
function toogleFullScreen() {
    if (!$('.led-content').hasClass('full-screen')) {
        $('.led-content').wrap('<div class="overlay-popup2"></div>')
        $('.led-content').addClass('full-screen')
    } else {
        $('.led-content').removeClass('full-screen')
        $('.overlay-popup2').contents().unwrap();
    }
}

/**
 * Switch the colors of Play and Stop buttons
 */
function switchPlayStopColors() {
    if (isRunning) {
        $('#play').css({
            "background-image": 'url(../asset/images/icon/play.png)'
        });
        $('#stop').css({
            "background-image": 'url(../asset/images/icon/stop_red.png)'
        });
    } else {
        $('#play').css({
            "background-image": 'url(../asset/images/icon/play_green.png)'
        });
        $('#stop').css({
            "background-image": 'url(../asset/images/icon/stop.png)'
        });
    }
}