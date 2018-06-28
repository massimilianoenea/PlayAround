var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports = {

  get_artista: function(codartista,email,callback){
      connection.getConnection(function(err,connection){
          if (err) {
              return callback(err,null,1);
          }
          var sql = "SELECT * FROM ARTISTA WHERE CODARTISTA = ?";
          connection.query(sql,[codartista],function (err,results) {
              var res = results[0];
              if(err || results.length === 0) {
                  return callback('err',null,2);
              }
              sql = "SELECT * FROM FOLLOW_ARTISTI WHERE CODARTISTA = ? AND CODUTENTE LIKE ?";
              connection.query(sql,[codartista,GetHash.GetCodUtente(email)],function(err,results){
                  if(err) {
                      return callback(err,null,3);
                  }
                  if(results.length === 0){
                      connection.release();
                      return callback(null,res,0);
                  }
                  connection.release();
                  return callback(null,res,1);
              });
          });
      });
  },

    get_artisti_seguiti: function(username,callback){
        connection.getConnection(function(err,connection) {
            if (err) {
                connection.release();
                return callback(err, null, 1);
            }
            var sql="SELECT * FROM ARTISTA WHERE CODARTISTA IN (SELECT CODARTISTA FROM FOLLOW_ARTISTI WHERE CODUTENTE IN (SELECT CODUTENTE FROM UTENTI WHERE USERNAME LIKE ?))";
            connection.query(sql,[username],function(err,results){
                if(err) {
                    connection.release();
                    return callback(err,null,2);
                }
                connection.release();
                return callback(null,results,0);
            });
        });
    },

    get_last_album: function(codartista,callback){
        connection.getConnection(function (err,connection) {
            if (err) {
                connection.release();
                return callback(err, null, 1);
            }
            var sql = "SELECT CODALBUM,TITOLO,ANNO,IMMAGINE FROM ALBUM WHERE CODALBUM IN(SELECT CODALBUM FROM BRANI WHERE CODARTISTA LIKE ?) ORDER BY ANNO";
            connection.query(sql,[codartista], function(err, results) {
                if(err) {
                    connection.release();
                    return callback(err, null, 2);
                }
                connection.release();
                return callback(null,results,0);
            });
        });
    }
};