var brani_model = require('../../model/Brani/Brani');

module.exports = {
  ascoltati_di_recente : function(username,callback){
      brani_model.ascoltati_di_recente(username,function(err,succ,code){
          if (err !== null){
              switch (code){
                  case 1:
                      return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                  case 2:
                      return callback({code:2,text:"Non esiste nessun utente associato a questo username",errorCode:err.code,status:400});
                  case 3:
                      return callback({code:3,text:"Non hai ascoltato ancora nessuna canzone",errorCode:err.code,status:400});
                  default:
                      return callback({code:4,text:"Errore indefinito",errorCode:err.code,status:400});
              }
          }else{
              return callback({code:0,data:succ,status:200});
          }
      });
  },

    ascoltano_amici : function(email,callback){
        brani_model.ascoltano_amici(email,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Errore, canzoni non caricate",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    },

    get_full_brano : function(codbrano,callback){
        brani_model.get_full_brano(codbrano,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile trovare il brano",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    },

    get_full_brano_titolo : function(titolo,callback){
        var toSearch = titolo.replace(/ /g,'%');
        toSearch = '%'+toSearch+'%';
        brani_model.get_full_brano_titolo(toSearch,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile trovare il brano",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    },

    set_canzoni_salvate : function(email,codbrano,callback){
        brani_model.set_canzoni_salvate(email,codbrano,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile salvare il branio",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    },

    remove_canzoni_salvate : function(email,codbrano,callback){
        brani_model.remove_canzoni_salvate(email,codbrano,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile rimuovere il branio",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    },

    get_canzoni_salvate : function(email,callback){
        brani_model.get_canzoni_salvate(email,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile caricare i brani",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    },

    get_piu_ascoltate : function(codartista,callback){
        brani_model.get_piu_ascoltate(codartista,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile caricare i brani",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,data:succ,status:200});
            }
        });
    }

};