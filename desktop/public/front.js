createLedTable(nbRows, nbColumns); //Row / Coll


// Starting Module

$('#send-name').on('click', function () {
    var name = $('#user-name-input').val()
    $('.overlay-popup').css({
        "transition": "0.4s ease",
        "transform": " scale(1.05)"
    }).delay(500).fadeOut(400)
    socket.emit('login', name);
    $('#user-name').append(name)
})

$('#user-name-input').keypress(function (event) {
    if (event.which == 13) {
        $('#send-name').click();
    }
})

// Connect Arbalet Table

socket.on('granted', function () {
    granted = true;
    $('.connect-style').after('<p class="connect-style blue">Connecté à Arbalet</p>')
    console.log("connecté à Arbalet")
});

socket.on('ungranted', function () {
    granted = false;
    $('.blue').remove()
});

socket.on('disconnectUser', function () {
    alert('Disconnect')
    console.log('disconnect')
});


/******* lOGOUT : logout(); */

//Led Full Screen

$('#full-screen').on('click', function (e) {
    e.preventDefault();
    toogleFullScreen();
});
// Event keys for Blockly
$(document).on('keydown', function (e) {
    if(isRunning){
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

function toogleFullScreen() {
    if (!$('.led-content').hasClass('full-screen')) {
        $('.led-content').wrap('<div class="overlay-popup2"></div>')
        $('.led-content').addClass('full-screen')
    } else {
        $('.led-content').removeClass('full-screen')
        $('.overlay-popup2').contents().unwrap();
    }
}

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



//Table Led Simulation

function createLedTable(nbRows, nbColumns) {
    let ledContainer = document.getElementById('led-table');
    for (let i = 0; i < nbRows; i++) {
        let newRow = ledContainer.insertRow();
        for (let j = 0; j < nbColumns; j++) {
            newRow.insertCell(j).innerHTML = `<div class="led" data-r="${i}" data-c="${j}" title="[${i},${j}]"></div>`;
        }
    }
}


// Dropmenu setting
$('.setting-menu').hover(function () {
    $('.info-user').fadeOut(200)
}, function () {
    $('.info-user').fadeIn(200)
})