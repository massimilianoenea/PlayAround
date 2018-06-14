var utente_action = require('../../model/Utente_action/Utente_action');

module.exports ={
    get_utente: function(username,email,callback){
      utente_action.get_utente(username,email,function(err,succ,code){
          if (err !== null){
              switch (code){
                  case 1:
                      return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                  case 2:
                      return callback({code:2,text:"Impossibile visualizzare il profilo dell'utente",errorCode:err.code,status:400});
                  default:
                      return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
              }
          }else{
              if(code === 0) return callback({code:0,text:succ,status:200,amici:true});
              if(code === 1) return callback({code:0,text:succ,status:200,amici:false});
          }
      });
    },
    get_amici : function(email,callback){
        utente_action.get_amici(email,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Errore nella ricerca degli utenti",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,text:succ,status:200});
            }
        });
    },

  add_amico:function(email,username_amico,callback){
      utente_action.Add_amico(email,username_amico,function(err,succ,code){
          if (err !== null){
              switch (code){
                  case 1:
                      return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                  case 2:
                      return callback({code:2,text:"Impossibile aggiungere "+ username_amico,errorCode:err.code,status:400});
                  default:
                      return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
              }
          }else{
              return callback({code:0,text:"tu e "+username_amico+" adesso siete amici",status:200});
          }
      });
  },
    delete_amico:function(email,username_amico,callback){
        utente_action.Delete_amico(email,username_amico,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                    case 2:
                        return callback({code:2,text:"Impossibile rimuovere "+ username_amico+" dagli amici",errorCode:err.code,status:400});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
                }
            }else{
                return callback({code:0,text:"tu e "+username_amico+" adesso non siete amici",status:200});
            }
        });
    }
};