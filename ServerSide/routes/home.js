var express = require('express');
var app = express();
var router = express.Router();
const path = require('path').join(__dirname,'../public');
var log = require('../modules/myModules/Controller/Utente/Utente_log');
app.use(router);

router.get('/confirm_registration/:token',function(req,res){
    log.Confirm_singup(req.params.token,function(a){
        if(a.code === 0){
            res.writeHead(301, { "Location": "http://" + req.get('host')+ '/login' });
            res.end();
        }else{
            res.writeHead(301, { "Location": "http://" + req.get('host') + '/tokenExpired' });
            res.end();
        }
    });
});


router.get('/',function(req,res){
    res.sendFile(path +'/login.html');
});

router.get('/login',function(req,res){
    res.sendFile(path +'/login.html');
});

router.get('/webApp',function(req,res){
    res.sendFile(path +'/PlayAround.html');
});

router.get('/registration',function(req,res){
    res.sendFile(path +'/registration.html');
});

router.get('/tokenExpired',function(req,res){
    res.sendFile(path +'/tokenScaduto.html');
});

module.exports = router;