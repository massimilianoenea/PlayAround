var express = require('express');
var app = express();
var router = express.Router();
const path = require('path').join(__dirname,'../public');
var log = require('../modules/myModules/Controller/Utente/Utente_log');
var complete_reg = require('../modules/myModules/Controller/Complete_registration/Complete_Reg');
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

router.get('/autocomplete/artist/:searched',function(req,res){
    complete_reg.search_artista(req.params.searched,function (a) {
       res.status(a.status).end(JSON.stringify(a));
    });
});

router.get('/autocomplete/genere/:searched',function(req,res){
    complete_reg.search_genere(req.params.searched,function (a) {
        res.status(a.status).end(JSON.stringify(a));
    });
});

router.post('/Complete_Reg',function(req,res){
    complete_reg.complete_reg(req.body,req.session.email,function(a){
        res.status(a.status).end(JSON.stringify(a));
    });
});

router.get('/',function(req,res){
    res.sendFile(path +'/login.html');
});

router.get('/prova1',function(req,res){
    res.sendFile(path +'/prova1.html');
});

router.get('/multiForm',function(req,res){
    res.sendFile(path +'/multiStepForm.html');
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