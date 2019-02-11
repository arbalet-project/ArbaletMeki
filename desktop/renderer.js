// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron');
let ip = require('ip');

// Show IP
$('#myIp').text(ip.address());

//Events
ipcRenderer.on('addUser',function(event,arg){
    var nbConnect = $('#nbConnected').text();
    nbConnect++;
    $('#nbConnected').text(nbConnect);
    $('#clientsList').append(`
    <div class="list-result">
    <label class="switch-button"><input type="checkbox" id="${arg.id}" /><span></span></label>
    <p>${arg.login}</p>
    <p>${arg.ip}</p>
    <a href="#" class="disconnect-link"></a>
    </div>
    `);
    $('#'+arg.id).on("change",  function(){
        var checkbox = document.querySelectorAll('input[type="checkbox"]');
        var mybox = this;
        for (let i = 0; i < checkbox.length; i++) {
            checkbox[i].checked = false;
        }
        mybox.checked = true;
        ipcRenderer.send('grantUser',mybox.getAttribute('id'));
        console.log(mybox.getAttribute('id'))
    })
});

ipcRenderer.on('removeUser',function(event,arg){
    var nbConnect = $('#nbConnected').text();
    nbConnect--;
    $('#nbConnected').text(nbConnect);
    $('#' + arg).remove();
})

//Animate Active User at top







