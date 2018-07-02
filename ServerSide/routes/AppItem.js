var express = require('express');
var app = express();
var router = express.Router();
var playlist = require('../modules/myModules/Controller/Music/Playlist');
var brani = require('../modules/myModules/Controller/Music/Brani');
var artisti = require('../modules/myModules/Controller/Music/Artisti');
var album = require('../modules/myModules/Controller/Music/Album');
var utente = require('../modules/myModules/Controller/Utente/Utente_action');
var search = require('../modules/myModules/Controller/Search/search');
app.use(router);

//SEARCH BAR

router.get("/search/:string",function(req,res){
   if(req.session.islog === 1){
       search.get_search(req.params.string,function(a){
          if(a.status === 200){
              res.status(a.status).end(JSON.stringify(a.data));
          }else{
              res.status(a.status).end(JSON.stringify(a));
          }
       });

   }else{
       res.status(500).end();
   }
});

//HOMEPAGE
router.get("/playlist_giornaliera/:data",function(req,res){
   playlist.playlist_giornaliera(req.params.data,function(a){
       var json;
       if(a.status === 200) {
           json = [];
           for (var playlist in a.data) {
               json.push({
                   nome: a.data[playlist].NOME,
                   codice: a.data[playlist].CODPLAYLIST,
                   immagine: "image/playlist/" + a.data[playlist].CODPLAYLIST + ".jpeg"
               });
           }
       }else{
           json = a;
       }
     res.status(a.status).end(JSON.stringify(json));
   });
});

