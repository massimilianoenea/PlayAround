var express = require('express');
var app = express();
var router = express.Router();
var playlist = require('../modules/myModules/Controller/Music/Playlist');
var brani = require('../modules/myModules/Controller/Music/Brani');
//var utente = require('../modules/myModules/Controller/Utente/Utente_action');
app.use(router);


//HOMEPAGE
router.get("/playlist_giornaliera/:data",function(req,res){
   playlist.playlist_giornaliera(req.params.data,function(a){
       var json = [];
       if(a.status === 200) {
           for (playlist in a) {
               json.push({
                   nome: a.text[playlist].NOME,
                   codice: a.text[playlist].CODPLAYLIST,
                   immagine: "image/playlist/" + a.text[playlist].CODPLAYLIST
               });
           }
       }
     res.status(a.status).end(JSON.stringify(json));
   });
});

router.get("/ascoltati_recente",function (req,res){
    if(req.session.islog === 1) {
        brani.ascoltati_di_recente(req.session.username,function(a){
            var json = [];
            if(a.status === 200) {
                for (brano in a) {
                    json.push({
                        nome: a.text[brano].TITOLO,
                        codice: a.text[brano].CODBRANO,
                        immagine: a.text[brano].IMMAGINE
                    })
                }
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.get("/ascoltano_amici",function (req,res){
    if(req.session.islog === 1) {
        brani.ascoltano_amici(req.session.email,function(a){
            var json = [];
            if(a.status === 200) {
                for (brano in a) {
                    json.push({
                        nome: a.text[brano].TITOLO,
                        codice: a.text[brano].CODBRANO,
                        immagine: a.text[brano].IMMAGINE
                    })
                }
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

// PAGINA DELL'UTENTE

/*
router.get("/utente/:username",function(req,res){
    if(req.session.islog === 1) {
        utente.get_utente(req.params.username,req.session.email,function(a){
            var json = "";
            if(a.status === 200) {
                json = {
                    username: a.text[0].USERNAME,
                    immagine: "image/profile/" + a.text[0].USERNAME,
                    amici: a.amici
                };
            }
        res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.get("/add_amico/:username",function(req,res){
    if(req.session.islog === 1) {
        utente.add_amico(req.session.email,req.params.username,function(a){
            res.status(a.status).end(JSON.stringify(a));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.get("/delete_amico/:username",function(req,res){
    if(req.session.islog === 1) {
        utente.delete_amico(req.session.email,req.params.username,function(a){
            res.status(a.status).end(JSON.stringify(a));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.get("/ascoltati_recente_utente/:username",function (req,res){
    if(req.session.islog === 1) {
        brani.ascoltati_di_recente(req.params.username,function(a){
            var json = [];
            if(a.status === 200) {
                for (brano in a) {
                    json.push({
                        nome: a.text[brano].TITOLO,
                        codice: a.text[brano].CODBRANO,
                        immagine: a.text[brano].IMMAGINE
                    })
                }
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

// DEVO AGGIUNGERE ARTISTI SEGUITI //

*/


module.exports = router;
