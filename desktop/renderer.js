// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron');

ipcRenderer.on('addUser',function(event,arg){
    var nbConnect = $('#nbConnected').text();
    nbConnect++;
    $('#nbConnected').text(nbConnect);
    $('#clientsList').append('<li id="'+ arg.id +'"> Login:' + arg.login + ' IP: ' + arg.ip + '</li>');
});

ipcRenderer.on('removeUser',function(event,arg){
    var nbConnect = $('#nbConnected').text();
    nbConnect--;
    $('#nbConnected').text(nbConnect);
    $('#' + arg).remove();
})