// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron');
let ip = require('ip');

// Show IP
$('#myIp').text(ip.address()+':3000');

//Events

//add
ipcRenderer.on('addUser',function(event,arg){
    var nbConnect = $('#nbConnected').text();
    nbConnect++;
    $('#nbConnected').text(nbConnect);
    $('#clientsList').append(`
        <div class="list-result">
        <p>${arg.login}</p>
        <p>${arg.ip}</p>
        <label class="switch-button"><input type="checkbox" id="${arg.id}" /><span></span></label>
        </div>
    `);

    $('#'+arg.id).on("change",  function(){
        var checkbox = document.querySelectorAll('input[type="checkbox"]');
        var mybox = this;
        console.log(mybox.checked)
        var check = document.getElementById(arg.id)
        console.log(check.checked)

        if(mybox.checked == false){
            mybox.checked = false
            ipcRenderer.send('ungrantUser', mybox.getAttribute('id'));
        }else{
            for (let i = 0; i < checkbox.length; i++) {
                checkbox[i].checked = false;
            }
            mybox.checked = true;
            ipcRenderer.send('grantUser', mybox.getAttribute('id'));
        }        
    })
});

ipcRenderer.on('boardReady',function(){
    $('.lds-ring').fadeOut(200, function(){
        // If connection is a success
        $('.connect-style').fadeIn(200);
    });   
});

ipcRenderer.on('boardFailed',function(){
    $('.lds-ring').fadeOut(200, function(){
        $('.button-connect').fadeIn(200).before('<span class="info-span">Connexion impossible. Veuillez vérifier vos branchements.</span>');
    }); 
});


// Connect To Arbalet Table Front Animation

    //Show Choice Pin of Arbalet Table
    $('.button-connect').on('click', function(){
        $(this).fadeOut(200, function(){
            $('#error-message').hide()
            $('.choice-pin').fadeIn(200)
        })
    })

    //Verify if connection is a succes
    $('.input-connection button').on('click', function(){
        ipcRenderer.send('connectBoard',$('#pinNB').val());
        $('.choice-pin').fadeOut(200, function(){
            // Loader Spinner
            $('.lds-ring').fadeIn(200);     
        })
    })


// Show information module

$('#informations').on('click', function () {
    $('.overlay-popup').fadeIn(200)
    $('#informations-module').fadeIn(200)
})

$('.overlay-popup').on('click', function () {
    $(this).fadeOut(200, function () {
        $('#informations-module').fadeOut(200)
    })
})







