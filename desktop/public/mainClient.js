var socket = io();
socket.on('granted',function(){
    alert('Vous avez désormais le controle sur la table ARBALET');
});
$('form').on('submit',function(e){
    e.preventDefault();
    socket.emit('login',$('input').val());
    $('body').append('<button>Déconnexion</button>');
    $('button').on('click',function(){
        logout();
        $('button').remove();
    })
});

function logout(){
    socket.emit('logout');
}