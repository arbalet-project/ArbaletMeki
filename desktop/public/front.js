

    createLedTable(15,10); //Row / Coll


    // Starting PopUp

    $('#send-name').on('click', function(){
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
    })

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
    })


    //Table Led Simulation

    function createLedTable(NbrRow, NbrColumn){
    let Cell = 0
    let Col = 0
    let nbCol = 0

    let myContainer = document.getElementById('led-table')

        for (let NbrLed = 0; NbrLed < (NbrRow * NbrColumn); NbrLed++) {

            if(Col % NbrColumn == 0){
                //New Row
                var newRow = myContainer.insertRow(-1);
                Cell = 0
                nbCol ++
            }
            
            //New Cell
            newRow.insertCell(Cell).innerHTML = '<div class="led" data-n="'+Cell+'" data-c="'+nbCol+'"></div>'

            Col++
            Cell ++    
        }
    }  
