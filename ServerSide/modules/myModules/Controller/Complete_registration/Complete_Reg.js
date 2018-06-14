var complete_reg = require('../../model/registration/Complete_reg');
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports={
  search_artista:function(searched,callback){
      var toSearch = searched.replace(' ','%');
      toSearch = '%'+toSearch+'%';
      complete_reg.find_artist(toSearch,function (err,succ,code){
         if(err!== null) return callback({code:code,status:400,text:"Servizio al momento non disponibile, riprova più tardi",errorCode:err.code});
         return callback({code:code,status:200,text:succ});
      });
  },

    search_genere:function(searched,callback){
        var toSearch = searched.replace(' ','%');
        toSearch = '%'+toSearch+'%';
        complete_reg.find_genere(toSearch,function (err,succ,code){
            if(err!== null) return callback({code:code,status:400,text:"Servizio al momento non disponibile, riprova più tardi",errorCode:err.code});
            return callback({code:code,status:200,text:succ});
        });
    },

    complete_reg:function (EndArray,email,callback) {
      var Artist_array=[];
      var Genere_array=[];
      var codutente = GetHash.GetCodUtente(email);
      for(var typename in EndArray){
          if(EndArray[typename].type === "artist"){
              Artist_array.push(codutente,EndArray[typename].cod);
          }else if(EndArray[typename].type === "genere"){
              Genere_array.push(codutente,EndArray[typename].cod);
          }
      }
      complete_reg.complete_reg(Artist_array,Genere_array,function (err,succ,code){
         if(err!==null) return callback({code:code,status:400,text:"Non è stato possibile confermare le preferenze",errorCode:err.code});
          complete_reg.flag_complete_reg(codutente,function (err,succ,code){
              if(err!==null) return callback({code:code,status:400,text:"Qualcosa è andato storto, per favore riprova più tardi",errorCode:err.code});
              return callback({code:code,status:200,text:"Profilo Completato, Benvenuto su PlayAround"});
          });
      });
    }

};