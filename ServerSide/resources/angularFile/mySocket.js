var socket;
function runSocket() {
     socket = io.connect('http://' + window.location.hostname + ':1337', {'forceNew': true});
    socket.on('connect', function () {
        console.log("connected to socket");
    });
    socket.on('message', function (data) {
        console.log(data);
    });
}

function update_friend(userLogged){
    if (socket.connected === true){
        socket.emit('getFriend', {username: userLogged.username, email: userLogged.email});
    }else{
        runSocket();
    }
}

function send_message(data){
    if (socket.connected === true){
        socket.emit('event', {username: data.username, data: data.text, date: new Date()});
    }else{
        runSocket();
    }
}