router.get("/ascoltati_recente",function (req,res){
    if(req.session.islog === 1) {
        brani.ascoltati_di_recente(req.session.username,function(a){
            var json;
            if(a.status === 200) {
                json = [];
                for (var brano in a.data) {
                    json.push({
                        titolo: a.data[brano].titolo,
                        codice: a.data[brano].codice,
                        immagine: a.data[brano].immagine,
                        anno : a.data[brano].anno,
                        album : a.data[brano].album,
                        artista: a.data[brano].artista
                    });
                }
            }else {
                json = a;
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
            var json;
            if(a.status === 200) {
                json = [];
                for (var brano in a.data) {
                    json.push({
                        titolo: a.data[brano].titolo,
                        codice: a.data[brano].codice,
                        immagine: a.data[brano].immagine,
                        anno : a.data[brano].anno,
                        album : a.data[brano].album,
                        artista: a.data[brano].artista
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

// PAGINA DELL'UTENTE

router.get("/utente/:username",function(req,res){
    if(req.session.islog === 1 && req.params.username !== req.session.username) {
        utente.get_utente(req.params.username,req.session.email,function(a){
            var json = "";
            if(a.status === 200) {
                json = {
                    username: a.data[0].USERNAME,
                    immagine: "image/profile/" + a.data[0].USERNAME+".png",
                    amici: a.amici
                };
            }else{
                json = a;
            }
        res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.post("/add_amico",function(req,res){
    if(req.session.islog === 1) {
        utente.add_amico(req.session.email,req.body.username,function(a){
            res.status(a.status).end(JSON.stringify(a));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.post("/delete_amico",function(req,res){
    if(req.session.islog === 1) {
        utente.delete_amico(req.session.email,req.body.username,function(a){
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
            var json;
            if(a.status === 200) {
                json = [];
                for (var brano in a.data) {
                    json.push({
                        titolo: a.data[brano].titolo,
                        codice: a.data[brano].codice,
                        immagine: a.data[brano].immagine,
                        anno : a.data[brano].anno,
                        album : a.data[brano].album,
                        artista: a.data[brano].artista
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.get("/artisti_seguiti/:username",function (req,res){
    if(req.session.islog === 1) {
        artisti.get_artisti_seguiti(req.params.username,function(a){
            var json;
            if(a.status === 200) {
                json = [];
                for (var artista in a.data) {
                    json.push({
                        tipo: a.data[artista].TIPO,
                        nome: a.data[artista].NOME,
                        nome_arte: a.data[artista].NOME_ARTE,
                        codice: a.data[artista].CODARTISTA,
                        nazionalita: a.data[artista].NAZIONALITA,
                        immagine: a.data[artista].IMMAGINE
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});


// PAGINA DELL'ARTISTA //

router.get("/artista/:codartista",function (req,res){
    if(req.session.islog === 1) {
        artisti.get_artista(req.params.codartista,req.session.email,function(a){
            var json = "";
            if(a.status === 200) {
                json = {
                    tipo: a.data.TIPO,
                    nome: a.data.NOME,
                    nome_arte: a.data.NOME_ARTE,
                    codice: a.data.CODARTISTA,
                    nazionalita: a.data.NAZIONALITA,
                    immagine: a.data.IMMAGINE,
                    followed: a.follow
                };
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.get("/canzoni_ascoltate/:codartista",function(req,res){
   if(req.session.islog === 1){
       brani.get_piu_ascoltate(req.params.codartista,function(a){
           var json;
           if(a.status === 200) {
               json = [];
               for (var brano in a.data) {
                   json.push({
                       titolo: a.data[brano].titolo,
                       codice: a.data[brano].codice,
                       immagine: a.data[brano].immagine,
                       anno : a.data[brano].anno,
                       album : a.data[brano].album,
                       artista: a.data[brano].artista
                   });
               }
           }else{
               json = a;
           }
           res.status(a.status).end(JSON.stringify(json));
       });
   }else{
       // POTREBBE REINDIRIZZARE AL LOGIN
       res.status(500).end();
   }
});

router.post("/follow_artista",function (req,res) {
   if(req.session.islog === 1){
       utente.follow_artista(req.session.email,req.body.codartista,function(a){
          res.status(a.status).end(JSON.stringify(a));
       });
   }else{
       res.status(500).end()
   }
});

router.post("/unfollow_artista",function (req,res) {
    if(req.session.islog === 1){
        utente.unfollow_artista(req.session.email,req.body.codartista,function(a){
            res.status(a.status).end(JSON.stringify(a));
        });
    }else{
        res.status(500).end()
    }
});

// PAGINA DEGLI ALBUM//

router.get("/get_album/:codalbum",function(req,res){
    if(req.session.islog === 1) {
        album.get_album(req.params.codalbum, function (a) {
            var json = "";
            if (a.status === 200) {
                json = ({
                    titolo: a.data.TITOLO,
                    codice: a.data.CODALBUM,
                    anno: a.data.ANNO,
                    immagine: a.data.IMMAGINE
                });
                res.status(a.status).end(JSON.stringify(json));
            }else {
                res.status(a.status).end(JSON.stringify(a));
            }
        });
    }else{
        res.status(500).end();
    }
});

router.get("/get_brani_album/:codalbum",function(req,res){
    if(req.session.islog === 1) {
        album.get_brani_album(req.params.codalbum, function (a) {
            var json;
            if (a.status === 200) {
                json = [];
                for (var brano in a.data) {
                    json.push({
                        titolo: a.data[brano].titolo,
                        codice: a.data[brano].codice,
                        immagine: a.data[brano].immagine,
                        anno : a.data[brano].anno,
                        album : a.data[brano].album,
                        artista: a.data[brano].artista
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        res.status(500).end();
    }
});

router.get("/get_altro_artista/:codartista",function(req,res){
    if(req.session.islog === 1) {
        album.get_altro_artista(req.params.codartista, function (a) {
            var json;
            if (a.status === 200) {
                json = [];
                for (var album in a.data) {
                    json.push({
                        titolo: a.data[album].TITOLO,
                        codice: a.data[album].CODALBUM,
                        anno: a.data[album].ANNO,
                        immagine: a.data[album].IMMAGINE
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        res.status(500).end();
    }
});


// LA TUA LIBRERIA //

// LE TUE PLAYLIST //

router.get("/get_brani_playlist/:codplaylist",function (req,res) {
    if(req.session.islog === 1) {
        playlist.get_brani_playlist(req.params.codplaylist, function (a) {
            var json;
            if (a.status === 200) {
                json = [];
                for (var brano in a.data) {
                    json.push({
                        titolo: a.data[brano].titolo,
                        codice: a.data[brano].codice,
                        immagine: a.data[brano].immagine,
                        anno : a.data[brano].anno,
                        album : a.data[brano].album,
                        artista: a.data[brano].artista
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        res.status(500).end();
    }
});

router.get("/nome_playlist/:codplaylist",function(req,res){
    if(req.session.islog === 1){
        playlist.get_nome_playlist(req.params.codplaylist,function(a){
            var json = "";
            if(a.status === 200 && a.data[0] !== undefined){
                json = {nome:a.data[0].nome};
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        res.status(500).end();
    }
});

router.get("/le_tue_playlist",function(req,res){
   if(req.session.islog === 1){
       playlist.get_playlist_utente(req.session.username,function(a){
           var json;
           if(a.status === 200 && a.code === 0) {
               json = [];
               for (var playlist in a.data) {
                   json.push({
                       nome: a.data[playlist].NOME_PLAYLIST,
                       codice: a.data[playlist].CODPLAYLIST,
                       immagine: "image/playlist/" + a.data[playlist].CODPLAYLIST+".jpg"
                   });
               }
           }else{
               json = a;
           }
           res.status(a.status).end(JSON.stringify(json));
       });
   }else{
       res.status(500).end();
   }
});

router.post("/nuova_playlist" ,function (req,res){
    if(req.session.islog === 1){
        playlist.new_playlist(req.session.email,req.body.nome_playlist,function(a){
            if(a.status === 200) {
                res.status(a.status).end(JSON.stringify(a.data));
            }else{
                res.status(a.status).end(JSON.stringify(a));
            }
        });
    }else{
        res.status(500).end();
    }
});

router.post("/delete_playlist",function (req,res){
    if(req.session.islog === 1){
        playlist.delete_playlist(req.session.email,req.body.nome_playlist,function(a){
            if(a.status === 200) {
                res.status(a.status).end(JSON.stringify(a.data));
            }else{
                res.status(a.status).end(JSON.stringify(a));
            }
        });
    }else{
        res.status(500).end();
    }
});

router.post("/add_song",function(req,res){
    if(req.session.islog === 1){
     playlist.add_song_playlist(req.session.email,req.body.nome_playlist,req.body.codbrano,function(a){
         if(a.status === 200) {
             res.status(a.status).end(JSON.stringify(a.data));
         }else{
             res.status(a.status).end(JSON.stringify(a));
         }
     });
    }else{
        res.status(500).end();
    }
});

router.post("/delete_song",function(req,res){
    if(req.session.islog === 1){
        playlist.delete_song_playlist(req.session.email,req.body.nome_playlist,req.body.codbrano,function(a){
            if(a.status === 200) {
                res.status(a.status).end(JSON.stringify(a.data));
            }else{
                res.status(a.status).end(JSON.stringify(a));
            }
        });
    }else{
        res.status(500).end();
    }
});

// LE TUE CANZONI //

router.get("/canzoni_salvate",function(req,res){
    if(req.session.islog === 1){
        brani.get_canzoni_salvate(req.session.email,function(a){
            var json;
            if(a.status === 200) {
                json = [];
                for (var brano in a.data) {
                    json.push({
                        titolo: a.data[brano].titolo,
                        codice: a.data[brano].codice,
                        immagine: a.data[brano].immagine,
                        anno : a.data[brano].anno,
                        album : a.data[brano].album,
                        artista: a.data[brano].artista
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        res.status(500).end();
    }
});

router.get("/ascoltate_recente",function(req,res){
   if(req.session.islog === 1){
       brani.ascoltati_di_recente(req.session.username,function(a){
           var json;
           if(a.status === 200) {
               json = [];
               for (var brano in a.data) {
                   json.push({
                       titolo: a.data[brano].titolo,
                       codice: a.data[brano].codice,
                       immagine: a.data[brano].immagine,
                       anno : a.data[brano].anno,
                       album : a.data[brano].album,
                       artista: a.data[brano].artista
                   });
               }
           }else{
               json = a;
           }
           res.status(a.status).end(JSON.stringify(json));
       });
   }else{
       res.status(500).end();
   }
});

// PREFERITI //

router.get("/artisti_seguiti",function (req,res){
    if(req.session.islog === 1) {
        artisti.get_artisti_seguiti(req.session.username,function(a){
            var json;
            if(a.status === 200) {
                json = [];
                for (var artista in a.data) {
                    json.push({
                        tipo: a.data[artista].TIPO,
                        nome: a.data[artista].NOME,
                        nome_arte: a.data[artista].NOME_ARTE,
                        codice: a.data[artista].CODARTISTA,
                        nazionalita: a.data[artista].NAZIONALITA,
                        immagine: a.data[artista].IMMAGINE
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

// LISTA DEGLI AMICI //

router.get("/get_amici",function(req,res){
   if(req.session.islog === 1){
       utente.get_amici(req.session.email,function(a){
           var json;
           if(a.status === 200) {
               json = [];
               for (var utente in a.data) {
                   json.push({
                       nome: a.data[utente].USERNAME,
                       codice: a.data[utente].CODUTENTE,
                       immagine: "image/profile/"+a.data[utente].USERNAME+".png"
                   });
               }
           }else{
               json = a;
           }
           res.status(a.status).end(JSON.stringify(json));
       });
   }
});

// GENERE E MOOD DA FARE //

// I PIU ASCOLTATI "DAL MONDO"//

router.get("/piu_ascoltate",function(req,res){
   if(req.session.islog){
       brani.get_piu_ascoltate("",function(a){
           var json;
           if(a.status === 200) {
               json = [];
               for (var brano in a.data) {
                   json.push({
                       titolo: a.data[brano].titolo,
                       codice: a.data[brano].codice,
                       immagine: a.data[brano].immagine,
                       anno : a.data[brano].anno,
                       album : a.data[brano].album,
                       artista: a.data[brano].artista
                   });
               }
           }else {
               json = a;
           }
           res.status(a.status).end(JSON.stringify(json));
       });
   }else{
       // POTREBBE REINDIRIZZARE AL LOGIN
       res.status(500).end();
   }
});

// SCELTI PER TE DA FARE //


// FUNZIONI PER I BRANI //

router.post("/setPreferito",function(req,res){
    if(req.session.islog){
        brani.set_canzoni_salvate(req.session.email,req.body.codbrano,function(a) {
            res.status(a.status).end(JSON.stringify(a));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.post("/removePreferito",function(req,res){
    if(req.session.islog){
        brani.remove_canzoni_salvate(req.session.email,req.body.codbrano,function(a) {
            res.status(a.status).end(JSON.stringify(a));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

router.get("/brano/:codbrano",function(req,res){
   if(req.session.islog){
       brani.get_full_brano(req.params.codbrano,function(a){
           var json;
           if(a.status === 200) {
               json = [];
               for (var brano in a.data) {
                   json.push({
                       titolo: a.data[brano].titolo,
                       codice: a.data[brano].codice,
                       immagine: a.data[brano].immagine,
                       anno : a.data[brano].anno,
                       album : a.data[brano].album,
                       artista: a.data[brano].artista
                   });
               }
           }else{
               json = a;
           }
           res.status(a.status).end(JSON.stringify(json));
       });
   }else{
       // POTREBBE REINDIRIZZARE AL LOGIN
       res.status(500).end();
   }
});
// Ritorna il brano cercato per titolo del brano
router.get("/brano_titolo/:titolo",function(req,res){
    if(req.session.islog){
        brani.get_full_brano_titolo(req.params.titolo,function(a){
            var json;
            if(a.status === 200) {
                json = [];
                for (var brano in a.data) {
                    json.push({
                        titolo: a.data[brano].titolo,
                        codice: a.data[brano].codice,
                        immagine: a.data[brano].immagine,
                        anno : a.data[brano].anno,
                        album : a.data[brano].album,
                        artista: a.data[brano].artista
                    });
                }
            }else{
                json = a;
            }
            res.status(a.status).end(JSON.stringify(json));
        });
    }else{
        // POTREBBE REINDIRIZZARE AL LOGIN
        res.status(500).end();
    }
});

module.exports = router;
