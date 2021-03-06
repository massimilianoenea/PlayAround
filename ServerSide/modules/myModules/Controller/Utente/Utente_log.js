var login = require('../../model/Login/tryLogin');
var singup = require('../../model/registration/insertNew');

module.exports={
  Get_login: function (user,callback) {
      login.LoginUser(user,function (err,succ,code){
          if (err !== null){
              switch (code){
                  case 1:
                      return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                  case 2:
                      return callback({code:2,text:"Email inserita non è corretta",errorCode:err.code,status:400});
                  case 3:
                      return callback({code:3,text:"Account esistente ma registrazione non confermata",errorCode:err.code,status:400});
                  case 4:
                      return callback({code:4,text:"Password sbagliata",errorCode:err.code,status:400});
                  default:
                      return callback({code:5,text:"Errore indefinito",errorCode:err.code,status:400});
              }
          }else{
              return callback({code:0,username:succ.USERNAME,email:succ.EMAIL,completed:succ.COMPLETED,status:200});
          }
      });
  },

    Get_singup: function (user,url,callback){

      singup.InsertUser(user,url,function (err,succ,code) {
          if (err !== null){
              switch (code){
                  case 1:
                      return callback ({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                  case 2:
                      return callback ({code:2,text:"Email già utilizzata",errorCode:err.code,status:400});

                  case 3:
                      return callback ({code:3,text:"Username già utilizzato",errorCode:err.code,status:400});
                  default:
                      return callback ({code:4,text:"Errore indefinito",errorCode:err.code,status:400});
              }
          }else{
              return callback ({code:0,text:"Registrazione in attesa di conferma",status:200});
          }
      });
    },

    Confirm_singup: function(token,callback){

      singup.ConfirmRegistration(token,function (err,succ,code) {
          if(err!== null){
              switch (code) {
                  case 1:
                      return callback({code:code,text:"Errore connessione al database",errorCode:err.code,status:400});
                  case 2:
                      return callback({code:code,text:"Il link è scaduto, effettua una nuova registrazione",errorCode:err.code,status:400});
                  default:
                      return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
              }
          }else{
              return callback ({code:0,status:200});
          }
      });
    }
};