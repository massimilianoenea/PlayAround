var http = require('http');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();

dispatcher.setStatic('/resources');
dispatcher.setStaticDirname('static');

dispatcher.onPost("/try_singup", function(req, res) {
    //prendo il json e lo rendo parse
    var jsonReq = JSON.parse(req.body);
    var jsonRes;

    if(jsonReq['email']=="email"){
        //errore email già esiste
        res.writeHead(401, {'Content-Type': 'application/json'});
        jsonRes = {error:"ER01"};
    }else if(jsonReq['username']=="username"){
        //errore username già esiste
        res.writeHead(401, {'Content-Type': 'application/json'});
        jsonRes={error:"ER02"};
    }else{
        //registrazione effettuata
        jsonRes={error:"OK01"};
    }
    //res.writeHead(200, {'Content-Type': 'application/json'});
    //rimando il parse in json
    res.end(JSON.stringify(jsonRes));
});

dispatcher.onPost("/try_login", function(req, res) {
    //prendo il json e lo rendo parse
    var jsonReq = JSON.parse(req.body);
    var jsonRes ;
    if(jsonReq['email']=="email" && jsonReq['password'] == "password"){
        jsonRes = {username:"username",codutente:"codutente",immagine:"../node_modules/httpdispatcher/test/static/resources/profile/codutente.jpg"};
    }else if(jsonReq['email']!="email"){
        //errore email inserita non esiste
        res.writeHead(401, {'Content-Type': 'application/json'});
        jsonRes={error:"ER01"};
    }else if(jsonReq['password'] != "password"){
        //errore password inserita non è corretta
        res.writeHead(401, {'Content-Type': 'application/json'});
        jsonRes={error:"ER02"};
    }else{
        //errore indefinito
        res.writeHead(401, {'Content-Type': 'application/json'});
        jsonRes={error:"ER03"};
    }
    //res.writeHead(200, {'Content-Type': 'application/json'});
    //rimando il parse in json
    res.end(JSON.stringify(jsonRes));
});

http.createServer(function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, Accept, X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    dispatcher.dispatch(req, res);
}).listen(1337,'127.0.0.1');

console.log('listen on 1337');