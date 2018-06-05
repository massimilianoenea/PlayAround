var express = require('express');
var app = express();
var router = express.Router();
app.use(router);
var log = require('../modules/myModules/Controller/Utente/Utente_log');
var action = require('../modules/myModules/Controller/Utente/Utente_action');

router.post('/getUtenteLog',function(req,res){
  res.end(JSON.stringify({email:req.session.email,username:req.session.username}))
});

router.get('/socketio',function(req,res){
    res.sendFile('/Users/massimilianoenea/WebstormProjects/PlayAroundGit/clientSide/resources/socket.io-client-master/dist/socket.io.js');
});

router.get('/prova1',function(req,res){
    res.sendFile('/Users/massimilianoenea/WebstormProjects/PlayAroundGit/clientSide/prova1.html');
});

router.post('/addAmico',function(req,res){
    action.add_amico(req.session.email,req.body.username,function(a){
        res.end(JSON.stringify(a));
    });
});

router.post('/login', function(req, res){
    if(req.session && req.session.islog === 1) {
        res.end(JSON.stringify({code:6,username:req.session.username,email:req.session.email,text:"Welcome Back "+req.session.email}));
    }else {
        log.Get_login(req.body, function (a) {
            if(a.code === 0) {
                req.session.islog = 1;
                req.session.username = a.username;
                req.session.email = a.email;
                req.session.save();
            }
            res.end(JSON.stringify(a));
        });
    }
});

router.post('/logout',function(req,res){
    req.session.islog = 0;
    req.session.save();
    res.end(JSON.stringify({code:"",text:"LOG out success",errorCode:""}));
});

router.post('/singup',function(req,res){
    log.Get_singup(req.body,function(a){
        res.end(JSON.stringify(a));
    });
});

router.post('/conferma_reg',function(req,res){
    log.Confirm_singup(req.body.codice,function(a){
        res.end(JSON.stringify(a));
    });
});

//export this router to use in our index.js
module.exports = router;