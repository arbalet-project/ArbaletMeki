

    createLedTable(nbRows,nbColumns); //Row / Coll


    // Starting PopUp

/*     $('#send-name').on('click', function(){
        var name = $('#name-popup').val()
        $('.overlay-popup').css({
            "transition" : "0.4s ease",
            "transform":" scale(1.05)"
        }).delay(500).fadeOut(400)
        socket.emit('login',name);
        $('#user-name').append(name)
    })

    $('#name-popup').keypress(function(event){
        if(event.which == 13 ){
        $('#send-name').click();
        }
    }) */

    // Connect Arbalet Table

    socket.on('granted',function(){
        granted = true;
        $('.connect-style').after('<p class="connect-style blue">Connecté à Arbalet</p>')
        console.log("connecté à Arbalet")
    });
    
    socket.on('ungranted',function(){
        granted = false;
        $('.blue').remove()
    });

    socket.on('disconnectUser',function(){
        alert('Disconnect')
        console.log('disconnect')
    });


    /******* lOGOUT : logout(); */

    //Led Full Screen

    $('#full-screen').on('click', function(e){
        e.preventDefault();
        toogleFullScreen();
    });
    // Keyboard shortcut
    $(document).on('keypress',function(e){
        console.log(e.key);
        switch(e.key){
            case 'f':
                toogleFullScreen();
                break;
            case 'p':
                run();
                break;
            case 's':
                stop();
                break;
            case 'r':
                restart();
                break;    
        }
    });

    function toogleFullScreen(){
        
        if (!$('.led-content').hasClass('full-screen')) {
            $('.led-content').wrap('<div class="overlay-popup2"></div>')
            $('.led-content').addClass('full-screen')
        }else{
            $('.led-content').removeClass('full-screen')
            $('.overlay-popup2').contents().unwrap();
        }
    }

    $('#play').on('click',function(e){
        e.preventDefault();
        run();
    });

    $('#stop').on('click',function(e){
        e.preventDefault();
        stop();
    });

    $('#reload').on('click',function(e){
        e.preventDefault();
        restart();
    })


    //Table Led Simulation

    function createLedTable(nbRows, nbColumns){
        let ledContainer = document.getElementById('led-table');
        for(let i = 0; i < nbRows; i++){
            let newRow = ledContainer.insertRow();
            for(let j = 0; j < nbColumns; j++){
                newRow.insertCell(j).innerHTML = `<div class="led" data-r="${i}" data-c="${j}" title="[${i},${j}]"></div>`;
            }
        }
    }  
