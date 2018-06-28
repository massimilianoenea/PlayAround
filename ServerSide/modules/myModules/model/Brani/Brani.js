var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports = {
  ascoltati_di_recente: function(username,callback){
      connection.getConnection(function (err,connection){
          if(err) {
              return callback(err, null, 1);
          }
          var sql = "SELECT CODUTENTE FROM UTENTI WHERE USERNAME = ? LIMIT 1";
          connection.query(sql,[username], function(err, results) {
              if(results.length === 0 || err){
                  return callback('err',null,2);
              }
              sql = "SELECT b.codbrano as codice, b.titolo as titolo, b.anno as anno, b.immagine as immagine, al.titolo as album, ar.nome as artista FROM BRANI b, artista ar, album al WHERE al.codalbum = b.codalbum and ar.codartista = b.codartista and b.CODBRANO IN (SELECT CODBRANO FROM BRANI_ASCOLTATI WHERE CODUTENTE = ? ORDER BY DATA)";
             // sql = "SELECT CODBRANO,TITOLO,IMMAGINE FROM BRANI WHERE CODBRANO IN (SELECT CODBRANO FROM BRANI_ASCOLTATI WHERE CODUTENTE = ? ORDER BY DATA)";
              connection.query(sql,[results[0].CODUTENTE], function(err, results) {
                  if (err){
                      return callback(err, null, 3);
                  }
                  connection.release();
                  return callback(null,results,0);
              });
          });
      });
  },

   ascoltano_amici: function(email,callback){
       connection.getConnection(function (err,connection){
           if(err){
               return callback(err,null,1);
           }
           var sql = "SELECT b.codbrano as codice, b.titolo as titolo, b.anno as anno, b.immagine as immagine, al.titolo as album, ar.nome as artista FROM BRANI b, artista ar, album al WHERE al.codalbum = b.codalbum and ar.codartista = b.codartista and b.CODBRANO IN (SELECT CODBRANO FROM BRANI_ASCOLTATI WHERE CODUTENTE IN (SELECT CODUTENTE_AMICO FROM UTENTI_AMICI WHERE CODUTENTE = ?) ORDER BY DATA)";
           //var sql = "SELECT CODBRANO,TITOLO,IMMAGINE FROM BRANI WHERE CODBRANO IN (SELECT CODBRANO FROM BRANI_ASCOLTATI WHERE CODUTENTE IN (SELECT CODUTENTE_AMICO FROM UTENTI_AMICI WHERE CODUTENTE = ?) ORDER BY DATA)";
           connection.query(sql,[GetHash.GetCodUtente(email)], function(err, results) {
               if (err){
                   return callback(err, null, 2);
               }
               connection.release();
               return callback(null,results,0);
           });
       });
   },

    get_full_brano: function(codbrano,callback){
      connection.getConnection(function(err,connection){
         if(err) {
             return callback(err,null,1);
         }
         var sql = "SELECT b.codbrano as codice, b.titolo as titolo, b.anno as anno, b.immagine as immagine, al.titolo as album, ar.nome as artista FROM BRANI b, artista ar, album al WHERE al.codalbum = b.codalbum and ar.codartista = b.codartista and b.CODBRANO = ?";
          connection.query(sql,[codbrano], function(err, results) {
              if (err) {
                  return callback(err, null, 2);
              }
              connection.release();
              return callback(null,results,0);
          });
      });
    },

    get_full_brano_titolo: function(titolo,callback){
        connection.getConnection(function(err,connection){
            if(err) {
                return callback(err,null,1);
            }
            var sql = "SELECT b.codbrano as codice, b.titolo as titolo, b.anno as anno, b.immagine as immagine, al.titolo as album, ar.nome as artista FROM BRANI b, artista ar, album al WHERE al.codalbum = b.codalbum and ar.codartista = b.codartista and b.titolo LIKE ? ORDER BY LEVENSHTEIN(b.titolo,?)";
            connection.query(sql,[titolo,titolo], function(err, results) {
                if (err) {
                    return callback(err, null, 2);
                }
                connection.release();
                return callback(null,results,0);
            });
        });
    },

    set_canzoni_salvate: function(email,codbrano,callback){
        connection.getConnection(function (err,connection) {
            if(err) {
                return callback(err,null,1);
            }
            var sql = "INSERT INTO BRANI_SALVATI (CODUTENTE,CODBRANO) VALUES (?,?)";
            connection.query(sql,[GetHash.GetCodUtente(email),codbrano], function(err, results) {
                if (err) {
                    return callback(err, null, 2);
                }
                connection.release();
                return callback(null,results,0);
            });
        });
    },

    get_canzoni_salvate: function(email,callback){
      connection.getConnection(function (err,connection) {
          if(err) {
              return callback(err,null,1);
          }
          var sql = "SELECT b.codbrano as codice, b.titolo as titolo, b.anno as anno, b.immagine as immagine, al.titolo as album, ar.nome as artista FROM BRANI b, artista ar, album al WHERE al.codalbum = b.codalbum and ar.codartista = b.codartista and b.CODBRANO IN(SELECT CODBRANO FROM BRANI_SALVATI WHERE CODUTENTE = ?)";
          connection.query(sql,[GetHash.GetCodUtente(email)], function(err, results) {
              if (err) {
                  return callback(err, null, 2);
              }
              connection.release();
              return callback(null,results,0);
          });
      });
    },

    get_piu_ascoltate: function(codartista,callback){
      connection.getConnection(function (err,connection){
         if(err) {
             return callback(err,null,1);
         }
         var sql = "";

         if(codartista === ""){
             sql = "SELECT b.codbrano as codice, b.titolo as titolo, b.anno as anno, b.immagine as immagine, al.titolo as album, ar.nome as artista FROM BRANI b, artista ar, album al WHERE al.codalbum = b.codalbum and ar.codartista = b.codartista and b.CODBRANO IN (SELECT CODBRANO FROM BRANI_ASCOLTATI GROUP BY CODBRANO ORDER BY COUNTER)";
         }else{
             sql = "SELECT b.codbrano as codice, b.titolo as titolo, b.anno as anno, b.immagine as immagine, al.titolo as album, ar.nome as artista FROM BRANI b, artista ar, album al WHERE al.codalbum = b.codalbum and ar.codartista = b.codartista and b.CODARTISTA ='"+codartista+"' AND b.CODBRANO IN (SELECT CODBRANO FROM BRANI_ASCOLTATI GROUP BY CODBRANO ORDER BY COUNTER)";
         }

          connection.query(sql, function(err, results) {
              if (err) {
                  return callback(err, null, 2);
              }
              connection.release();
              return callback(null,results,0);
          });
      });
    }

};