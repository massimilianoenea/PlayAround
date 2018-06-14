var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports = {
  ascoltati_di_recente: function(username,callback){
      connection.getConnection(function (err,connection){
          if(err)  return callback(err,null,1);
          var sql = "SELECT CODUTENTE FROM UTENTI WHERE USERNAME = ? LIMIT 1";
          connection.query(sql,[username], function(err, results) {
              if(results.length === 0 || err) return callback('err',null,2);
              sql = "SELECT CODBRANO,TITOLO,IMMAGINE FROM BRANI WHERE CODBRANO IS IN (SELECT CODBRANO,DATA FROM BRANI_ASCOLTATI WHERE CODUTENTE = ? ORDER BY DATA)";
              connection.query(sql,[results[0].CODUTENTE], function(err, results) {
                  if (err) return callback(err, null, 3);
                  return callback(null,results,0);
              });
          });
      });
  },

   ascoltano_amici: function(email,callback){
       connection.getConnection(function (err,connection){
           if(err)  return callback(err,null,1);
           var sql = "SELECT CODBRANO,TITOLO,IMMAGINE FROM BRANI WHERE CODBRANO IS IN (SELECT CODBRANO,DATA FROM BRANI_ASCOLTATI WHERE CODUTENTE IS IN (SELECT CODUTENTE_AMICO FROM UTENTI_AMICI WHERE CODUTENTE = ?) ORDER BY DATA";
           connection.query(sql,[GetHash.GetCodUtente(email)], function(err, results) {
               if (err) return callback(err, null, 2);
               return callback(null,results,0);
           });
       });
   },

    get_full_brano: function(codbrano,callback){
      connection.getConnection(function(err,connection){
         if(err) return callback(err,null,1);
         var sql = "SELECT * FROM BRANI WHERE CODBRANO = ?";
          connection.query(sql,[codbrano], function(err, results) {
              if (err) return callback(err, null, 2);
              return callback(null,results,0);
          });
      });
    },

    get_canzoni_salvate: function(email,callback){
      connection.getConnection(function (err,connection) {
          if(err) return callback(err,null,1);
          var sql = "SELECT CODBRANO,TITOLO,IMMAGINE FROM BRANI WHERE CODBRANO IS IN(SELECT CODBRANO FROM BRANI_SALVATI WHERE CODUTENTE = ?)";
          connection.query(sql,[GetHash.GetCodUtente(email)], function(err, results) {
              if (err) return callback(err, null, 2);
              return callback(null,results,0);
          });
      });
    },

    get_piu_ascoltate: function(codartista,callback){
      connection.getConnection(function (err,connection){
         if(err) return callback(err,null,1);
         var sql = "";

         if(codartista === ""){
             sql = "SELECT CODBRANO,TITOLO,IMMAGINE FROM BRANI WHERE CODBRANO IS IN (SELECT CODBRANO,COUNTER FROM BRANI_ASCOLTATI GROUP BY CODBRANO ORDER BY COUNTER LIMIT 10)";
         }else{
             sql = "SELECT CODBRANO,TITOLO,IMMAGINE FROM BRANI WHERE CODARTISTA ='"+codartista+"' AND CODBRANO IS IN (SELECT CODBRANO,COUNTER FROM BRANI_ASCOLTATI GROUP BY CODBRANO ORDER BY COUNTER LIMIT 10)";
         }

          connection.query(sql, function(err, results) {
              if (err) return callback(err, null, 2);
              return callback(null,results,0);
          });
      });
    }

};