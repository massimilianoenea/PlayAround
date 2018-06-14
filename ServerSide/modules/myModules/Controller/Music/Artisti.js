var artisti_model = require('../../model/Artisti/Artisti');

module.exports = {
    get_artista : function(codartista,email,callback){
        artisti_model.get_artista(codartista,email,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile visualizzare l'artista selezionato",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                if(code === 0) return callback({code:0,data:succ,status:200,follow:false});
                if(code === 1) return callback({code:0,data:succ,status:200,follow:true});
            }
        });
    },

    get_artisti_seguiti : function(username,callback){
        artisti_model.get_artisti_seguiti(username,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile caricare la lista di artisti",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    },

    get_last_album: function(codartista,callback){
        artisti_model.get_last_album(codartista,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile caricare la lista di album",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    }
};