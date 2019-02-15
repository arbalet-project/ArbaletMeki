

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

    $('#full-screen').on('click', function(){
        console.log("hello")
    });

    $('#play').on('click',function(e){
        e.preventDefault();
        run();
    });

    $('#pause').on('click',function(e){
        e.preventDefault();
        stop();
    });

    $('#reload').on('click',function(e){
        e.preventDefault();
        stop();
        // TODO: Reset the grid
        run();
    })


    //Table Led Simulation

    function createLedTable(nbRows, nbColumns){
        let ledContainer = document.getElementById('led-table');
        for(let i = 0; i < nbRows; i++){
            let newRow = ledContainer.insertRow();
            for(let j = 0; j < nbColumns; j++){
                newRow.insertCell(j).innerHTML = '<div class="led" data-r="'+i+'" data-c="'+j+'"></div>';
            }
        }
    }  
