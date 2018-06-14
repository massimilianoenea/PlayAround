var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports = {

  get_artista: function(codartista,email,callback){
      connection.getConnection(function(err,connection){
          if (err) return callback(err,null,1);
          var sql = "SELECT TIPO,NOME,NOME_ARTE,NAZIONALITA FROM ARTISTA WHERE CODARTISTA = ?";
          connection.query(sql,[codartista],function (err,results) {
              var res = results;
              if(err || results.length === 0) return callback('err',null,2);
              sql = "SELECT * FROM FOLLOW_ARTISTI WHERE CODARTISTA = ? AND CODUTENTE LIKE ?";
              connection.query(sql,[codartista,GetHash.GetCodUtente(email)],function(err,results){
                  if(err) return callback(err,null,3);
                  if(results.length === 0)return callback(null,res,0);
                  return callback(null,res,1);
              });
          });
      });
  },

    get_artisti_seguiti: function(email,callback){
        connection.getConnection(function(err,connection) {
            if (err) return callback(err, null, 1);
            var sql="SELECT TIPO,NOME,NOME_ARTE,NAZIONALITA FROM ARTISTA WHERE CODARTISTA IS IN (SELECT CODARTISTA FROM FOLLOW_ARTISTI WHERE CODUTENTE LIKE ?";
            connection.query(sql,[GetHash.GetCodUtente(email)],function(err,results){
                if(err) return callback(err,null,2);
                return callback(null,results,0);
            });
        });
    },

    get_last_album: function(codartista,callback){
        connection.getConnection(function (err,connection) {
            if (err) return callback(err, null, 1);
            var sql = "SELECT CODALBUM,TITOLO,ANNO FROM ALBUM WHERE CODALBUM IS IN(SELECT CODALBUM FROM BRANI WHERE CODARTISTA LIKE ?) ORDER BY ANNO LIMIT 5";
            connection.query(sql,[codartista], function(err, results) {
                if(err) return callback(err,null,2);
                return callback(null,results,0);
            });
        });
    },


};