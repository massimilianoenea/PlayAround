var friendModel = require('../modules/myModules/SocketModel/Friend');

module.exports = {
  GetFriend: function(email,callback){
    friendModel.GetAmici(email,function(err,succ,code){
        if (err !== null){
            switch (code){
                case 1:
                    return callback({code:1,text:"Errore connessione al database",errorCode:err.code});
                case 2:
                    return callback({code:2,text:"Errore nella ricerca degli utenti",errorCode:err.code});
                default:
                    return callback({code:3,text:"Errore indefinito",errorCode:err.code});
            }
        }else{
            return callback({code:0,amici_on:succ});
        }
    });
  }
};