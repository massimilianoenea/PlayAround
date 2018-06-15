var album_model = require('../../model/Album/Album');

module.exports = {
    get_album: function (codalbum,callback){
        album_model.get_album(codalbum,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile caricare l'album selezionato",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    }

  get_brani_album : function (codalbum,callback){
      album_model.get_brani_album(codalbum,function(err,succ,code){
          if (err !== null){
              switch (code){
                  case 1:
                      return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                  case 2:
                      return callback({code:2,text:"Impossibile caricare i brani di questo album",errorCode:err.code,status:400});
                  default:
                      return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
              }
          }else{
              return callback({code:0,data:succ,status:200});
          }
      });
  },

    get_altro_artista: function (codartista,callback){
        album_model.get_altro_artista(codartista,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile caricare altri album di quest'artista",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    }
};