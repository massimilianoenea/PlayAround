var express = require('express');
var app = express();
var router = express.Router();
app.use(router);
const pathMod = require('path');
const path = pathMod.join(__dirname,'../resources/image');
const fs = require('fs');
var log = require('../modules/myModules/Controller/Utente/Utente_log');
var action = require('../modules/myModules/Controller/Utente/Utente_action');
var multiparty = require('connect-multiparty');
multipartyMiddleware = multiparty();

router.post('/upload_profile',multipartyMiddleware,function(req,res){

    fs.readFile(req.files.file.path, function (err, data) {
        fs.writeFile(path+"/profile/"+req.session.username+".png", data, function (err) {
            if (err) {
                return console.warn(err);
            }
            res.end("Immagine profilo caricata con successo");
        });
    });
    res.end("Immagine non caricata correttamente, riprova");
});

router.post('/getUtenteLog',function(req,res){
    if(req.session.islog === 1){
        var immagine = "/image/profile/default/def.png";
        if(fs.existsSync(path+"/profile/"+req.session.username+".png")) immagine = "/image/profile/"+req.session.username+".png";
        res.status(200).end(JSON.stringify({email:req.session.email,username:req.session.username,immagine:immagine}));
    }else {
        res.status(400).end();
    }
});

router.post('/addAmico',function(req,res){
    action.add_amico(req.session.email,req.body.username,function(a){
        res.end(JSON.stringify(a));
    });
});

router.post('/login', function(req, res){
    log.Get_login(req.body, function (a) {
        if(a.code === 0) {
            req.session.islog = 1;
            req.session.username = a.username;
            req.session.email = a.email;
            req.session.completed = a.completed;
            req.session.save();
            if (a.completed === 0) {
                res.status(200).end(JSON.stringify({location: '/multiForm'}));
            } else {
                res.status(200).end(JSON.stringify({location: '/webapp'}));
            }
        }else{
            res.status(400).end(JSON.stringify({message: a.text}));
        }
    });
});

router.post('/logout',function(req,res){
    req.session.islog = 0;
    req.session.save();
    res.end(JSON.stringify({code:"",text:"LOG out success",errorCode:""}));
});

router.post('/singup',function(req,res){
    log.Get_singup(req.body,req.get('host'),function(a){
        res.end(JSON.stringify(a));
    });
});

module.exports = router;