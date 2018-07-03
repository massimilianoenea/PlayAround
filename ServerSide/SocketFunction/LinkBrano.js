var branoLink = require('../modules/myModules/model/socketLinkBrano/SocketLinkBrano');

module.exports = {
    GetLinkBrano: function(codbrano,callback){
        branoLink.getLink(codbrano,function(err,succ,code){
            if (err !== null){
                switch (code){
                    case 1:
                        return callback({code:1,text:"Errore connessione al database",errorCode:err.code});
                    case 2:
                        return callback({code:2,text:"Errore nella ricerca del link",errorCode:err.code});
                    default:
                        return callback({code:3,text:"Errore indefinito",errorCode:err.code});
                }
            }else{
                return callback({code:0,link:succ[0].LINK});
            }
        });
    }  
};