var bodyParser = require('body-parser');
var user = require('./routes/user.js');
var home = require('./routes/home.js');
var item = require('./routes/AppItem');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var fs = require('fs');


var socketFunction = require('./SocketFunction/Friend.js');
app.set('port', ( process.env.PORT || 1337 ));
app.use('/public',express.static(__dirname+'/resources'));
app.use('/image',express.static(__dirname+'/resources/image'));

app.use(cookieParser());
app.use(session({
    key: "nsid",
    secret: "some secret password",
    cookie: {
        "path": "/",
        "httpOnly": false,
        "maxAge": null,
        "secure": false
    },
    resave: true,
    saveUninitialized: true,
    proxy: null
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*',function(req, res, next) {
    var origin;
    if ( req.method === 'OPTIONS' ) {
        if(req.headers.origin){
            origin = req.headers.origin;
        }else{
            origin = req.headers.host;
        }
        res.writeHead(200, {
            'Access-Control-Allow-Origin':origin,
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Length': 0
        });
        res.end();
    }else {
        if(req.headers.origin){
            origin = req.headers.origin;
        }else{
            origin = req.headers.host;
        }
        res.header('Access-Control-Allow-Credentials', 'true');
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, Accept, X-Requested-With, application/json");
        res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
        next();
    }
});

app.use("/",home);
app.use("/playaround",user);
app.use("/require",item);


io.on('connection', function(client) {

    client.on('disconnect', function() {
        console.log("disconnected");
    });

    client.on('getFriend',function(data){
        console.log('getFriend per '+ data.username);
        socketFunction.GetFriend(data.email,function (a){
            if(a.code === 0){
                for (var room in a.amici_on) {
                    client.join(a.amici_on[room].USERNAME);
                    console.log(' Client joined the room ' + a.amici_on[room].USERNAME + ' and client id is ' + client.id);
                }
            }
            client.join(data.username);
        });
    });


    client.on('event', function(data) {
        console.log('event');
        io.sockets.in(data.username).emit('message', data.data);
       // client.in(data.username).emit('message', data.data);
    });


    client.on('player_room', function(data) {
        var clients;
        var currentClients;
        if(io.sockets.adapter.rooms[data.username+"_player"]) clients = io.sockets.adapter.rooms[data.username+"_player"].sockets;
        if(io.sockets.adapter.rooms[data.username+"_CurrentPlayer"]) currentClients = io.sockets.adapter.rooms[data.username+"_CurrentPlayer"].sockets;
        var array=[];
        if(clients === undefined && currentClients === undefined){
            client.join(data.username+"_CurrentPlayer");
            client.join(data.username+"_player");
            array.push({Current_client:client.request.headers['user-agent'],clientId:client.id});
        } else {
            client.join(data.username+"_player");
            var SocketCurrent;
            for(var Id in currentClients){
                SocketCurrent = io.sockets.connected[Id];
                array.push({Current_client:SocketCurrent.request.headers['user-agent'], clientId: SocketCurrent.id});
            }
            for (var clientId in clients ) {
                //this is the socket of each client in the room.
                var SocketofClient = io.sockets.connected[clientId];
                if(SocketofClient.id !== SocketCurrent.id) {
                    array.push({client:SocketofClient.request.headers['user-agent'], clientId: SocketofClient.id});
                }
            }
        }
        client.emit('player_room_response',array);
    });

    client.on('play', function(data) {
        if(io.sockets.adapter.rooms[data.username+"_CurrentPlayer"]) {
            var currentClients = io.sockets.adapter.rooms[data.username + "_CurrentPlayer"].sockets;

            var currentId;
            for (var Id in currentClients) {
                currentId = io.sockets.connected[Id].id;
            }

            if (currentId === client.id) {
                io.sockets.in(data.username + "_CurrentPlayer").emit('play_music', data.username);
            } else {
                client.in(data.username + "_CurrentPlayer").emit('play_music', data.username);
            }
            io.sockets.in(data.username + "_player").emit('pause_button', data.username);
        }else{
            io.sockets.in(data.username).emit('newSetDevice',data.username);
        }
    });

    client.on('pause', function(data) {
        if(io.sockets.adapter.rooms[data.username+"_CurrentPlayer"]) {
            var currentClients = io.sockets.adapter.rooms[data.username+"_CurrentPlayer"].sockets;
            var currentId;
            for(var Id in currentClients){
                currentId = io.sockets.connected[Id].id;
            }
            if(currentId === client.id){
                io.sockets.in(data.username+"_CurrentPlayer").emit('pause_music',data.username);
            }else{
                client.in(data.username+"_CurrentPlayer").emit('pause_music',data.username);
            }
            io.sockets.in(data.username+"_player").emit('play_button',data.username);
        }else{
            io.sockets.in(data.username).emit('newSetDevice',data.username);
        }
    });

    client.on('PercentageBar',function(data){
        io.sockets.in(data.username+"_player").emit('updateProgressBar',{progress:data.progress,currentTime:data.currentTime});
    });

    client.on('stream', function(data) {
        if(io.sockets.adapter.rooms[data.username+"_CurrentPlayer"]){
            var clients = io.sockets.adapter.rooms[data.username+'_CurrentPlayer'].sockets;
            for (var clientId in clients ) {
                //this is the socket of each client in the room.
                var SocketofClient = io.sockets.connected[clientId];
                //if (SocketofClient.id !== client.id) {
                    var stream = ss.createStream();
                    var filename = __dirname + '/penningen.mp3';
                    ss(SocketofClient).emit('audio-stream', stream, {name: filename});
                    fs.createReadStream(filename).pipe(stream);
               // }
            }
        }else{
            io.sockets.in(data.username).emit('newSetDevice',data.username);
        }

    });

});

http.listen(app.get('port'),function(){
    console.log("Listen on" + app.get('port'));
});
