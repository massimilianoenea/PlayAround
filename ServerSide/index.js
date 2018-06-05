var bodyParser = require('body-parser');
var user = require('./routes/user.js');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var socketFunction = require('./SocketFunction/Friend.js');

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



// PER EFFETTUARE IL CROSS DOMAIN

/*
app.use(function(req, res, next) {

if ( req.method === 'OPTIONS' ) {
res.writeHead(200, {
    'Access-Control-Allow-Origin':
    req.headers.origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Length': 0
});
res.end();
}else {
res.header('Access-Control-Allow-Credentials', 'true');
res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
res.setHeader("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, Accept, X-Requested-With");
res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
next();
}
});
*/


app.use("/playaround",user);
//app.use("/AppItem",);
io.on('connection', function(client) {

    client.on('disconnect', function() {
        console.log("disconnected");
        client.leaveAll();
    });

    client.on('getFriend',function(data){
        console.log(data.email,data.username);
        socketFunction.GetFriend(data.email,function (a){
            if(a.code === 0){
                for (var room in a.amici_on){
                    client.join(a.amici_on[room].USERNAME);
                    console.log(' Client joined the room '+a.amici_on[room].USERNAME+' and client id is '+ client.id);
                }
                client.join(data.username);
            }
        });
    });

    // NON PIU USATA
    client.on('room', function(data) {
        client.join(data.roomId);
        console.log(' Client joined the room and client id is '+ client.id);
    });

    client.on('event', function(data) {
       client.in(data.username).emit('message', data.data);
    });
});

http.listen(1337,function(){
    console.log("Listen on 1337");
});