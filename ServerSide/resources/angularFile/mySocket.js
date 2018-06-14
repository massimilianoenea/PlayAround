var socket = io.connect('http://' + window.location.hostname + ':1337', {'forceNew': true});

function runSocket() {
    socket = io.connect('http://' + window.location.hostname + ':1337', {'forceNew': true});
    return socket.connected;
}

function isConnected(){
    if(socket.connected === false) return runSocket();
    return socket.connected;
}

socket.on('connect', function () {
    console.log("connected to socket");
});

socket.on('message', function (data) {
    console.log(data);
});

function update_friend(userLogged) {
    if (socket.connected === true) {
        socket.emit('getFriend', {username: userLogged.username, email: userLogged.email});
        return true;
    } else {
        runSocket();
    }
}

function send_message(data) {
    if (socket.connected === true) {
        socket.emit('event', {username: data.username, data: data.text, date: new Date()});
        return true;
    } else {
        runSocket();
    }
}

// PER IL PLAYER MUSICALE


//var player = document.getElementById('audio');
//var progressBar  = document.getElementById('progress-bar');

/*

function load_Music(data){
    if (socket.connected === true) {
        socket.emit('stream', {username:data.username});
    }else{
        runSocket();
    }
}

player.addEventListener('timeupdate', updateProgressBar, false);
progressBar.addEventListener("click", seek);

function seek(e) {
    if (player.src) {
        var percent = e.offsetX / this.offsetWidth;
        player.currentTime = percent * player.duration;
        e.target.value = Math.floor(percent / 100);
    }
}

function updateProgressBar() {
    // Work out how much of the media has played via the duration and currentTime parameters
    var percentage = Math.floor((100 / player.duration) * player.currentTime);

     LOCAL VERSION
    // Update the progress bar's value
    //progressBar.value = percentage;
    // Update the progress bar's text (for browsers that don't support the progress element)
    //progressBar.innerHTML = progressBar.title = percentage + '% played';

    socket.emit('PercentageBar', {progress:percentage});
}

socket.on('updateProgressBar',function(data){
    console.log(data);
    progressBar.value = data;
});

function play_new(data){
    var play_button = document.getElementById('Play_button');
    if (socket.connected === true) {
        if (play_button.innerHTML === 'play') {
            socket.emit('play', {username: data.username});
        } else if(play_button.innerHTML === 'pause'){
            socket.emit('pause', {username: data.username});
        }
    }else{
        if(runSocket() === true) play_new(data);
    }
}

socket.on('play_music',function(data){
    var player = document.getElementById('audio');
   player.play();
});
socket.on('pause_music',function(data){
    var player = document.getElementById('audio');
    player.pause();
});
socket.on('play_button',function(data){
    var play_button = document.getElementById('Play_button');
    play_button.innerHTML = 'play';
});
socket.on('pause_button',function(data){
    console.log('pause_button '+data);
    var play_button = document.getElementById('Play_button');
    play_button.innerHTML = 'pause';
});

ss(socket).on('audio-stream', function (stream, data) {
    var parts = [];
    var audio = document.getElementById('audio');
    stream.on('data', (chunk) => {
        parts.push(chunk);
    });
    stream.on('end', function () {
        audio.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
    });
});

function set_dispositivo(userLogged){
    if (socket.connected === true) {
        socket.emit('player_room', {username: userLogged.username});
        return true;
    } else {
        runSocket();
    }
}

socket.on('player_room_response',function (data) {
    if(data.length > 1){
        //var modal = document.getElementById('myModal');
        //modal.style.display = "block";
        for (var dispositivo in data){
            if(data[dispositivo].Current_client) {
                console.log("il dispositivo corrente è: " + data[dispositivo].Current_client + "con ID: " + data[dispositivo].clientId);
            }else{
                console.log("un dispositivo è: " + data[dispositivo].client + "con ID: " + data[dispositivo].clientId);
            }
        }
    }
});

*/