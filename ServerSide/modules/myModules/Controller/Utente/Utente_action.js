var utente_action = require('../../model/Utente_action/Utente_action');

module.exports ={
  add_amico:function(email,username_amico,callback){
      utente_action.Add_amico(email,username_amico,function(err,succ,code){
          if (err !== null){
              switch (code){
                  case 1:
                      return callback({code:1,text:"Errore connessione al database",errorCode:err.code});
                  case 2:
                      return callback({code:2,text:"Impossibile aggiungere "+ username_amico,errorCode:err.code});
                  default:
                      return callback({code:3,text:"Errore indefinito",errorCode:err.code});
              }
          }else{
              return callback({code:0,text:"tu e "+username_amico+" adesso siete amici"});
          }
      });
  }
};